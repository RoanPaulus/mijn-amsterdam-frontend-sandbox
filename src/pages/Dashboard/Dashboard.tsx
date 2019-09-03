import { AppContext, TutorialContext } from 'AppState';
import DirectLinks from 'components/DirectLinks/DirectLinks';
import MyArea from 'components/MyArea/MyArea';
import MyCases from 'components/MyCases/MyCases';
import MyChaptersPanel from 'components/MyChaptersPanel/MyChaptersPanel';
import MyTips from 'components/MyTips/MyTips';
import MyNotifications from 'components/MyNotifications/MyNotifications';
import PageContentMain from 'components/PageContentMain/PageContentMain';
import PageContentMainBody from 'components/PageContentMainBody/PageContentMainBody';
import PageContentMainHeading from 'components/PageContentMainHeading/PageContentMainHeading';
import { usePhoneScreen } from 'hooks/media.hook';
import React, { useContext } from 'react';

import styles from './Dashboard.module.scss';
import { Link } from 'react-router-dom';
import { AppRoutes } from 'App.constants';
import { itemClickPayload } from 'hooks/analytics.hook';
import Tutorial from 'components/Tutorial/Tutorial';

const MAX_NOTIFICATIONS_VISIBLE = 3;
const MAX_TIPS_VISIBLE = 3;

export default () => {
  const {
    MY_NOTIFICATIONS: {
      data: { items: myNotificationItems, total: myNotificationsTotal },
      isLoading: isMyNotificationsLoading,
    },
    MY_CASES: {
      data: { items: myCases },
      isLoading: isMyCasesLoading,
    },
    MY_TIPS: {
      data: { items: myTips },
      isLoading: isMyTipsLoading,
    },
    MY_CHAPTERS: { items: myChapterItems, isLoading: isMyChaptersLoading },
    MY_AREA: {
      url: { simple: mapUrl },
    },
  } = useContext(AppContext);

  const tipItems = myTips.slice(0, MAX_TIPS_VISIBLE);
  const isPhoneScreen = usePhoneScreen();

  const { isTutorialVisible, setIsTutorialVisible } = useContext(
    TutorialContext
  );

  return (
    <>
      <PageContentMain className={styles.Dashboard} variant="full">
        <PageContentMainHeading variant="medium">
          <Link
            id="MyUpdatesHeader" // Used for tutorial placement
            className={styles.MyNotificationsHeadingLink}
            to={AppRoutes.MY_NOTIFICATIONS}
            data-track={itemClickPayload(
              'MA_Dashboard/Mijn_meldingen',
              'Hoofd_titel'
            )}
          >
            Mijn meldingen
          </Link>
        </PageContentMainHeading>
        <PageContentMainBody
          variant="regularBoxed"
          className={styles.FirstBody}
        >
          <MyNotifications
            total={myNotificationItems.length}
            items={myNotificationItems.slice(0, MAX_NOTIFICATIONS_VISIBLE)}
            showMoreLink={myNotificationsTotal > MAX_NOTIFICATIONS_VISIBLE}
            isLoading={isMyNotificationsLoading}
            trackCategory={'MA_Dashboard/Mijn_meldingen'}
          />
          <MyChaptersPanel
            isLoading={isMyChaptersLoading}
            items={myChapterItems}
            title="Mijn thema's"
          />
          <MyCases
            isLoading={!!isMyCasesLoading}
            title="Mijn lopende aanvragen"
            items={myCases}
            trackCategory={'MA_Dashboard/Mijn_lopende_aanvragen'}
          />
        </PageContentMainBody>
        {!isPhoneScreen && (
          <PageContentMainBody>
            <MyArea trackCategory={'MA_Dashboard/Mijn_Buurt'} url={mapUrl} />
          </PageContentMainBody>
        )}
        <PageContentMainBody variant="regularBoxed">
          {!isPhoneScreen && (
            <MyTips isLoading={!!isMyTipsLoading} items={tipItems} />
          )}
          <DirectLinks />
        </PageContentMainBody>
      </PageContentMain>
    </>
  );
};
