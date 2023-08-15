import nock from 'nock';
import vergunningenMockData from '../mock-data/json/vergunningen.json';
import { BFF_MS_API_BASE_URL } from '../config';
import { AuthProfileAndToken } from '../helpers/app';
import { fetchHorecaNotifications, fetchHorecaVergunningen } from './horeca';
import MockDate from 'mockdate';

describe('Horeca service', () => {
  const authProfileAndToken: AuthProfileAndToken = {
    profile: { authMethod: 'digid', profileType: 'private' },
    token: 'xxxxxx',
  };

  afterAll(() => {
    nock.enableNetConnect();
    nock.restore();
    MockDate.reset();
  });

  beforeAll(() => {
    nock.disableNetConnect();
    MockDate.set('2023-05-06');
  });

  beforeEach(() => {
    nock(BFF_MS_API_BASE_URL)
      .get(`/decosjoin/getvergunningen`)
      .reply(200, vergunningenMockData);
  });

  it('should return only horeca vergunningen', async () => {
    const result = await fetchHorecaVergunningen('x', authProfileAndToken);

    expect(result.content.length).toEqual(3);
    expect(result.content).toMatchInlineSnapshot(`
      Array [
        Object {
          "caseType": "Horeca vergunning exploitatie Horecabedrijf",
          "dateDecision": "2023-04-28",
          "dateEnd": "2023-06-21",
          "dateRequest": "2023-04-26",
          "dateStart": null,
          "dateWorkflowActive": "2023-04-27",
          "decision": "Verleend",
          "description": "Nieuwe aanvraag, alcohol vrij, Het restotje, Berkelstraat  1",
          "documentsUrl": "/decosjoin/listdocuments/gAAAAABkWjUO7A9AhzlW9X40GruHXP-NVljBzvfRd5xoYu06JeI8_-6iU1x-YbZylG9r1IrOPkcIYboFSaN44tZ-frbPjndv-cOVYN18x5uwswBfJsWCYnz1NRrvV22dWHKLR9qAsE6J",
          "id": "1234418712",
          "identifier": "Z/23/1984708",
          "link": Object {
            "title": "Bekijk hoe het met uw aanvraag staat",
            "to": "/horeca/horeca-vergunning-exploitatie-horecabedrijf/1234418712",
          },
          "location": "Berkelstraat 1 1078CT",
          "processed": true,
          "status": "Afgehandeld",
          "title": "Horeca vergunning exploitatie Horecabedrijf",
        },
        Object {
          "caseType": "Horeca vergunning exploitatie Horecabedrijf",
          "dateDecision": "2022-12-01T00:00:00",
          "dateEnd": "2025-01-02T00:00:00",
          "dateRequest": "2022-11-20T00:00:00",
          "dateStart": "2023-11-01T00:00:00",
          "dateStartPermit": "2023-11-02T00:00:00",
          "dateWorkflowActive": "2022-11-25T00:00:00",
          "decision": null,
          "id": "334568232",
          "identifier": "Z/23/1808827",
          "link": Object {
            "title": "Bekijk hoe het met uw aanvraag staat",
            "to": "/horeca/horeca-vergunning-exploitatie-horecabedrijf/334568232",
          },
          "location": "J.J. Cremerplein 54I 1054 TM Amsterdam",
          "numberOfPermits": 10,
          "processed": false,
          "status": "Ontvangen",
          "title": "Horeca vergunning exploitatie Horecabedrijf",
        },
        Object {
          "caseType": "Horeca vergunning exploitatie Horecabedrijf",
          "dateDecision": "2022-11-01T00:00:00",
          "dateEnd": "2024-01-02T00:00:00",
          "dateRequest": "2022-10-20T00:00:00",
          "dateStart": "2022-11-01T00:00:00",
          "dateStartPermit": "2022-11-02T00:00:00",
          "dateWorkflowActive": null,
          "decision": null,
          "id": "3209922248",
          "identifier": "Z/23/1808826",
          "link": Object {
            "title": "Bekijk hoe het met uw aanvraag staat",
            "to": "/horeca/horeca-vergunning-exploitatie-horecabedrijf/3209922248",
          },
          "location": "J.J. Cremerplein 54I 1054 TM Amsterdam",
          "numberOfPermits": 10,
          "processed": false,
          "status": "Ontvangen",
          "title": "Horeca vergunning exploitatie Horecabedrijf",
        },
      ]
    `);
  });

  it('should return the expected notifications', async () => {
    const result = await fetchHorecaNotifications('x', authProfileAndToken);

    expect(result.content).toMatchInlineSnapshot(`
      Object {
        "notifications": Array [
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2023-04-28",
            "description": "Uw aanvraag voor een horeca vergunning exploitatie horecabedrijf is afgehandeld.",
            "id": "vergunning-1234418712-notification",
            "link": Object {
              "title": "Bekijk details",
              "to": "/horeca/horeca-vergunning-exploitatie-horecabedrijf/1234418712",
            },
            "subject": "1234418712",
            "title": "Aanvraag horeca vergunning exploitatie horecabedrijf afgehandeld",
          },
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2022-11-25T00:00:00",
            "description": "Uw aanvraag voor een horeca vergunning exploitatie horecabedrijf is in behandeling genomen.",
            "id": "vergunning-334568232-notification",
            "link": Object {
              "title": "Bekijk details",
              "to": "/horeca/horeca-vergunning-exploitatie-horecabedrijf/334568232",
            },
            "subject": "334568232",
            "title": "Aanvraag horeca vergunning exploitatie horecabedrijf in behandeling",
          },
          Object {
            "chapter": "VERGUNNINGEN",
            "datePublished": "2022-10-20T00:00:00",
            "description": "Uw aanvraag voor een horeca vergunning exploitatie horecabedrijf is ontvangen.",
            "id": "vergunning-3209922248-notification",
            "link": Object {
              "title": "Bekijk details",
              "to": "/horeca/horeca-vergunning-exploitatie-horecabedrijf/3209922248",
            },
            "subject": "3209922248",
            "title": "Aanvraag horeca vergunning exploitatie horecabedrijf ontvangen",
          },
        ],
      }
    `);
  });
});
