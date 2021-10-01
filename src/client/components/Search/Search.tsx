import classnames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useDebouncedCallback from 'use-debounce/lib/useDebouncedCallback';
import { AppRoutes } from '../../../universal/config';
import { IconChevronRight, IconSearch } from '../../assets/icons';
import { Colors } from '../../config/app';
import {
  trackEventWithProfileType,
  trackSearch,
} from '../../hooks/analytics.hook';
import { useKeyDown } from '../../hooks/useKey';
import {
  useProfileTypeSwitch,
  useProfileTypeValue,
} from '../../hooks/useProfileType';
import Linkd, { Button, IconButton } from '../Button/Button';
import Heading from '../Heading/Heading';
import styles from './Search.module.scss';
import { SearchEntry } from './searchConfig';
import { useSearchIndex, useSearchResults, useSearchTerm } from './useSearch';

interface ResultSetProps {
  results: SearchEntry[];
  title?: string;
  noResultsMessage?: string;
  isLoading?: boolean;
  term: string;
  extendedResults?: boolean;
  showIcon?: boolean;
}

export function ResultSet({
  results,
  title,
  isLoading = false,
  noResultsMessage = 'Geen resultaten',
  term,
  extendedResults = false,
  showIcon = false,
}: ResultSetProps) {
  return (
    <div className={styles.ResultSet}>
      {!!title && (
        <Heading className={styles.ResultSetTitle} size="tiny">
          {title}
        </Heading>
      )}
      {!!term && !results.length && !isLoading && (
        <p className={styles.NoResults}>{noResultsMessage}</p>
      )}
      <ul className={styles.ResultList}>
        {results.map((result, index) => (
          <li
            key={result.title + index}
            className={classnames(
              styles.ResultListItem,
              extendedResults && styles['is-extended']
            )}
          >
            <Linkd
              icon={showIcon ? IconChevronRight : null}
              external={result.url.startsWith('http')}
              href={result.url}
              className={styles.ResultSetLink}
            >
              {result.displayTitle ? result.displayTitle(term) : result.title}
              {extendedResults && (
                <p className={styles.ResultDescription}>
                  <span className={styles.ResultUrl}>{result.url}</span>
                  {result.description}
                </p>
              )}
            </Linkd>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SearchProps {
  onFinish?: (reason?: string) => void;
  term?: string;
  maxResultCountDisplay?: number;
  autoFocus?: boolean;
  typeAhead?: boolean;
  extendedAMResults?: boolean;
}

export function Search({
  onFinish,
  term: termInitial = '',
  maxResultCountDisplay = 10,
  autoFocus = true,
  typeAhead = true,
  extendedAMResults = false,
}: SearchProps) {
  const searchBarRef = useRef<HTMLInputElement>(null);
  const results = useSearchResults(extendedAMResults);
  const [isResultsVisible, setResultsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [term, setTerm] = useSearchTerm();
  const history = useHistory();
  const profileType = useProfileTypeValue();

  useSearchIndex();
  useProfileTypeSwitch(() => onFinish && onFinish('Profiel toggle'));

  const trackSearchBarEvent = useCallback(
    (action: string) =>
      trackEventWithProfileType(
        {
          category: 'Zoeken',
          name: `Zoek${
            history.location.pathname.includes(AppRoutes.SEARCH)
              ? 'pagina'
              : 'balk'
          } interactie`,
          action,
        },
        profileType
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profileType]
  );

  const trackSearchDebounced = useDebouncedCallback((term: string) => {
    if (term) {
      trackSearch(term);
    } else {
      trackSearchBarEvent('Verwijder term');
    }
  }, 2000);

  const setTermDebounced = useDebouncedCallback((term: string) => {
    setTerm(term);
    setIsTyping(false);
    if (!term) {
      setResultsVisible(false);
    }
  }, 300);

  const keyHandler = useCallback(
    (event: KeyboardEvent) => {
      const isEscape = event.key === 'Escape';
      if (isEscape && typeAhead) {
        event.preventDefault();
        if (isResultsVisible && term) {
          searchBarRef.current?.focus();
          setResultsVisible(false);
          trackSearchBarEvent('Verberg typeAhead resultaten met Escape toets');
        } else if (!isResultsVisible) {
          onFinish && onFinish('Escape toets');
        }
      }
    },
    [typeAhead, isResultsVisible, onFinish, term, trackSearchBarEvent]
  );

  useKeyDown(keyHandler);

  useEffect(() => {
    if (autoFocus) {
      // AutoFocus on the element doesn't seem to work properly with dynamic mounting
      searchBarRef.current?.focus();
    }
    if (termInitial && searchBarRef.current) {
      searchBarRef.current.value = termInitial;
    }
    return () => setTerm('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (results?.am?.state === 'hasValue' && results?.am?.contents !== null) {
      setIsDirty(true);
    }
  }, [results?.am?.state, results?.am?.contents]);

  useEffect(() => {
    if (term) {
      setResultsVisible(true);
    }
  }, [term]);

  return (
    <div
      className={classnames(styles.SearchBar, !typeAhead && styles['in-page'])}
    >
      <form
        className={styles.Form}
        onSubmit={(e) => {
          e.preventDefault();
          if (term) {
            trackSearchBarEvent('Submit search');
            history.push(
              `${AppRoutes.SEARCH}?${new URLSearchParams(`term=${term}`)}`
            );
            setResultsVisible(true);
          }
        }}
      >
        <input
          ref={searchBarRef}
          className={styles.Input}
          autoComplete="none"
          autoCorrect="none"
          autoCapitalize="none"
          spellCheck="false"
          placeholder={
            results.isIndexReady ? 'Zoeken naar...' : 'Zoeken voorbereiden...'
          }
          onFocus={() => {
            if (term) {
              setResultsVisible(true);
            }
          }}
          onChange={(e) => {
            setIsTyping(true);
            setResultsVisible(true);
            const term = e.target.value;
            setTermDebounced(term);
            trackSearchDebounced(term);
          }}
        />

        <IconButton
          className={styles.SubmitButton}
          aria-label="Verstuur zoekopdracht"
          type="submit"
          iconSize="36"
          iconFill={Colors.white}
          icon={IconSearch}
        />
      </form>

      {isResultsVisible && (
        <div className={styles.Results}>
          {!!results?.ma?.length && (
            <ResultSet
              term={term}
              isLoading={isTyping}
              results={results?.ma?.slice(0, maxResultCountDisplay / 2) || []}
              noResultsMessage="Niets gevonden op Mijn Amsterdam"
              showIcon={extendedAMResults}
            />
          )}
          {isDirty && (
            <>
              <ResultSet
                term={term}
                isLoading={results?.am?.state === 'loading' || isTyping}
                title="Overige informatie op Amsterdam.nl"
                noResultsMessage="Niets gevonden op Amsterdam.nl"
                extendedResults={extendedAMResults}
                results={
                  results?.am?.state === 'hasValue' &&
                  results?.am?.contents !== null
                    ? results.am.contents.slice(0, maxResultCountDisplay / 2)
                    : []
                }
              />
              {extendedAMResults && (
                <p>
                  <Button
                    onClick={() =>
                      (window.location.href = `https://www.amsterdam.nl/zoeken/?Zoe=${term}`)
                    }
                  >
                    Zoek verder op Amsterdam.nl
                  </Button>
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
