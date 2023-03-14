import { render } from '@testing-library/react';

import { generatePath } from 'react-router-dom';
import { MutableSnapshot } from 'recoil';
import { AppRoutes } from '../../../universal/config';
import { jsonCopy } from '../../../universal/helpers';
import { appStateAtom } from '../../hooks/useAppState';
import MockApp from '../MockApp';
import GarbageInformation from './GarbageInformation';

//const { BRP, AFVAL, AFVALPUNTEN, MY_LOCATION } = useAppStateGetter();

const afvalpunt = {
  title: 'De afvalpuntenweg',
  latlng: { latng: { lat: 5, lng: 40 } },
  address: 'afvalpuntenweg 23, 1067 BA',
  phone: '123123123',
  email: 'afval@punt.com',
  distance: 34,
  website: 'http://example.org/afvalpunt',
};

const testState: any = {
  BRP: {
    status: 'OK',
    content: {
      adres: {
        straatnaam: 'Teststraat',
        huisnummer: '24',
        huisnummertoevoeging: 'x',
        huisletter: null,
      },
      persoon: {
        mokum: true,
      },
    },
  },
  AFVAL: {
    status: 'OK',
    content: [
      {
        titel: 'Glas',
        instructie: 'In de container voor glas',
        instructieCTA: null,
        ophaaldagen: '',
        buitenzetten: null,
        waar: {
          to: '/buurt?datasetIds=["afvalcontainers"]&zoom=14&filters={"afvalcontainers"%3A{"fractie_omschrijving"%3A{"values"%3A{"Glas"%3A1}}}}',
          title: 'Kaart met containers in de buurt',
        },
        opmerking: null,
        kalendermelding: null,
        fractieCode: 'Glas',
        stadsdeelAanvulling:
          'In uw stadsdeel zijn mogelijk <a href="https://www.amsterdam.nl/afval-en-hergebruik/afvalinformatie/extra-informatie-centrum" rel="noopener noreferrer">aanvullende regels</a> van kracht.',
      },
      {
        titel: 'Groente-, fruit-, etensresten en tuinafval (gfe/t)',
        instructie: 'Bij het restafval',
        instructieCTA: null,
        ophaaldagen: '',
        buitenzetten: null,
        waar: '',
        opmerking:
          'Tuinafval dat niet in een vuilniszak past, mag u als grof afval weg doen',
        kalendermelding: null,
        fractieCode: 'GFT',
        stadsdeelAanvulling:
          'In uw stadsdeel zijn mogelijk <a href="https://www.amsterdam.nl/afval-en-hergebruik/afvalinformatie/extra-informatie-centrum" rel="noopener noreferrer">aanvullende regels</a> van kracht.',
      },
      {
        titel: 'Grof afval',
        instructie: 'Laat uw grof afval ophalen door een erkend bedrijf',
        instructieCTA: null,
        ophaaldagen: '',
        buitenzetten: null,
        waar: '',
        opmerking:
          'Of breng het naar <a href="https://kaart.amsterdam.nl/afvalpunten">een Afvalpunt</a>',
        kalendermelding: null,
        fractieCode: 'GA',
        stadsdeelAanvulling:
          'In uw stadsdeel zijn mogelijk <a href="https://www.amsterdam.nl/afval-en-hergebruik/afvalinformatie/extra-informatie-centrum" rel="noopener noreferrer">aanvullende regels</a> van kracht.',
      },
      {
        titel: 'Papier en karton',
        instructie: 'In de container voor papier',
        instructieCTA: null,
        ophaaldagen: '',
        buitenzetten: null,
        waar: {
          to: '/buurt?datasetIds=["afvalcontainers"]&zoom=14&filters={"afvalcontainers"%3A{"fractie_omschrijving"%3A{"values"%3A{"Papier"%3A1}}}}',
          title: 'Kaart met containers in de buurt',
        },
        opmerking: null,
        kalendermelding: null,
        fractieCode: 'Papier',
        stadsdeelAanvulling:
          'In uw stadsdeel zijn mogelijk <a href="https://www.amsterdam.nl/afval-en-hergebruik/afvalinformatie/extra-informatie-centrum" rel="noopener noreferrer">aanvullende regels</a> van kracht.',
      },
      {
        titel: 'Restafval',
        instructie: 'In vuilniszak',
        instructieCTA: null,
        ophaaldagen: 'Maandag en donderdag',
        buitenzetten: 'Tussen 06.00 en 07.30 uur',
        waar: 'Aan de rand van de stoep of op de vaste plek',
        opmerking: null,
        kalendermelding: null,
        fractieCode: 'Rest',
        stadsdeelAanvulling:
          'In uw stadsdeel zijn mogelijk <a href="https://www.amsterdam.nl/afval-en-hergebruik/afvalinformatie/extra-informatie-centrum" rel="noopener noreferrer">aanvullende regels</a> van kracht.',
      },
      {
        titel: 'Textiel',
        instructie: 'In de container voor textiel',
        instructieCTA: null,
        ophaaldagen: '',
        buitenzetten: null,
        waar: {
          to: '/buurt?datasetIds=["afvalcontainers"]&zoom=14&filters={"afvalcontainers"%3A{"fractie_omschrijving"%3A{"values"%3A{"Textiel"%3A1}}}}',
          title: 'Kaart met containers in de buurt',
        },
        opmerking: null,
        kalendermelding: null,
        fractieCode: 'Textiel',
        stadsdeelAanvulling:
          'In uw stadsdeel zijn mogelijk <a href="https://www.amsterdam.nl/afval-en-hergebruik/afvalinformatie/extra-informatie-centrum" rel="noopener noreferrer">aanvullende regels</a> van kracht.',
      },
    ],
  },
  AFVALPUNTEN: { status: 'OK', content: { centers: [afvalpunt] } },
  MY_LOCATION: {
    status: 'OK',
    content: [
      {
        latlng: { lat: 52.36764560314673, lng: 4.90016547413043 },
        address: {
          _adresSleutel: 'xxxcasdasfada',
          huisletter: null,
          huisnummer: '1',
          huisnummertoevoeging: null,
          postcode: '1057 XP',
          straatnaam: 'Amstel',
          landnaam: 'Nederland',
          woonplaatsNaam: 'Amsterdam',
          begindatumVerblijf: '1967-01-01',
          einddatumVerblijf: '1967-01-01',
          adresType: 'correspondentie',
        },
        bagNummeraanduidingId: '0363200012145295',
      },
    ],
  },
};

function initializeState(snapshot: MutableSnapshot, state: any = testState) {
  snapshot.set(appStateAtom, state);
}

describe('<GarbageInformation />', () => {
  const routeEntry = generatePath(AppRoutes.AFVAL);
  const routePath = AppRoutes.AFVAL;

  const Component = () => (
    <MockApp
      routeEntry={routeEntry}
      routePath={routePath}
      component={GarbageInformation}
      initializeState={(snapshot) => initializeState(snapshot)}
    />
  );

  it('Matches the Full Page snapshot', () => {
    const { asFragment } = render(<Component />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Full page snapshot for Weesp address', () => {
    const weespState = jsonCopy(testState);
    weespState.BRP.content.persoon.mokum = false;
    weespState.MY_LOCATION.content[0].address.woonplaatsNaam = 'Weesp';

    const Component = () => (
      <MockApp
        routeEntry={routeEntry}
        routePath={routePath}
        component={GarbageInformation}
        initializeState={(snapshot) => initializeState(snapshot, weespState)}
      />
    );

    const { asFragment } = render(<Component />);
    expect(asFragment()).toMatchSnapshot();
  });
});
