import { render } from '@testing-library/react';

import { generatePath } from 'react-router-dom';
import { MutableSnapshot } from 'recoil';
import vergunningenData from '../../../server/mock-data/json/vergunningen.json';
import {
  toeristischeVerhuurVergunningTypes,
  transformVergunningenData,
  VergunningenSourceData,
} from '../../../server/services/vergunningen';
import { AppRoutes } from '../../../universal/config';
import { appStateAtom } from '../../hooks/useAppState';
import MockApp from '../MockApp';
import Vergunningen from './Vergunningen';

const testState: any = {
  VERGUNNINGEN: {
    status: 'OK',
    content: transformVergunningenData(
      vergunningenData as VergunningenSourceData
    ).filter(
      (vergunning) =>
        !toeristischeVerhuurVergunningTypes.includes(vergunning.caseType)
    ),
  },
};

function initializeState(snapshot: MutableSnapshot) {
  snapshot.set(appStateAtom, testState);
}

describe('<Vergunningen />', () => {
  const routeEntry = generatePath(AppRoutes.VERGUNNINGEN);
  const routePath = AppRoutes.VERGUNNINGEN;
  const Component = () => (
    <MockApp
      routeEntry={routeEntry}
      routePath={routePath}
      component={Vergunningen}
      initializeState={initializeState}
    />
  );

  it('Matches the Full Page snapshot', () => {
    const { asFragment } = render(<Component />);
    expect(asFragment()).toMatchSnapshot();
  });
});
