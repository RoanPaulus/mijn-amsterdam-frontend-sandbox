import { AppContext } from 'AppState';
import DirectLinks from 'components/DirectLinks/DirectLinks';
import MyArea from 'components/MyArea/MyArea';
import MyCases from 'components/MyCases/MyCases';
import MyChaptersPanel from 'components/MyChaptersPanel/MyChaptersPanel';
import MyTips from 'components/MyTips/MyTips';
import MyUpdates from 'components/MyUpdates/MyUpdates';
import PageContentMain from 'components/PageContentMain/PageContentMain';
import PageContentMainBody from 'components/PageContentMainBody/PageContentMainBody';
import PageContentMainHeading from 'components/PageContentMainHeading/PageContentMainHeading';
import { usePhoneScreen } from 'hooks/media.hook';
import React, { useContext, useMemo } from 'react';

import styles from './Dashboard.module.scss';
import { Link } from 'react-router-dom';
import { AppRoutes } from 'App.constants';
import { itemClickPayload } from 'hooks/piwik.hook';
import { getFullAddress } from 'data-formatting/brp';

const MAX_UPDATES_VISIBLE = 3;
const MAX_TIPS_VISIBLE = 3;

export default () => {
  const {
    MY_UPDATES: {
      data: { items: myUpdateItems, total: myUpdatesTotal },
      isLoading: isMyUpdatesLoading,
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
    BRP: { adres },
  } = useContext(AppContext);

  const tipItems = myTips.slice(0, MAX_TIPS_VISIBLE);
  const actualUpdateItems = myUpdateItems.filter(item => item.isActual);
  const isPhoneScreen = usePhoneScreen();
  const fullAddress = useMemo(() => {
    return adres && getFullAddress(adres);
  }, [adres]);

  return (
    <PageContentMain className={styles.Dashboard} variant="full">
      <PageContentMainHeading variant="medium">
        <Link
          className={styles.MyUpdatesHeadingLink}
          to={AppRoutes.MY_UPDATES}
          data-track={itemClickPayload(
            'MA_Dashboard/Mijn_meldingen',
            'Hoofd_titel'
          )}
        >
          Mijn meldingen
        </Link>
      </PageContentMainHeading>
      <PageContentMainBody variant="regularBoxed" className={styles.FirstBody}>
        <MyUpdates
          total={actualUpdateItems.length}
          items={actualUpdateItems.slice(0, MAX_UPDATES_VISIBLE)}
          showMoreLink={myUpdatesTotal > 0}
          isLoading={isMyUpdatesLoading}
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
          <MyArea
            trackCategory={'MA_Dashboard/Mijn_Buurt'}
            simpleMap={true}
            address={fullAddress}
          />
        </PageContentMainBody>
      )}
      <PageContentMainBody variant="regularBoxed">
        {!isPhoneScreen && (
          <MyTips isLoading={!!isMyTipsLoading} items={tipItems} />
        )}
        <DirectLinks />
      </PageContentMainBody>
    </PageContentMain>
  );
};
