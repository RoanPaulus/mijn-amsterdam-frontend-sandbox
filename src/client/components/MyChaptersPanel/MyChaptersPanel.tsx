import { AppRoutes, ChapterTitles } from '../../../universal/config';
import { ChapterIcons } from '../../config/chapterIcons';
import { ChapterMenuItem } from '../../config/menuItems';
import {
  trackItemPresentation,
  useSessionCallbackOnceDebounced,
} from '../../hooks/analytics.hook';
import Heading from '../Heading/Heading';
import LoadingContent from '../LoadingContent/LoadingContent';
import { MainNavSubmenuLink } from '../MainNavSubmenu/MainNavSubmenu';
import Panel from '../Panel/Panel';
import styles from './MyChaptersPanel.module.scss';
import { useProfileTypeValue } from '../../hooks/useProfileType';
import { IconInfo } from '../../assets/icons';
import Linkd from '../Button/Button';

export interface MyChaptersPanelProps {
  title: string;
  items: ChapterMenuItem[];
  isLoading: boolean;
  trackCategory: string;
  className?: string;
}

export default function MyChaptersPanel({
  title,
  items = [],
  isLoading = true,
  trackCategory,
}: MyChaptersPanelProps) {
  const profileType = useProfileTypeValue();
  // Use debounced value here because we want to avoid dependent loading flickr in the scenario: Api A done and Api B started request with data returned from B.
  useSessionCallbackOnceDebounced(trackCategory, () => {
    items.forEach(({ id }) => {
      trackItemPresentation(
        trackCategory,
        `Thema ${ChapterTitles[id] || id}`,
        profileType
      );
    });
  });

  return (
    <Panel className={styles.MyChaptersPanel}>
      <div className={styles.Header}>
        <Heading size="large" className={styles.Title}>
          {title}
        </Heading>
        <Linkd
          className={styles.GeneralInfoLink}
          href={AppRoutes.GENERAL_INFO}
          variant="plain"
          icon={IconInfo}
          lean={true}
          aria-label="Dit ziet u in Mijn Amsterdam"
        />
      </div>
      <div className={styles.Links}>
        {items.map(({ id, to, title, rel }) => {
          return (
            <MainNavSubmenuLink
              data-chapter-id={id}
              key={id}
              to={to}
              rel={rel}
              title={title}
              Icon={ChapterIcons[id]}
            />
          );
        })}
      </div>
      {isLoading && (
        <LoadingContent
          className={styles.LoadingPlaceholder}
          barConfig={[
            ['3.4rem', '3.4rem', '0'],
            ['auto', '1.6rem', '0'],
            ['3.4rem', '3.4rem', '0'],
            ['auto', '1.6rem', '0'],
          ]}
        />
      )}
    </Panel>
  );
}
