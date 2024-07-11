import { render } from '@testing-library/react';
import { generatePath } from 'react-router-dom';
import { MutableSnapshot } from 'recoil';
import { AppRoutes } from '../../../universal/config/routes';
import { appStateAtom } from '../../hooks/useAppState';
import MockApp from '../MockApp';
import KlachtenDetail from './KlachtenDetail';

const testState: any = {
  KLACHTEN: {
    status: 'OK',
    content: {
      klachten: [
        {
          gewensteOplossing: null,
          inbehandelingSinds: '2022-05-30T00:00:00.000Z',
          locatie: null,
          omschrijving: 'Dit is de omschrijving van de klacht',
          onderwerp: 'Test voor decentrale toewijzing',
          ontvangstDatum: '2022-05-30T00:00:00.000Z',
          id: '36049',
          link: {
            title: 'Klacht 36049',
            to: '/klachten/klacht/36049',
          },
        },
        {
          gewensteOplossing: null,
          inbehandelingSinds: '2022-05-18T00:00:00.000Z',
          locatie: null,
          omschrijving: 'Dear Amsterdam Municipality',
          onderwerp: null,
          ontvangstDatum: '2022-05-05T00:00:00.000Z',
          id: '36046',
          link: {
            title: 'Klacht 36046',
            to: '/klachten/klacht/36046',
          },
        },
        {
          inbehandelingSinds: '2022-04-14T00:00:00.000Z',
          ontvangstDatum: '2022-04-13T00:00:00.000Z',
          omschrijving: 'Een klacht.',
          gewensteOplossing: 'Boosterprik',
          onderwerp: 'Boosterprik',
          id: '34994',
          locatie: 'RAI',
          link: {
            to: '/klachten/klacht/34994',
            title: 'Klacht 34994',
          },
        },
      ],
      aantal: 3,
    },
  },
};

function initializeState(snapshot: MutableSnapshot) {
  snapshot.set(appStateAtom, testState);
}

function setupMockComponent(id: string) {
  const routeEntry = generatePath(AppRoutes['KLACHTEN/KLACHT'], {
    id,
  });
  const routePath = AppRoutes['KLACHTEN/KLACHT'];

  return () => (
    <MockApp
      routeEntry={routeEntry}
      routePath={routePath}
      component={KlachtenDetail}
      initializeState={initializeState}
    />
  );
}

describe('KlachtenDetail', () => {
  describe('No subject or location', () => {
    const Component = setupMockComponent('36046');

    it('Matches the Full Page snapshot', () => {
      const { asFragment } = render(<Component />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Subject no location', () => {
    const Component = setupMockComponent('36049');

    it('Matches the Full Page snapshot', () => {
      const { asFragment } = render(<Component />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Subject and location', () => {
    const Component = setupMockComponent('34994');

    it('Matches the Full Page snapshot', () => {
      const { asFragment } = render(<Component />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
