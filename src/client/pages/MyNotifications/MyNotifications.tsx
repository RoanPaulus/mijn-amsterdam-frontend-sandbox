import { useEffect, useMemo, useRef } from 'react';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import { AppRoutes } from '../../../universal/config';
import { isError, isLoading } from '../../../universal/helpers';
import {
  Alert,
  ChapterIcon,
  DetailPage,
  MyNotifications,
  PageContent,
  PageHeading,
  Pagination,
} from '../../components';
import {
  WelcomeNotification2,
  WelcomeNotification2Commercial,
} from '../../config/staticData';
import { trackItemPresentation, useProfileTypeValue } from '../../hooks';
import { useAppStateGetter } from '../../hooks/useAppState';
import { useAppStateNotifications } from '../../hooks/useNotifications';
import styles from './MyNotifications.module.scss';

const PAGE_SIZE = 10;

export default function MyNotificationsPage() {
  const { NOTIFICATIONS } = useAppStateGetter();
  const notifications = useAppStateNotifications();
  const { page = '1' } = useParams<{ page?: string }>();
  const history = useHistory();
  const welcomNotificationShown = useRef<boolean>(false);
  const profileType = useProfileTypeValue();
  const trackCategory = 'Actueel overzicht';

  const currentPage = useMemo(() => {
    if (!page) {
      return 1;
    }
    return parseInt(page, 10);
  }, [page]);

  const itemsPaginated = useMemo(() => {
    const startIndex = currentPage - 1;
    const start = startIndex * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return notifications.slice(start, end);
  }, [currentPage, notifications]);
  const total = notifications.length;

  useEffect(() => {
    window.scrollBy({
      top: -document.documentElement.scrollTop,
      left: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

  if (
    itemsPaginated.some(
      (n) =>
        n.id === WelcomeNotification2.id ||
        n.id === WelcomeNotification2Commercial.id
    ) &&
    !welcomNotificationShown.current
  ) {
    // Send matomo event indicating we've shown the notification
    welcomNotificationShown.current = true;
    trackItemPresentation(
      trackCategory,
      'Welkom weespers melding',
      profileType
    );
  }

  return (
    <DetailPage className={styles.MyNotifications}>
      <PageHeading
        backLink={{
          to: AppRoutes.HOME,
          title: 'Home',
        }}
        className={styles.MainHeader}
        icon={<ChapterIcon />}
      >
        Actueel
      </PageHeading>
      <PageContent>
        {isError(NOTIFICATIONS) && (
          <Alert type="warning">
            <p>Niet alle updates kunnen op dit moment worden getoond.</p>
          </Alert>
        )}
      </PageContent>
      {total > PAGE_SIZE && (
        <PageContent>
          <Pagination
            className={styles.Pagination}
            totalCount={total}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onPageClick={(page) => {
              history.replace(generatePath(AppRoutes.NOTIFICATIONS, { page }));
            }}
          />
        </PageContent>
      )}
      <MyNotifications
        isLoading={isLoading(NOTIFICATIONS)}
        items={itemsPaginated}
        noContentNotification="Er zijn op dit moment geen actuele meldingen voor u."
        trackCategory="Actueel overzicht"
      />
      {total > PAGE_SIZE && (
        <PageContent>
          <Pagination
            className={styles.Pagination}
            totalCount={total}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onPageClick={(page) => {
              history.replace(generatePath(AppRoutes.NOTIFICATIONS, { page }));
            }}
          />
        </PageContent>
      )}
    </DetailPage>
  );
}
