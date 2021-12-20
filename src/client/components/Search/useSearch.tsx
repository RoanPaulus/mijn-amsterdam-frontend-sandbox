import axios from 'axios';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import {
  atom,
  Loadable,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import { AppRoutes } from '../../../universal/config';
import { useKeyUp } from '../../hooks/useKey';

import { pick, uniqueArray } from '../../../universal/helpers';
import { ApiResponse, isError } from '../../../universal/helpers/api';
import { AppState } from '../../AppState';
import { BFFApiUrls } from '../../config/api';
import { trackEventWithProfileType } from '../../hooks';
import { addAxiosResponseTransform } from '../../hooks/api/useDataApi';
import { useAppStateGetter, useAppStateReady } from '../../hooks/useAppState';
import {
  useProfileTypeSwitch,
  useProfileTypeValue,
} from '../../hooks/useProfileType';
import {
  ApiBaseItem,
  ApiSearchConfig,
  apiSearchConfigs,
  displayPath,
  SearchConfigRemote,
  SearchEntry,
} from './searchConfig';

export function generateSearchIndexPageEntry(
  item: ApiBaseItem,
  apiConfig: ApiSearchConfig
): SearchEntry {
  const props: Array<
    Exclude<keyof ApiSearchConfig, 'getApiBaseItems' | 'stateKey' | 'isEnabled'>
  > = [
    'keywordsGeneratedFromProps',
    'displayTitle',
    'description',
    'url',
    'keywords',
    'generateKeywords',
  ];

  const searchEntry = {} as SearchEntry;

  for (const prop of props) {
    const configValue = apiConfig[prop];
    const value =
      typeof configValue === 'function'
        ? configValue(item, apiConfig)
        : configValue;

    if (!value) {
      continue;
    }

    if (prop === 'keywords' || prop === 'generateKeywords') {
      searchEntry.keywords = [...(searchEntry.keywords || []), ...value];
    } else if (prop === 'keywordsGeneratedFromProps') {
      const generatedKeywordValues = Object.values(pick(item, value));
      searchEntry.keywords = [
        ...(searchEntry.keywords || []),
        ...generatedKeywordValues,
      ];
    } else {
      const key: keyof SearchEntry = prop;
      searchEntry[key] = value;
    }
  }

  if (searchEntry.keywords) {
    searchEntry.keywords = uniqueArray(searchEntry.keywords.filter((x) => !!x));
  }

  return searchEntry;
}

export function combineApiSearchConfigs(
  localConfigs: Array<ApiSearchConfig>,
  remoteConfigs: Record<
    keyof AppState,
    Partial<Omit<ApiSearchConfig, 'getApiBaseItems' | 'generateKeywords'>>
  >
) {
  return localConfigs.map((apiConfig) => {
    const remoteConfig = remoteConfigs[apiConfig.stateKey];
    if (remoteConfig) {
      const margedApiConfig = { ...apiConfig, ...remoteConfig };
      // Keywords and keywordsGeneratedFromProps are merged.
      apiConfig.keywords = [
        ...(apiConfig.keywords || []),
        ...(remoteConfig.keywords || []),
      ];
      apiConfig.keywordsGeneratedFromProps = [
        ...(apiConfig.keywordsGeneratedFromProps || []),
        ...(remoteConfig.keywordsGeneratedFromProps || []),
      ];
      apiConfig = margedApiConfig;
    }
    return apiConfig;
  });
}

export function generateSearchIndexPageEntries(
  profileType: ProfileType,
  appState: AppState,
  apiSearchConfigs: ApiSearchConfig[]
): SearchEntry[] {
  const apiConfigs = apiSearchConfigs.filter((apiConfig) => {
    const hasProperAppState =
      !isError(appState[apiConfig.stateKey]) &&
      !!appState[apiConfig.stateKey]?.content;
    const isEnabled =
      !!apiConfig && 'isEnabled' in apiConfig ? apiConfig.isEnabled : true;
    return (
      apiConfig.profileTypes?.includes(profileType) &&
      isEnabled &&
      hasProperAppState
    );
  });

  return apiConfigs.flatMap((apiConfig) =>
    apiConfig
      .getApiBaseItems(appState[apiConfig.stateKey].content)
      .map((item) => generateSearchIndexPageEntry(item, apiConfig))
  );
}

interface AmsterdamSearchResult {
  title: string;
  sections: string[];
  description: string;
  url: string;
  highlight: { title: string };
}

function transformSearchAmsterdamNLresponse(responseData: any): SearchEntry[] {
  if (Array.isArray(responseData?.records?.page)) {
    return responseData.records.page.map((page: AmsterdamSearchResult) => {
      return {
        displayTitle: (term: string) =>
          displayPath(term, [page.highlight.title || page.title], true, false),
        keywords: page.sections,
        description: page.description,
        url: page.url,
      };
    });
  }
  return [];
}

export async function searchAmsterdamNL(
  keywords: string,
  resultCountPerPage: number = 5,
  isExtendedAmsterdamSearch: boolean = false
) {
  const url = isExtendedAmsterdamSearch
    ? `https://api.swiftype.com/api/v1/public/engines/search.json?engine_key=zw32MDuzZjzNC8VutizD&page=1&per_page=${resultCountPerPage}&q=${keywords}&spelling=retry`
    : `https://api.swiftype.com/api/v1/public/engines/suggest.json?q=${keywords}&engine_key=zw32MDuzZjzNC8VutizD&per_page=${resultCountPerPage}`;

  const response = await axios.get<SearchEntry[]>(url, {
    transformResponse: addAxiosResponseTransform(
      transformSearchAmsterdamNLresponse
    ),
  });

  return response.data;
}

const options = {
  threshold: 0.4,
  minMatchCharLength: 2,
  keys: ['description', 'url', { name: 'keywords', weight: 0.2 }],
};

export const searchConfigAtom = atom<Fuse<SearchEntry> | null>({
  key: 'searchConfigState',
  default: null,
});

export function useStaticSearchEntries() {
  const remoteSearchConfig = useRecoilValueLoadable(searchConfigRemote);
  const profileType = useProfileTypeValue();

  return useMemo(() => {
    if (
      remoteSearchConfig.state === 'hasValue' &&
      remoteSearchConfig.contents?.staticSearchEntries
    ) {
      const staticEntries: SearchEntry[] =
        remoteSearchConfig.contents.staticSearchEntries;

      return staticEntries.filter((indexEntry) => {
        const isEnabled =
          'isEnabled' in indexEntry ? indexEntry.isEnabled : true;
        return (
          isEnabled &&
          (!indexEntry.profileTypes ||
            indexEntry.profileTypes.includes(profileType))
        );
      });
    }
    return null;
  }, [profileType, remoteSearchConfig]);
}

function useDynamicSearchEntries() {
  const isAppStateReady = useAppStateReady();
  const remoteSearchConfig = useRecoilValueLoadable(searchConfigRemote);
  const appState = useAppStateGetter();
  const profileType = useProfileTypeValue();
  let searchEntries = null;

  if (
    isAppStateReady &&
    remoteSearchConfig.state === 'hasValue' &&
    remoteSearchConfig.contents?.apiSearchConfigs
  ) {
    searchEntries = generateSearchIndexPageEntries(
      profileType,
      appState,
      combineApiSearchConfigs(
        apiSearchConfigs,
        remoteSearchConfig.contents?.apiSearchConfigs
      )
    );
  }
  return searchEntries;
}

export function useSearchIndex() {
  const isIndexed = useRef(false);
  const staticSearchEntries = useStaticSearchEntries();
  const dynamicSearchEntries = useDynamicSearchEntries();
  const [searchState, setSearchConfig] = useRecoilState(searchConfigAtom);

  useEffect(() => {
    if (
      (!!staticSearchEntries || !!dynamicSearchEntries) &&
      !isIndexed.current
    ) {
      isIndexed.current = true;

      const fuseInstance = new Fuse(
        [...(staticSearchEntries || []), ...(dynamicSearchEntries || [])],
        options
      );

      setSearchConfig(fuseInstance);
    }
  }, [dynamicSearchEntries, staticSearchEntries, setSearchConfig]);

  useProfileTypeSwitch(() => {
    // Reset the search index
    isIndexed.current = false;
    setSearchConfig(() => null);
  });

  return searchState;
}

export const searchTermAtom = atom<string>({
  key: 'searchTerm',
  default: '',
});

export function useSearchTerm() {
  return useRecoilState(searchTermAtom);
}

const amsterdamNLQuery = selectorFamily({
  key: 'amsterdamNLQuery',
  get:
    (useExtendedAmsterdamSearch: boolean) =>
    async ({ get }) => {
      const term = get(searchTermAtom);
      const response = term
        ? await searchAmsterdamNL(term, 10, useExtendedAmsterdamSearch)
        : null;
      return response;
    },
});

export const requestID = atom<number>({
  key: 'searchTermrequestID',
  default: 0,
});

export const searchConfigRemote = selector<SearchConfigRemote | null>({
  key: 'SearchConfigRemote',
  get: async ({ get }) => {
    // Subscribe to updates ffrom requestID to re-evaluate selector to reload the SEARCH_CONFIG
    get(requestID);
    const response: ApiResponse<SearchConfigRemote> = await fetch(
      BFFApiUrls.SEARCH_CONFIGURATION
    ).then((response) => response.json());

    return response.content;
  },
});

const mijnQuery = selector({
  key: 'mijnQuery',
  get: ({ get }) => {
    const term = get(searchTermAtom);
    const fuse = get(searchConfigAtom);

    if (fuse !== null && !!term) {
      const rawResults = fuse.search(term);

      return rawResults.map((result) => result.item);
    }

    return [];
  },
});

export interface SearchResults {
  ma?: SearchEntry[];
  am?: Loadable<SearchEntry[] | null>;
}

export function useSearchResults(
  useExtendedAmsterdamSearch: boolean = false
): SearchResults {
  return {
    ma: useRecoilValue(mijnQuery),
    am: useRecoilValueLoadable(amsterdamNLQuery(useExtendedAmsterdamSearch)),
  };
}

export function useSearchOnPage(): {
  isSearchActive: boolean;
  setSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
  trackSearchBarEvent: (action: string) => void;
  isDisplaySearch: boolean;
} {
  const profileType = useProfileTypeValue();
  const [isSearchActive, setSearchActive] = useState(false);
  const location = useLocation();
  const isDisplaySearch = !matchPath(location.pathname, {
    path: AppRoutes.SEARCH,
  });

  const trackSearchBarEvent = useCallback(
    (action: string) =>
      trackEventWithProfileType(
        {
          category: 'Zoeken',
          name: 'Zoekbalk open/dicht',
          action,
        },
        profileType
      ),
    [profileType]
  );

  useEffect(() => {
    setSearchActive(false);
    if (isSearchActive) {
      trackSearchBarEvent('Automatisch sluiten (navigatie)');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, trackSearchBarEvent]);

  useEffect(() => {
    if (isSearchActive) {
      document.body.classList.add('is-typeAheadActive');
    } else {
      document.body.classList.remove('is-typeAheadActive');
    }
  }, [isSearchActive]);
  useKeyUp((event) => {
    if (event.key === 'z' && !isSearchActive) {
      setSearchActive(true);
      trackSearchBarEvent('Openen met z toets');
    }
  });

  return {
    isSearchActive,
    setSearchActive,
    trackSearchBarEvent,
    isDisplaySearch,
  };
}
