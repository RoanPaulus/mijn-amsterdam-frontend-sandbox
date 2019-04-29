import React, { useContext } from 'react';
import PageContentMain from 'components/PageContentMain/PageContentMain';
import PageContentMainHeading from 'components/PageContentMainHeading/PageContentMainHeading';
import PageContentMainBody from 'components/PageContentMainBody/PageContentMainBody';
import styles from './Dashboard.module.scss';
import MyUpdates from 'components/MyUpdates/MyUpdates';
import MyChaptersPanel from 'components/MyChaptersPanel/MyChaptersPanel';
import DirectLinks from 'components/DirectLinks/DirectLinks';
import { AppContext } from 'AppState';
import MyCases from 'components/MyCases/MyCases';
import MyTips from 'components/MyTips/MyTips';
import MyArea from 'components/MyArea/MyArea';

const MAX_UPDATES_VISIBLE = 3;
const MAX_TIPS_VISIBLE = 3;

export default () => {
  const {
    MY_UPDATES: {
      data: { items: myUpdates, total: myUpdatesTotal },
    },
    MY_CASES: {
      data: { items: myCases },
    },
    MY_TIPS: {
      data: { items: myTips },
    },
    MY_CHAPTERS,
  } = useContext(AppContext);

  return (
    <PageContentMain className={styles.Dashboard} variant="full">
      <PageContentMainHeading variant="medium">
        Mijn meldingen {myUpdatesTotal > 0 && <span>({myUpdatesTotal})</span>}
      </PageContentMainHeading>
      <PageContentMainBody variant="regularBoxed" className={styles.FirstBody}>
        <MyUpdates
          total={myUpdatesTotal}
          items={myUpdates.slice(0, MAX_UPDATES_VISIBLE)}
        />
        <MyChaptersPanel items={MY_CHAPTERS} title="Mijn thema's" />
        <MyCases title="Mijn lopende aanvragen" items={myCases} />
      </PageContentMainBody>
      <PageContentMainBody>
        <MyArea />
      </PageContentMainBody>
      <PageContentMainBody variant="regularBoxed">
        <MyTips items={myTips.slice(0, MAX_TIPS_VISIBLE)} />
        <DirectLinks />
      </PageContentMainBody>
    </PageContentMain>
  );
};
