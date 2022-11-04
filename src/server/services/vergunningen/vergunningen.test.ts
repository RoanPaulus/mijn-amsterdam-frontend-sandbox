import MockAdapter from 'axios-mock-adapter';
import { AppRoutes } from '../../../universal/config';
import { jsonCopy } from '../../../universal/helpers';
import { MyNotification } from '../../../universal/types';
import { CaseType } from '../../../universal/types/vergunningen';
import { ApiConfig } from '../../config';
import { axiosRequest } from '../../helpers';
import { AuthProfileAndToken } from '../../helpers/app';
import vergunningenData from '../../mock-data/json/vergunningen.json';
import {
  addLinks,
  BZB,
  BZP,
  fetchAllVergunningen,
  fetchVergunningenNotifications,
  getVergunningNotifications,
  transformVergunningenData,
  VergunningenSourceData,
} from './vergunningen';

describe('Vergunningen service', () => {
  const axMock = new MockAdapter(axiosRequest);
  const DUMMY_RESPONSE = jsonCopy(vergunningenData);

  const ORIGINAL_URL = ApiConfig.VERGUNNINGEN.url;
  const DUMMY_URL_1 = '/x';
  const DUMMY_URL_2 = '/y';
  const DUMMY_URL_3 = '/z';
  const DUMMY_URL_4 = '/a';

  const authProfileAndToken: AuthProfileAndToken = {
    profile: { authMethod: 'digid', profileType: 'private' },
    token: 'xxxxxx',
  };

  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2022-10-06'));

  afterAll(() => {
    axMock.restore();
    ApiConfig.VERGUNNINGEN.url = ORIGINAL_URL;
  });

  axMock.onGet(DUMMY_URL_1).reply(200, DUMMY_RESPONSE);
  axMock.onGet(DUMMY_URL_2).reply(200, null);
  axMock.onGet(DUMMY_URL_3).reply(500, { message: 'fat chance!' });
  axMock.onGet(DUMMY_URL_4).reply(200, {
    content: DUMMY_RESPONSE.content.filter((x: BZP | BZB) =>
      x.caseType.includes('Blauwe zone')
    ),
    status: 'OK',
  });

  it('should format data correctly', () => {
    expect(
      transformVergunningenData(vergunningenData as VergunningenSourceData)
    ).toMatchSnapshot();
  });

  it('FetchVergunningen: should respond with a success response', async () => {
    ApiConfig.VERGUNNINGEN.url = DUMMY_URL_1;
    const response = await fetchAllVergunningen('x', authProfileAndToken);
    const successResponse = {
      status: 'OK',
      content: transformVergunningenData(DUMMY_RESPONSE),
    };
    expect(response).toStrictEqual(successResponse);
  });

  it('should should respond with an empty list', async () => {
    ApiConfig.VERGUNNINGEN.url = DUMMY_URL_2;
    const response = await fetchAllVergunningen('x', authProfileAndToken);
    const successResponse = {
      status: 'OK',
      content: [],
    };
    expect(response).toStrictEqual(successResponse);
  });

  it('should should respond with an empty list if api returns error', async () => {
    ApiConfig.VERGUNNINGEN.url = DUMMY_URL_3;
    const response = await fetchAllVergunningen('x', authProfileAndToken);
    const errorResponse = {
      content: null,
      message: 'Error: Request failed with status code 500',
      status: 'ERROR',
    };
    expect(response).toStrictEqual(errorResponse);
  });

  it('fetchVergunningenNotifications', async () => {
    ApiConfig.VERGUNNINGEN.url = DUMMY_URL_1;
    const response = await fetchVergunningenNotifications(
      'x',
      authProfileAndToken,
      new Date('2020-06-23')
    );
    expect(response).toMatchSnapshot();
  });

  it('fetchVergunningenNotifications BZP/BZB', async () => {
    ApiConfig.VERGUNNINGEN.url = DUMMY_URL_4;
    const response = await fetchVergunningenNotifications(
      'x',
      authProfileAndToken,
      new Date('2022-09-20')
    );
    expect(response).toMatchSnapshot();
  });

  const TVM_DUMMY = {
    caseType: CaseType.TVMRVVObject,
    title: 'Tijdelijke verkeersmaatregel',
    dateDecision: '2020-07-02',
    dateStart: '2020-07-02',
    dateRequest: '2020-06-24T00:00:00',
    decision: 'Verleend',
    documentsUrl:
      '/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
    identifier: 'Z/20/1597204',
    kenteken: null,
    location: 'Reguliersdwarsstraat 63 1012AA',
    status: 'Afgehandeld',
    timeEnd: '16:00',
    timeStart: '10:00',
    description: 'Slopen',
    dateEnd: '2020-07-02',
    dateWorkflowActive: '2020-06-24T00:00:00',
    processed: true,
  };

  const BZP_DUMMY = {
    caseType: CaseType.BZP,
    dateDecision: null,
    dateEnd: null,
    dateRequest: '2022-09-01',
    dateStart: '2022-09-09',
    dateWorkflowActive: '2022-09-01',
    decision: null,
    description: 'Ontheffing Blauwe Zone Bewoner',
    documentsUrl:
      '/decosjoin/listdocuments/gAAAAABjKYDIOgDQc8saVY2ZLlB6GL7lYkkLmPGiyQQpkrtr_WsCzAaNTNGDJ4lZeOojHKiiJbDY7FIBAQd_xBOpIcb09p0QoPQRUtBLZ3UYBpcIeOnAVUHe6h_PVrLmoXfn7XKbL9yt',
    id: '2191426354',
    identifier: 'Z/22/19795392',
    kenteken: 'GD-33-MV',
    status: 'Ontvangen',
    title: 'Parkeerontheffingen Blauwe zone particulieren',
  };

  const GPK_DUMMY = {
    caseType: CaseType.GPK,
    title: 'Europese gehandicaptenparkeerkaart (GPK)',
    dateDecision: null,
    dateRequest: '2021-09-03',
    dateEnd: '2021-10-06',
    decision: 'Verleend',
    documentsUrl:
      '/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
    identifier: 'Z/000/000008',
    cardtype: 'Bestuurder',
    cardNumber: '1234567',
    requestReason: 'Men heeft iets nodig',
    location: 'Amstel 1 1017AB Amsterdam',
    status: 'Ontvangen',
    description: 'Amstel 1 GPK aanvraag',
    dateWorkflowActive: '2021-09-03',
  };

  const OMZETTINGSVERGUNNING_DUMMY = {
    caseType: 'Omzettingsvergunning',
    title: 'Vergunning voor kamerverhuur (omzettingsvergunning) (Röel)',
    dateDecision: null,
    dateRequest: '2021-09-28',
    decision: null,
    documentsUrl: '/decosjoin/listdocuments/no-documents',
    identifier: 'Z/000/000001.b',
    location: 'Burgemeester Röellstraat 1 1064 BH Amsterdam',
    status: 'In behandeling',
    description: 'Amstel 1 Omzettingsvergunning voor het een en ander',
    dateWorkflowActive: '2021-10-08',
  };

  describe('getVergunningNotifications', () => {
    function createVergunningNotifications(...content: any): MyNotification[] {
      const vergunningen: any = addLinks(
        transformVergunningenData({
          content,
        } as VergunningenSourceData),
        AppRoutes['VERGUNNINGEN/DETAIL']
      );
      return getVergunningNotifications(vergunningen);
    }

    test('Geen notificaties, Te oud', () => {
      // Geen notificaties ivm 3 maanden termijn.
      const notifications = createVergunningNotifications(TVM_DUMMY);
      expect(notifications).toStrictEqual([]);
    });

    test('In behandeling notificatie', () => {
      const tvmDummy = Object.assign(jsonCopy(TVM_DUMMY), {
        dateDecision: null,
        decision: null,
        status: 'In behandeling',
        processed: false,
      });

      const notifications = createVergunningNotifications(tvmDummy);
      expect(notifications).toMatchInlineSnapshot(`
        Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2020-06-24T00:00:00",
            "description": "Uw vergunningsaanvraag voor Tijdelijke verkeersmaatregel is in behandeling genomen.",
            "id": "vergunning-3607535691-notification",
            "link": Object {
              "title": "Bekijk details",
              "to": "/vergunningen/tvm-rvv-object/3607535691",
            },
            "subject": "3607535691",
            "title": "Uw Tijdelijke verkeersmaatregel is in behandeling",
          },
        ]
      `);
    });

    test('In behandeling notificatie, zeer oud', () => {
      const tvmDummy = Object.assign(jsonCopy(TVM_DUMMY), {
        dateRequest: '2018-01-23',
        dateDecision: null,
        decision: null,
        status: 'In behandeling',
        processed: false,
      });

      const notifications = createVergunningNotifications(tvmDummy);
      expect(notifications).toMatchInlineSnapshot(`
        Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2018-01-23",
            "description": "Uw vergunningsaanvraag voor Tijdelijke verkeersmaatregel is in behandeling genomen.",
            "id": "vergunning-2247558132-notification",
            "link": Object {
              "title": "Bekijk details",
              "to": "/vergunningen/tvm-rvv-object/2247558132",
            },
            "subject": "2247558132",
            "title": "Uw Tijdelijke verkeersmaatregel is in behandeling",
          },
        ]
      `);
    });

    test('Afgehandeld notificatie', () => {
      const tvmDummy = Object.assign(jsonCopy(TVM_DUMMY), {
        dateDecision: '2022-10-04',
        decision: 'Verleend',
        status: 'Afgehandeld',
      });

      const notifications = createVergunningNotifications(tvmDummy);

      expect(notifications).toMatchInlineSnapshot(`
        Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2022-10-04",
            "description": "Uw vergunningsaanvraag voor een Tijdelijke verkeersmaatregel is afgehandeld.",
            "id": "vergunning-3607535691-notification",
            "link": Object {
              "title": "Bekijk details",
              "to": "/vergunningen/tvm-rvv-object/3607535691",
            },
            "subject": "3607535691",
            "title": "Uw Tijdelijke verkeersmaatregel is afgehandeld",
          },
        ]
      `);
    });

    test('BZP: Gaat verlopen', () => {
      const bzpDummy = Object.assign(jsonCopy(BZP_DUMMY), {
        dateDecision: '2021-10-04',
        decision: 'Verleend',
        status: 'Afgehandeld',
        dateEnd: '2022-12-28',
      });

      const notifications = createVergunningNotifications(bzpDummy);

      expect(notifications).toMatchInlineSnapshot(`
        Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2022-09-28",
            "description": "Uw ontheffing blauwe zone (GD-33-MV) loopt op 28 december 2022 af.",
            "id": "vergunning-2295682720-notification",
            "link": Object {
              "title": "Vraag op tijd een nieuwe ontheffing aan",
              "to": "https://formulieren.amsterdam.nl/TriplEforms/DirectRegelen/formulier/nl-NL/evAmsterdam/Ontheffingblauwezone.aspx",
            },
            "subject": "2295682720",
            "title": "Uw ontheffing blauwe zone verloopt binnenkort",
          },
        ]
      `);
    });

    test('BZP: Is verlopen - Met melding', () => {
      const bzpDummy = Object.assign(jsonCopy(BZP_DUMMY), {
        dateDecision: '2022-01-04',
        decision: 'Verleend',
        status: 'Afgehandeld',
        dateEnd: '2022-09-06',
      });

      const notifications = createVergunningNotifications(bzpDummy);

      expect(notifications).toMatchInlineSnapshot(`
        Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2022-09-06",
            "description": "Uw ontheffing blauwe zone (GD-33-MV) is op 06 september 2022 verlopen.",
            "id": "vergunning-2295682720-notification",
            "link": Object {
              "title": "Vraag een nieuwe ontheffing aan",
              "to": "https://formulieren.amsterdam.nl/TriplEforms/DirectRegelen/formulier/nl-NL/evAmsterdam/Ontheffingblauwezone.aspx",
            },
            "subject": "2295682720",
            "title": "Uw ontheffing blauwe zone is verlopen",
          },
        ]
      `);
    });

    test('BZP: Is verlopen - Geen melding want te oud', () => {
      const bzpDummy = Object.assign(jsonCopy(BZP_DUMMY), {
        dateDecision: '2021-10-04',
        decision: 'Verleend',
        status: 'Afgehandeld',
        dateEnd: '2022-06-01',
        processed: true,
      });

      const notifications = createVergunningNotifications(bzpDummy);

      expect(notifications).toStrictEqual([]);
    });

    test('GPK: Gaat verlopen', () => {
      const gpkDummy = Object.assign(jsonCopy(GPK_DUMMY), {
        dateDecision: '2021-10-04',
        decision: 'Verleend',
        status: 'Afgehandeld',
        dateEnd: '2022-12-06',
      });

      const notifications = createVergunningNotifications(gpkDummy);

      expect(notifications).toMatchInlineSnapshot(`
        Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2022-09-06",
            "description": "Uw Europese gehandicaptenparkeerkaart (GPK) loopt binnenkort af.",
            "id": "vergunning-1221166450-notification",
            "link": Object {
              "title": "Vraag tijdig een nieuwe vergunning aan",
              "to": "https://formulieren.amsterdam.nl/TripleForms/DirectRegelen/formulier/nl-NL/evAmsterdam/GehandicaptenParkeerKaartAanvraag.aspx",
            },
            "subject": "1221166450",
            "title": "Uw GPK loopt af",
          },
        ]
      `);
    });

    test('GPK: Is verlopen - Mét melding', () => {
      const gpkDummy = Object.assign(jsonCopy(GPK_DUMMY), {
        dateDecision: '2021-10-04',
        decision: 'Verleend',
        status: 'Afgehandeld',
        dateEnd: '2022-08-06',
      });

      const notifications = createVergunningNotifications(gpkDummy);

      expect(notifications).toMatchInlineSnapshot(`
        Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2022-08-06",
            "description": "Uw Europese gehandicaptenparkeerkaart (GPK) is verlopen.",
            "id": "vergunning-1221166450-notification",
            "link": Object {
              "title": "Vraag zonodig een nieuwe vergunning aan",
              "to": "https://formulieren.amsterdam.nl/TripleForms/DirectRegelen/formulier/nl-NL/evAmsterdam/GehandicaptenParkeerKaartAanvraag.aspx",
            },
            "subject": "1221166450",
            "title": "Uw GPK is verlopen",
          },
        ]
      `);
    });

    test('GPK: Is verlopen - Geen melding, te lang geleden', () => {
      const gpkDummy = Object.assign(jsonCopy(GPK_DUMMY), {
        dateDecision: '2021-10-04',
        decision: 'Verleend',
        status: 'Afgehandeld',
        dateEnd: '2022-05-06',
        processed: true,
      });

      const notifications = createVergunningNotifications(gpkDummy);

      expect(notifications).toMatchInlineSnapshot(`Array []`);
    });

    test('GPK: Gaat verlopen - geen melding want aanvraag gevonden', () => {
      const gpkDummy = Object.assign(jsonCopy(GPK_DUMMY), {
        dateRequest: '2021-09-23',
        dateDecision: '2021-10-04',
        decision: 'Verleend',
        status: 'Afgehandeld',
        dateEnd: '2022-12-06',
        identifier: 'x1',
        processed: true,
      });

      const gpkDummy2 = Object.assign(jsonCopy(GPK_DUMMY), {
        dateRequest: '2022-09-23',
        dateDecision: '2022-10-04',
        decision: 'Verleend',
        status: 'Afgehandeld',
        dateEnd: '2023-09-28',
        identifier: 'x2',
        processed: true,
      });

      const notifications = createVergunningNotifications(gpkDummy, gpkDummy2);

      expect(notifications).toMatchInlineSnapshot(`
        Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2022-10-04",
            "description": "Uw vergunningsaanvraag voor een Europese gehandicaptenparkeerkaart (GPK) is afgehandeld.",
            "id": "vergunning-1056864091-notification",
            "link": Object {
              "title": "Bekijk details",
              "to": "/vergunningen/gpk/1056864091",
            },
            "subject": "1056864091",
            "title": "GPK afgehandeld",
          },
        ]
      `);

      const gpkDummy3 = Object.assign(jsonCopy(GPK_DUMMY), {
        dateRequest: '2022-09-23',
        dateDecision: null,
        decision: null,
        status: 'In behandeling',
        dateEnd: '2023-09-28',
        identifier: 'x2',
      });
      const notifications2 = createVergunningNotifications(gpkDummy, gpkDummy3);

      expect(notifications2).toMatchInlineSnapshot(`
        Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2022-09-23",
            "description": "Uw vergunningsaanvraag voor Europese gehandicaptenparkeerkaart (GPK) is in behandeling genomen.",
            "id": "vergunning-1056864091-notification",
            "link": Object {
              "title": "Bekijk details",
              "to": "/vergunningen/gpk/1056864091",
            },
            "subject": "1056864091",
            "title": "Uw GPK is in behandeling",
          },
        ]
      `);
    });

    test('Omzettingsvergunning: In behandeling genomen', () => {
      const omzettingsVergunning = Object.assign(
        jsonCopy(OMZETTINGSVERGUNNING_DUMMY),
        {
          dateRequest: '2022-09-23',
          dateDecision: null,
          decision: null,
          status: 'In behandeling',
          identifier: 'x1',
          dateWorkflowActive: '2022-09-27',
        }
      );

      const notifications = createVergunningNotifications(omzettingsVergunning);

      expect(notifications).toMatchInlineSnapshot(`
        Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2022-09-27",
            "description": "Uw vergunningsaanvraag Vergunning voor kamerverhuur (omzettingsvergunning) (Röel) is in behandeling genomen.",
            "id": "vergunning-1037482200-notification",
            "link": Object {
              "title": "Bekijk details",
              "to": "/vergunningen/omzettingsvergunning/1037482200",
            },
            "subject": "1037482200",
            "title": "Aanvraag vergunning voor kamerverhuur (omzettingsvergunning) (röel) in behandeling",
          },
        ]
      `);
    });

    test('Omzettingsvergunning: Afgehandeld', () => {
      const omzettingsVergunning = Object.assign(
        jsonCopy(OMZETTINGSVERGUNNING_DUMMY),
        {
          dateRequest: '2022-09-23',
          dateDecision: '2022-10-20',
          decision: 'Verleend',
          status: 'Afgehandeld',
          identifier: 'x1',
          dateWorkflowActive: '2022-09-27',
        }
      );

      const notifications = createVergunningNotifications(omzettingsVergunning);

      expect(notifications).toMatchInlineSnapshot(`
        Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2022-10-20",
            "description": "Uw vergunningsaanvraag Vergunning voor kamerverhuur (omzettingsvergunning) (Röel) is afgehandeld",
            "id": "vergunning-1037482200-notification",
            "link": Object {
              "title": "Bekijk details",
              "to": "/vergunningen/omzettingsvergunning/1037482200",
            },
            "subject": "1037482200",
            "title": "Aanvraag vergunning voor kamerverhuur (omzettingsvergunning) (röel) afgehandeld",
          },
        ]
      `);
    });
  });

  it('adds the links to the vergunningen', () => {
    const vergunningenWithLinks = addLinks(
      [DUMMY_RESPONSE.content[0]],
      AppRoutes['VERGUNNINGEN/DETAIL']
    );
    expect(vergunningenWithLinks).toMatchInlineSnapshot(`
      Array [
        Object {
          "caseType": "Parkeerontheffingen Blauwe zone particulieren",
          "dateDecision": null,
          "dateEnd": null,
          "dateRequest": "2022-09-01",
          "dateStart": "2022-09-09",
          "dateWorkflowActive": "2022-09-01",
          "decision": null,
          "description": "Ontheffing Blauwe Zone Bewoner",
          "documentsUrl": "/decosjoin/listdocuments/gAAAAABjKYDIOgDQc8saVY2ZLlB6GL7lYkkLmPGiyQQpkrtr_WsCzAaNTNGDJ4lZeOojHKiiJbDY7FIBAQd_xBOpIcb09p0QoPQRUtBLZ3UYBpcIeOnAVUHe6h_PVrLmoXfn7XKbL9yt",
          "id": "2191426354",
          "identifier": "Z/22/19795392",
          "kenteken": "GD-33-MV",
          "link": Object {
            "title": "Bekijk hoe het met uw aanvraag staat",
            "to": "/vergunningen/parkeerontheffingen-blauwe-zone-particulieren/2191426354",
          },
          "processed": false,
          "status": "Ontvangen",
          "title": "Parkeerontheffingen Blauwe zone particulieren",
        },
      ]
    `);
  });
});
