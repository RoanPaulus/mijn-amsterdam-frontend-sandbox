import classnames from 'classnames';
import { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AppRoutes } from '../../../universal/config';
import { ChapterTitles } from '../../../universal/config/chapter';
import { IconClose, IconSearch } from '../../assets/icons';
import { ReactComponent as Logo } from '../../assets/images/logo-amsterdam.svg';
import { usePhoneScreen, useTabletScreen } from '../../hooks';
import { useTermReplacement } from '../../hooks/useTermReplacement';
import Linkd, { Button, IconButton } from '../Button/Button';
import mainHeaderStyles from '../MainHeader/MainHeader.module.scss';
import { Search } from '../Search/Search';
import { SearchEntry } from '../Search/searchConfig';
import { useSearchOnPage } from '../Search/useSearch';
import styles from './MyArea.module.scss';

interface MyAreaHeaderProps {
  showCloseButton?: boolean;
}

export default function MyAreaHeader({
  showCloseButton = true,
}: MyAreaHeaderProps) {
  const history = useHistory();
  const isPhoneScreen = usePhoneScreen();
  const isTabletOrSmaller = useTabletScreen();
  const termReplace = useTermReplacement();

  const { isSearchActive, setSearchActive, trackSearchBarEvent } =
    useSearchOnPage();

  const replaceResultUrl = useCallback((result: SearchEntry) => {
    return result.url.startsWith(AppRoutes.BUURT);
  }, []);

  return (
    <>
      <div className={styles.Header}>
        <nav
          className={classnames(
            mainHeaderStyles.DirectSkipLinks,
            styles.DirectSkipLinks
          )}
        >
          <Linkd external={true} tabIndex={0} href="#skip-to-id-LegendPanel">
            Direct naar: <b>Legenda paneel</b>
          </Linkd>
        </nav>

        <Link
          className={styles.LogoLink}
          to={AppRoutes.ROOT}
          title="Terug naar home"
        >
          <Logo
            role="img"
            aria-label="Gemeente Amsterdam logo"
            className={styles.Logo}
          />
          <h1 className={styles.Title}>{termReplace(ChapterTitles.BUURT)}</h1>
        </Link>
        {(!isPhoneScreen || isSearchActive) && (
          <div className={styles.SearchBar}>
            <div className={styles.SearchBarInner}>
              <Search
                onFinish={(reason) => {
                  if (reason) {
                    setSearchActive(false);
                    trackSearchBarEvent(`Automatisch sluiten (${reason})`);
                  }
                }}
                replaceResultUrl={replaceResultUrl}
              />
            </div>
          </div>
        )}
        {isPhoneScreen && !isSearchActive && (
          <div className={styles.SearchButtonWrapper}>
            <IconButton
              icon={IconSearch}
              title="Zoekbalk openen"
              onClick={() => {
                setSearchActive(true);
              }}
            />
          </div>
        )}
        {isTabletOrSmaller ? (
          <IconButton
            icon={IconClose}
            title={isSearchActive ? 'Zoekbalk sluiten' : 'Kaart sluiten'}
            onClick={() => {
              isSearchActive
                ? setSearchActive(!isSearchActive)
                : history.push(AppRoutes.ROOT);
            }}
          />
        ) : (
          <Button
            onClick={() => {
              history.push(AppRoutes.ROOT);
            }}
          >
            Kaart sluiten
          </Button>
        )}
      </div>
    </>
  );
}
