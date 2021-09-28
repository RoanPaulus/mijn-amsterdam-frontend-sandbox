import axios from 'axios';
import Fuse from 'fuse.js';
import { useEffect, useMemo, useRef } from 'react';
import {
  atom,
  Loadable,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import { pick, uniqueArray } from '../../../universal/helpers';
import { ApiSuccessResponse, isError } from '../../../universal/helpers/api';
import { AppState } from '../../AppState';
import { addAxiosResponseTransform } from '../../hooks/api/useDataApi';
import { appStateAtom, useAppStateGetter } from '../../hooks/useAppState';
import {
  profileTypeState,
  useProfileTypeSwitch,
  useProfileTypeValue,
} from '../../hooks/useProfileType';
import {
  ApiBaseItem,
  ApiSearchConfig,
  displayPath,
  getApiSearchConfigs,
  SearchEntry,
  staticIndex,
} from './searchConfig';

export function generateSearchIndexPageEntry(
  item: ApiBaseItem,
  apiConfig: ApiSearchConfig
): SearchEntry {
  const props: Array<
    Exclude<keyof ApiSearchConfig, 'getApiBaseItems' | 'apiName' | 'isEnabled'>
  > = [
    'keywordSourceProps',
    'title',
    'displayTitle',
    'description',
    'url',
    'keywords',
  ];

  const searchEntry = {} as SearchEntry;

  for (const prop of props) {
    const configValue = apiConfig[prop];

    let value =
      typeof configValue === 'function'
        ? configValue(item, apiConfig)
        : configValue;

    if (!value) {
      continue;
    }

    if (prop === 'keywords') {
      searchEntry.keywords = uniqueArray([
        ...(searchEntry.keywords || []),
        ...value,
      ]);
    } else if (prop === 'keywordSourceProps') {
      value = Object.values(pick(item, value));
      searchEntry.keywords = uniqueArray([
        ...(searchEntry.keywords || []),
        ...value,
      ]);
    } else {
      const key: keyof SearchEntry = prop;
      searchEntry[key] = value;
    }
  }

  return searchEntry;
}

export function generateSearchIndexPageEntries(
  profileType: ProfileType,
  apiName: string,
  apiContent: ApiSuccessResponse<any>['content']
): SearchEntry[] {
  const apiConfig = getApiSearchConfigs(profileType).find(
    (config) => config.apiName === apiName
  );
  const isEnabled =
    !!apiConfig && 'isEnabled' in apiConfig ? apiConfig.isEnabled : true;

  if (!apiConfig || !isEnabled) {
    return [];
  }

  return apiConfig
    .getApiBaseItems(apiContent)
    .map((item) => generateSearchIndexPageEntry(item, apiConfig));
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
        title: page.title,
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
  threshold: 0.6,
  includeScore: false,
  minMatchCharLength: 2,
  keys: ['title', { name: 'keywords', weight: 0.2 }],
};

export const searchConfigAtom = atom<{
  index: Fuse<SearchEntry> | null;
  apiNames: Array<keyof Partial<AppState>>;
}>({
  key: 'searchConfigState',
  default: {
    index: null,
    apiNames: [],
  },
});

export function useSearch() {
  return useRecoilState(searchConfigAtom);
}

export function useSearchIndex() {
  const [{ index }, setSearchConfig] = useSearch();
  const appState = useAppStateGetter();
  const profileType = useProfileTypeValue();
  const isIndexed = useRef(false);
  const chapterPageEntries = useMemo(() => {
    return staticIndex.filter((index) => {
      const isEnabled = 'isEnabled' in index ? index.isEnabled : true;
      return (
        isEnabled &&
        (!index.profileTypes || index.profileTypes.includes(profileType))
      );
    });
  }, [profileType]);

  useEffect(() => {
    const apiNamesToIndex = getApiSearchConfigs(profileType)
      .map((config) => config.apiName)
      .filter((stateKey) => !!appState[stateKey]?.status);

    const isAppStateReady = apiNamesToIndex.every((stateKey) => {
      return appState[stateKey].status !== 'PRISTINE';
    });

    if (isAppStateReady && !isIndexed.current) {
      isIndexed.current = true;

      const sindex = new Fuse(chapterPageEntries, options);
      const sApiNames: Array<keyof AppState> = [];

      for (const stateKey of apiNamesToIndex) {
        if (!isError(appState[stateKey]) && appState[stateKey]?.content) {
          const pageEntries = generateSearchIndexPageEntries(
            profileType,
            stateKey,
            appState[stateKey].content
          );
          for (const entry of pageEntries) {
            sindex.add(entry);
          }
        }
        sApiNames.push(stateKey);
      }

      setSearchConfig(() => ({
        index: sindex,
        apiNames: sApiNames,
      }));
    }
  }, [chapterPageEntries, appState, index, profileType, setSearchConfig]);

  useProfileTypeSwitch(() => {
    // Reset the search index
    isIndexed.current = false;
    setSearchConfig(() => ({
      index: null,
      apiNames: [],
    }));
  });
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

export const isIndexReadyQuery = selector({
  key: 'isIndexReady',
  get: ({ get }) => {
    const fuse = get(searchConfigAtom);
    const profileType = get(profileTypeState);
    const appState = get(appStateAtom);
    const apiNamesToIndex = getApiSearchConfigs(profileType)
      .map((config) => {
        return config.apiName;
      })
      .filter((stateKey) => !!appState[stateKey]?.status);

    const isIndexed = apiNamesToIndex.every((apiName) =>
      fuse.apiNames.includes(apiName)
    );

    return isIndexed;
  },
});

const mijnQuery = selector({
  key: 'mijnQuery',
  get: ({ get }) => {
    const term = get(searchTermAtom);
    const fuse = get(searchConfigAtom);
    const indexReady = get(isIndexReadyQuery);

    if (indexReady && fuse.index !== null && !!term) {
      const rawResults = fuse.index.search(term);
      return rawResults.map((result) => {
        return result.item;
      });
    }

    return [];
  },
});

export interface SearchResults {
  ma?: SearchEntry[];
  am?: Loadable<SearchEntry[] | null>;
  isIndexReady: boolean;
}

export function useSearchResults(
  useExtendedAmsterdamSearch: boolean = false
): SearchResults {
  return {
    isIndexReady: useRecoilValue(isIndexReadyQuery),
    ma: useRecoilValue(mijnQuery),
    am: useRecoilValueLoadable(amsterdamNLQuery(useExtendedAmsterdamSearch)),
  };
}
