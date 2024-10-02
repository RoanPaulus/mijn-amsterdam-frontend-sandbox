import { fireEvent, render, waitFor } from '@testing-library/react';

import { generatePath } from 'react-router-dom';
import { MutableSnapshot } from 'recoil';
import { AfisBusinessPartnerDetailsTransformed } from '../../../server/services/afis/afis-types';
import { bffApi } from '../../../test-utils';
import { AppRoutes } from '../../../universal/config/routes';
import { AppState } from '../../../universal/types';
import { appStateAtom } from '../../hooks/useAppState';
import MockApp from '../MockApp';
import { AfisBetaalVoorkeuren } from './AfisBetaalVoorkeuren';
import userEvent from '@testing-library/user-event';

const businessPartnerIdEncrypted = 'xxx-123-xxx';

const testState = {
  AFIS: {
    status: 'OK',
    content: {
      isKnown: true,
      businessPartnerIdEncrypted,
    },
  },
} as AppState;

function initializeState(snapshot: MutableSnapshot) {
  snapshot.set(appStateAtom, testState);
}

describe('<AfisBetaalVoorkeuren />', () => {
  const businessPartnerDetails: AfisBusinessPartnerDetailsTransformed = {
    addressId: 999,
    businessPartnerId: '515177',
    fullName: 'Taxon Expeditions BV',
    phone: null,
    email: null,
  };

  bffApi
    .get(`/services/afis/businesspartner/${businessPartnerIdEncrypted}`)
    .reply(200, {
      content: businessPartnerDetails,
      status: 'OK',
    });

  bffApi
    .get(`/services/afis/facturen/overzicht/${businessPartnerIdEncrypted}`)
    .reply(200, {
      content: {
        open: { facturen: [], count: 0 },
        afgehandeld: { facturen: [], count: 0 },
        overgedragen: { facturen: [], count: 0 },
      },
      status: 'OK',
    });

  const routePath = AppRoutes['AFIS/BETAALVOORKEUREN'];
  const routeEntry = generatePath(routePath);

  const Component = () => (
    <MockApp
      routeEntry={routeEntry}
      routePath={routePath}
      component={AfisBetaalVoorkeuren}
      initializeState={initializeState}
    />
  );

  test('Display business partner details', async () => {
    const user = userEvent.setup();

    let screen = render(<Component />);

    await waitFor(() => {
      expect(screen.getByText('Taxon Expeditions BV')).toBeInTheDocument();
    });

    const verbergKnop = screen.getByText('Verberg');
    expect(verbergKnop).toBeInTheDocument();

    await user.click(verbergKnop);

    expect(screen.getByText('Toon')).toBeInTheDocument();
  });
});
