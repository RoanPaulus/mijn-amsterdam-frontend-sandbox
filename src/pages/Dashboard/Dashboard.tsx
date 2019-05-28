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
import React, { useContext } from 'react';

import styles from './Dashboard.module.scss';
import LoadingContent from '../../components/LoadingContent/LoadingContent';

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
  } = useContext(AppContext);

  const tipItems = myTips.slice(0, MAX_TIPS_VISIBLE);
  const actualUpdateItems = myUpdateItems.filter(item => item.isActual);

  return (
    <PageContentMain className={styles.Dashboard} variant="full">
      <PageContentMainHeading variant="medium">
        Mijn meldingen
        {!isMyUpdatesLoading &&
          actualUpdateItems.length > MAX_UPDATES_VISIBLE && (
            <span>&nbsp;({actualUpdateItems.length})</span>
          )}
      </PageContentMainHeading>
      <PageContentMainBody variant="regularBoxed" className={styles.FirstBody}>
        <MyUpdates
          total={actualUpdateItems.length}
          items={actualUpdateItems.slice(0, MAX_UPDATES_VISIBLE)}
          showMoreLink={myUpdatesTotal > 0}
          isLoading={isMyUpdatesLoading}
        />
        <MyChaptersPanel
          isLoading={isMyChaptersLoading}
          items={myChapterItems}
          title="Mijn thema's"
        />
      </PageContentMainBody>
      <PageContentMainBody>
        <MyCases
          isLoading={!!isMyCasesLoading}
          title="Mijn lopende aanvragen"
          items={myCases}
        />
      </PageContentMainBody>
      <PageContentMainBody>
        <MyArea />
      </PageContentMainBody>
      <PageContentMainBody variant="regularBoxed">
        <MyTips isLoading={!!isMyTipsLoading} items={tipItems} />
        <DirectLinks />
      </PageContentMainBody>
    </PageContentMain>
  );
};
