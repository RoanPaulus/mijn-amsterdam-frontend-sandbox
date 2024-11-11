import stream from 'node:stream';

import Mockdate from 'mockdate';
import { describe, expect } from 'vitest';

import {
  fetchBBVergunningen,
  fetchBBDocumentsList,
  fetchBBDocument,
  forTesting,
} from './toeristische-verhuur-powerbrowser-bb-vergunning';
import {
  BBVergunning,
  PBDocumentFields,
  PBZaakFields,
  PBZaakRecord,
  PowerBrowserStatusResponse,
  SearchRequestResponse,
} from './toeristische-verhuur-powerbrowser-bb-vergunning-types';
import { getAuthProfileAndToken, remoteApi } from '../../../test-utils';
import { AuthProfile, AuthProfileAndToken } from '../../auth/auth-types';
import * as encryptDecrypt from '../../helpers/encrypt-decrypt';

describe('B&B Vergunningen service', () => {
  const requestID = 'test-request-id';
  const authProfile: AuthProfile = {
    id: 'test-id',
    profileType: 'private',
    sid: 'test-sid',
    authMethod: 'digid',
  };
  const zaakId = 'test-zaak-id';
  const authProfileAndToken: AuthProfileAndToken = {
    profile: authProfile,
    token: 'test-tma-token',
  };

  beforeEach(() => {
    remoteApi.post('/powerbrowser/Token').reply(200, 'test-token');
  });

  describe('fetchBBVergunningen', () => {
    test('should return vergunningen if all fetches are successful', async () => {
      remoteApi
        .post(/\/powerbrowser/)
        .times(2)
        .reply((uri) => {
          if (uri.includes('SearchRequest')) {
            return [200, { records: [{ id: 'test-person-id' }] }];
          }

          if (uri.includes('Link/PERSONEN/GFO_ZAKEN/Table')) {
            return [200, { records: [{ id: 'test-zaak-id' }] }];
          }

          return [200, null];
        });

      remoteApi.get(/\/powerbrowser/).reply((uri) => {
        if (uri.includes('record/GFO_ZAKEN')) {
          return [200, [{ id: 'test-zaak-id', fields: [] }]];
        }
        return [200, null];
      });

      const result = await fetchBBVergunningen(requestID, authProfile);
      expect(result.status).toBe('OK');
      expect(result.content).toHaveLength(1);
    });

    test('should return an error if fetching person or maatschap ID fails', async () => {
      remoteApi.post(/\/powerbrowser/).reply((uri) => {
        if (uri.includes('SearchRequest')) {
          return [500, 'some-error'];
        }
      });

      const result = await fetchBBVergunningen(requestID, authProfile);
      expect(result.status).toBe('ERROR');
    });

    test('should return an error if fetching zaak IDs fails', async () => {
      remoteApi
        .post(/\/powerbrowser/)
        .times(2)
        .reply((uri) => {
          if (uri.includes('SearchRequest')) {
            return [200, { records: [{ id: 'test-person-id' }] }];
          }

          if (uri.includes('Link/PERSONEN/GFO_ZAKEN/Table')) {
            return [500, 'some-error'];
          }
        });

      const result = await fetchBBVergunningen(requestID, authProfile);
      expect(result.status).toBe('ERROR');
    });

    test('should return an error if fetching zaken by IDs fails', async () => {
      remoteApi
        .post(/\/powerbrowser/)
        .times(2)
        .reply((uri) => {
          if (uri.includes('SearchRequest')) {
            return [200, { records: [{ id: 'test-person-id' }] }];
          }

          if (uri.includes('Link/PERSONEN/GFO_ZAKEN/Table')) {
            return [200, { records: [{ id: 'test-zaak-id' }] }];
          }
        });
      remoteApi.get(/\/powerbrowser/).reply((uri) => {
        if (uri.includes('record/GFO_ZAKEN')) {
          return [500, 'some-error'];
        }

        return [200, null];
      });

      const result = await fetchBBVergunningen(requestID, authProfile);
      expect(result.status).toBe('ERROR');
    });
  });

  describe('fetchBBDocumentsList', () => {
    test('should return document list if fetch is successful', async () => {
      remoteApi.post(/\/powerbrowser/).reply((uri) => {
        if (uri.includes('SearchRequest')) {
          return [
            200,
            {
              records: [
                {
                  id: 'test-document-id',
                  fields: [
                    {
                      fieldName: 'OMSCHRIJVING',
                      fieldValue: 'BB Besluit vergunning bed and breakfast',
                    },
                  ],
                },
              ],
            },
          ];
        }

        return [200, null];
      });

      const result = await fetchBBDocumentsList(
        requestID,
        authProfileAndToken.profile,
        zaakId
      );
      expect(result.status).toBe('OK');
      expect(result.content).toHaveLength(1);
    });

    test('should return an error if fetch fails', async () => {
      remoteApi.post(/\/powerbrowser/).reply((uri) => {
        if (uri.includes('SearchRequest')) {
          return [500, 'some-error'];
        }

        return [500, null];
      });

      const result = await fetchBBDocumentsList(
        requestID,
        authProfileAndToken.profile,
        zaakId
      );
      expect(result.status).toBe('ERROR');
    });
  });

  describe('fetchBBDocument', () => {
    const documentId = 'test-doc-id';

    test('should return document if fetch is successful', async () => {
      remoteApi.get(/\/powerbrowser/).reply((uri) => {
        if (uri.includes('/Pdf')) {
          return [200, 'Zm9vLWJhcg=='];
        }

        return [200, null];
      });

      const result = await fetchBBDocument(
        requestID,
        authProfileAndToken,
        documentId
      );
      expect(result.status).toBe('OK');
      expect(result.content).toEqual({
        data: expect.any(stream),
        mimetype: 'application/pdf',
      });
      result.content?.data.on('data', (chunk: Buffer) => {
        expect(Buffer.from(chunk.toString(), 'base64').toString('utf-8')).toBe(
          'foo-bar'
        );
      });
    });

    test('should return an error if fetch fails', async () => {
      remoteApi.get(/\/powerbrowser/).reply((uri) => {
        if (uri.includes('/Pdf')) {
          return [500, 'some-error'];
        }
        return [500, null];
      });

      const result = await fetchBBDocument(
        requestID,
        authProfileAndToken,
        documentId
      );
      expect(result.status).toBe('ERROR');
    });
  });
  describe('fetchPowerBrowserToken_', () => {
    test('should fetch token successfully', async () => {
      const result =
        await forTesting.fetchPowerBrowserToken_('test-request-id');
      expect(result.status).toBe('OK');
      expect(result.content).toBe('test-token');
    });

    test('should return an error if token fetch fails', async () => {
      const resultSuccess =
        await forTesting.fetchPowerBrowserToken_('test-request-id');
      expect(resultSuccess.status).toBe('OK');

      remoteApi.post('/powerbrowser/Token').reply(500, 'some-error');
      const result =
        await forTesting.fetchPowerBrowserToken_('test-request-id');
      expect(result.status).toBe('ERROR');
    });
  });

  describe('fetchPowerBrowserData', () => {
    test('should fetch data successfully', async () => {
      remoteApi.post('/powerbrowser/data').reply(200, { data: 'test-data' });

      const result = await forTesting.fetchPowerBrowserData('test-request-id', {
        formatUrl: ({ url }) => {
          return `${url}/data`;
        },
      });
      expect(result.status).toBe('OK');
      expect(result.content).toEqual({ data: 'test-data' });
    });

    test('should return an error if data fetch fails', async () => {
      remoteApi.post('/powerbrowser/Token').reply(200, 'test-token');
      remoteApi.get('/powerbrowser/data').reply(500, 'some-error');

      const result = await forTesting.fetchPowerBrowserData('test-request-id', {
        formatUrl: ({ url }) => `${url}/data`,
      });
      expect(result.status).toBe('ERROR');
    });
  });

  describe('fetchPersoonOrMaatschapIdByUid', () => {
    test('should fetch person ID successfully', async () => {
      remoteApi.post('/powerbrowser/SearchRequest').reply(200, {
        records: [{ id: 'test-person-id' }],
      });

      const result = await forTesting.fetchPersoonOrMaatschapIdByUid(
        'test-request-id',
        {
          tableName: 'PERSONEN',
          fieldName: 'BURGERSERVICENUMMER',
          profileID: 'test-id',
        }
      );
      expect(result.status).toBe('OK');
      expect(result.content).toBe('test-person-id');
    });

    test('should return null if no person ID found', async () => {
      remoteApi.post('/powerbrowser/SearchRequest').reply(200, { records: [] });

      const result = await forTesting.fetchPersoonOrMaatschapIdByUid(
        'test-request-id',
        {
          tableName: 'PERSONEN',
          fieldName: 'BURGERSERVICENUMMER',
          profileID: 'test-id',
        }
      );
      expect(result.status).toBe('OK');
      expect(result.content).toBeNull();
    });

    test('should return an error if fetch fails', async () => {
      remoteApi.post('/powerbrowser/SearchRequest').reply(500, 'some-error');

      const result = await forTesting.fetchPersoonOrMaatschapIdByUid(
        'test-request-id',
        {
          tableName: 'PERSONEN',
          fieldName: 'BURGERSERVICENUMMER',
          profileID: 'test-id',
        }
      );
      expect(result.status).toBe('ERROR');
    });
  });

  describe('fetchZaakIds', () => {
    test('should fetch zaak IDs successfully', async () => {
      remoteApi.post('/powerbrowser/Link/PERSONEN/GFO_ZAKEN/Table').reply(200, {
        records: [{ id: 'test-zaak-id' }],
      });

      const result = await forTesting.fetchZaakIds('test-request-id', {
        personOrMaatschapId: 'test-person-id',
        tableName: 'PERSONEN',
      });
      expect(result.status).toBe('OK');
      expect(result.content).toEqual(['test-zaak-id']);
    });

    test('should return an error if fetch fails', async () => {
      remoteApi
        .post('/powerbrowser/Link/PERSONEN/GFO_ZAKEN/Table')
        .reply(500, 'some-error');

      const result = await forTesting.fetchZaakIds('test-request-id', {
        personOrMaatschapId: 'test-person-id',
        tableName: 'PERSONEN',
      });
      expect(result.status).toBe('ERROR');
    });
  });

  describe('getFieldValue', () => {
    test('should return text for Resultaat_id', () => {
      const fields: PBZaakFields[] = [
        {
          fieldName: 'RESULTAAT_ID',
          fieldValue: 'test-value',
          text: 'some-text-value',
        },
      ];
      const result = forTesting.getFieldValue('RESULTAAT_ID', fields);
      expect(result).toBe('some-text-value');
    });

    test('should return fieldValue for others', () => {
      const fields: PBZaakFields[] = [
        { fieldName: 'ZAAK_IDENTIFICATIE', fieldValue: 'Z/123/123' },
      ];
      const result = forTesting.getFieldValue('ZAAK_IDENTIFICATIE', fields);
      expect(result).toBe('Z/123/123');
    });

    test('should return null if field not found', () => {
      const fields = [
        { fieldName: 'OTHER_FIELD', fieldValue: 'test-value' },
      ] as unknown as PBZaakFields[];

      const result = forTesting.getFieldValue('RESULTAAT_ID', fields);
      expect(result).toBeNull();
    });
  });

  describe('getZaakStatus', () => {
    test('should return zaak status', () => {
      const zaak = {
        steps: [{ isActive: true, status: 'In behandeling' }],
        result: 'Verleend',
      } as unknown as BBVergunning;

      const result = forTesting.getZaakStatus(zaak);
      expect(result).toBe('Verleend');
    });

    test('should return last step status if no result', () => {
      const zaak = {
        steps: [{ isActive: true, status: 'In behandeling' }],
        result: null,
      } as unknown as BBVergunning;

      const result = forTesting.getZaakStatus(zaak);
      expect(result).toBe('In behandeling');
    });
  });

  describe('getZaakResultaat', () => {
    test('should return transformed result', () => {
      const result = forTesting.getZaakResultaat('Verleend');
      expect(result).toBe('Verleend');
    });

    test('should return null if result is null', () => {
      const result = forTesting.getZaakResultaat(null);
      expect(result).toBeNull();
    });
  });

  describe('transformZaakStatusResponse', () => {
    test('should transform zaak status response correctly', () => {
      const zaak = {
        id: 'test-zaak-id',
        dateReceived: '2023-01-01',
        dateDecision: '2023-02-01',
        dateEnd: '2023-12-31',
        result: 'Verleend',
        documents: [
          {
            title: 'Verzoek aanvullende gegevens',
            datePublished: '2023-01-15',
          },
        ],
      } as unknown as BBVergunning;

      const statusResponse = [
        { omschrijving: 'In behandeling', datum: '2023-01-10' },
        { omschrijving: 'Afgehandeld', datum: '2023-02-01' },
      ] as PowerBrowserStatusResponse;

      const result = forTesting.transformZaakStatusResponse(
        zaak,
        statusResponse
      );
      expect(result).toEqual([
        {
          id: 'step-1',
          status: 'Ontvangen',
          datePublished: '2023-01-01',
          isActive: false,
          isChecked: true,
        },
        {
          id: 'step-2',
          status: 'In behandeling',
          datePublished: '2023-01-10',
          isActive: false,
          isChecked: true,
        },
        {
          id: 'step-meer-info',
          status: 'Meer informatie nodig',
          datePublished: '2023-01-15',
          isActive: false,
          isChecked: true,
        },
        {
          id: 'step-3',
          status: 'Afgehandeld',
          datePublished: '2023-02-01',
          isActive: false,
          isChecked: true,
        },
        {
          id: 'step-5',
          status: 'Verlopen',
          datePublished: '2023-12-31',
          isActive: true,
          isChecked: true,
        },
      ]);
    });

    test('should handle case with no result and no documents', () => {
      const zaak = {
        id: 'test-zaak-id',
        dateReceived: '2023-01-01',
        dateDecision: null,
        dateEnd: null,
        result: null,
        documents: [],
      } as unknown as BBVergunning;

      const statusResponse = [
        { omschrijving: 'In behandeling', datum: '2023-01-10' },
      ] as PowerBrowserStatusResponse;

      const result = forTesting.transformZaakStatusResponse(
        zaak,
        statusResponse
      );
      expect(result).toEqual([
        {
          id: 'step-1',
          status: 'Ontvangen',
          datePublished: '2023-01-01',
          isActive: false,
          isChecked: true,
        },
        {
          id: 'step-2',
          status: 'In behandeling',
          datePublished: '2023-01-10',
          isActive: true,
          isChecked: true,
        },
        {
          id: 'step-3',
          status: 'Afgehandeld',
          datePublished: '',
          isActive: false,
          isChecked: false,
        },
      ]);
    });

    test('should handle case with no status response', () => {
      const zaak = {
        id: 'test-zaak-id',
        dateReceived: '2023-01-01',
        dateDecision: null,
        dateEnd: null,
        result: null,
        documents: [],
      } as unknown as BBVergunning;

      const statusResponse = [] as PowerBrowserStatusResponse;

      const result = forTesting.transformZaakStatusResponse(
        zaak,
        statusResponse
      );
      expect(result).toEqual([
        {
          id: 'step-1',
          status: 'Ontvangen',
          datePublished: '2023-01-01',
          isActive: true,
          isChecked: true,
        },
        {
          id: 'step-2',
          status: 'In behandeling',
          datePublished: '',
          isActive: false,
          isChecked: false,
        },
        {
          id: 'step-3',
          status: 'Afgehandeld',
          datePublished: '',
          isActive: false,
          isChecked: false,
        },
      ]);
    });
  });

  describe('fetchZaakAdres', () => {
    test('should fetch zaak address successfully', async () => {
      remoteApi.post('/powerbrowser/Link/GFO_ZAKEN/ADRESSEN/Table').reply(200, {
        records: [
          {
            fields: [{ fieldName: 'FMT_CAPTION', fieldValue: 'Test Address' }],
          },
        ],
      });

      const result = await forTesting.fetchZaakAdres(
        'test-request-id',
        'test-zaak-id'
      );
      expect(result.status).toBe('OK');
      expect(result.content).toBe('Test Address');
    });

    test('should return null if no address found', async () => {
      remoteApi
        .post('/powerbrowser/Link/GFO_ZAKEN/ADRESSEN/Table')
        .reply(200, { records: [] });

      const result = await forTesting.fetchZaakAdres(
        'test-request-id',
        'test-zaak-id'
      );
      expect(result.status).toBe('OK');
      expect(result.content).toBeNull();
    });

    test('should return an error if fetch fails', async () => {
      remoteApi
        .post('/powerbrowser/Link/GFO_ZAKEN/ADRESSEN/Table')
        .reply(500, 'some-error');

      const result = await forTesting.fetchZaakAdres(
        'test-request-id',
        'test-zaak-id'
      );
      expect(result.status).toBe('ERROR');
    });
  });

  describe('fetchZaakStatussen', () => {
    test('should fetch zaak statuses successfully', async () => {
      remoteApi
        .post('/powerbrowser/Report/RunSavedReport')
        .reply(200, [{ omschrijving: 'In behandeling', datum: '2023-02-01' }]);

      const zaak = {
        id: 'test-zaak-id',
        dateReceived: '2023-01-01',
        dateEnd: null,
        documents: [],
      } as unknown as BBVergunning;

      const result = await forTesting.fetchZaakStatussen(
        'test-request-id',
        zaak
      );
      expect(result.status).toBe('OK');
      expect(result.content).toHaveLength(3);
    });

    test('should return an error if fetch fails', async () => {
      remoteApi
        .post('/powerbrowser/Report/RunSavedReport')
        .reply(500, 'some-error');

      const zaak = {
        id: 'test-zaak-id',
        dateReceived: '2023-01-01',
        dateEnd: null,
      } as unknown as BBVergunning;

      const result = await forTesting.fetchZaakStatussen(
        'test-request-id',
        zaak
      );
      expect(result.status).toBe('ERROR');
    });
  });

  describe('fetchAndMergeZaakStatussen', () => {
    test('should fetch and merge zaak statuses successfully', async () => {
      remoteApi
        .post('/powerbrowser/Report/RunSavedReport')
        .reply(200, [{ omschrijving: 'In behandeling', datum: '2023-02-01' }]);

      const zaken = [
        {
          id: 'test-zaak-id',
          dateReceived: '2023-01-01',
          dateEnd: null,
          documents: [],
        },
      ] as unknown as BBVergunning[];

      const result = await forTesting.fetchAndMergeZaakStatussen(
        'test-request-id',
        zaken
      );
      expect(result).toHaveLength(1);
      expect(result[0].steps).toHaveLength(3);
    });
  });

  describe('fetchAndMergeDocuments', () => {
    test('should fetch and merge documents successfully', async () => {
      remoteApi.post('/powerbrowser/SearchRequest').reply(200, {
        records: [
          {
            id: 'test-document-id',
            fields: [
              {
                fieldName: 'OMSCHRIJVING',
                fieldValue: 'BB Besluit vergunning bed and breakfast',
              },
            ],
          },
        ],
      });

      const zaken = [
        { id: 'test-zaak-id', dateReceived: '2023-01-01', dateEnd: null },
      ] as unknown as BBVergunning[];

      const result = await forTesting.fetchAndMergeDocuments(
        'test-request-id',
        authProfile,
        zaken
      );
      expect(result).toHaveLength(1);
      expect(result[0].documents).toHaveLength(1);
      expect(result[0].documents[0].title).toBe('Besluit toekenning');
    });

    test('should handle errors in fetching documents', async () => {
      remoteApi.post('/powerbrowser/SearchRequest').reply(500, 'some-error');

      const zaken = [
        { id: 'test-zaak-id', dateReceived: '2023-01-01', dateEnd: null },
      ] as unknown as BBVergunning[];

      const result = await forTesting.fetchAndMergeDocuments(
        'test-request-id',
        authProfile,
        zaken
      );
      expect(result).toHaveLength(1);
      expect(result[0].documents).toHaveLength(0);
    });
  });

  describe('fetchAndMergeAdressen', () => {
    test('should fetch and merge addresses successfully', async () => {
      remoteApi.post('/powerbrowser/Link/GFO_ZAKEN/ADRESSEN/Table').reply(200, {
        records: [
          {
            fields: [{ fieldName: 'FMT_CAPTION', fieldValue: 'Test Address' }],
          },
        ],
      });

      const zaken = [
        { id: 'test-zaak-id', dateReceived: '2023-01-01', dateEnd: null },
      ] as unknown as BBVergunning[];

      const result = await forTesting.fetchAndMergeAdressen(
        'test-request-id',
        zaken
      );
      expect(result).toHaveLength(1);
      expect(result[0].adres).toBe('Test Address');
    });
  });

  describe('isZaakActual', () => {
    Mockdate.set('2023-01-01');
    const now = new Date();

    test('should return true if zaak is actual', () => {
      const result = forTesting.isZaakActual({
        result: 'Verleend',
        dateEnd: '2023-12-31',
        compareDate: now,
      });
      expect(result).toBe(true);
    });

    test('should return false if zaak is not actual based on result', () => {
      const result = forTesting.isZaakActual({
        result: 'Niet verleend',
        dateEnd: '2023-12-31',
        compareDate: now,
      });
      expect(result).toBe(false);
    });

    test('should return false if zaak is not actual based on date', () => {
      const result = forTesting.isZaakActual({
        result: 'Verleend',
        dateEnd: '2011-12-31',
        compareDate: now,
      });
      expect(result).toBe(false);
    });

    Mockdate.reset();
  });

  describe('transformZaak', () => {
    test('should transform zaak successfully', () => {
      const zaak: PBZaakRecord = {
        fmtCpn:
          'Z2024-WK000245 BenB aanvragen - Paulus van Hemertstraat 4 1 01-10-2024 Gereed Vergunningaanvraag behandelen Bed en breakfast',
        mainTableName: 'GFO_ZAKEN',
        id: '126088685',
        fields: [
          {
            fieldName: 'ZAAK_IDENTIFICATIE',
            text: 'Z2024-WK000245',
            fieldValue: 'Z2024-WK000245',
          },
          {
            fieldName: 'STARTDATUM',
            text: '01-10-2024',
            fieldValue: '2024-09-30T22:00:00.0000000Z',
          },
          {
            fieldName: 'EINDDATUM',
            text: '18-10-2024',
            fieldValue: '2024-10-17T22:00:00.0000000Z',
          },
          {
            fieldName: 'DATUM_TOT',
            text: '31-12-2024',
            fieldValue: '2024-12-30T23:00:00.0000000Z',
          },
          {
            fieldName: 'RESULTAAT_ID',
            text: 'Verleend zonder overgangsrecht',
            fieldValue: '722',
          },
        ],
      };

      const result = forTesting.transformZaak(zaak);
      expect(result).toEqual({
        adres: null,
        dateDecision: '2024-10-17T22:00:00.0000000Z',
        dateEnd: '2024-12-30T23:00:00.0000000Z',
        dateEndFormatted: '31 december 2024',
        dateReceived: '2024-09-30T22:00:00.0000000Z',
        dateStart: '2024-10-17T22:00:00.0000000Z',
        dateStartFormatted: '18 oktober 2024',
        documents: [],
        heeftOvergangsRecht: false,
        id: '126088685',
        isActual: true,
        link: {
          title: 'Vergunning bed & breakfast',
          to: '/toeristische-verhuur/vergunning/bed-and-breakfast/126088685',
        },
        result: 'Verleend',
        status: 'Ontvangen',
        steps: [],
        title: 'Vergunning bed & breakfast',
        zaaknummer: 'Z2024-WK000245',
      });
    });
  });

  describe('fetchZakenByIds', () => {
    test('should fetch zaken by IDs successfully', async () => {
      remoteApi.get('/powerbrowser/record/GFO_ZAKEN/test-zaak-id').reply(200, [
        {
          id: 'test-zaak-id',
          fields: [
            { fieldName: 'RESULTAAT_ID', fieldValue: 'Verleend' },
            { fieldName: 'STARTDATUM', fieldValue: '2023-01-01' },
          ],
        },
      ]);

      const result = await forTesting.fetchZakenByIds(
        'test-request-id',
        getAuthProfileAndToken().profile,
        ['test-zaak-id']
      );
      expect(result.status).toBe('OK');
      expect(result.content).toHaveLength(1);
    });

    test('should return an error if fetch fails', async () => {
      remoteApi
        .get('/powerbrowser/record/GFO_ZAKEN/test-zaak-id')
        .reply(500, 'some-error');

      const result = await forTesting.fetchZakenByIds(
        'test-request-id',
        getAuthProfileAndToken().profile,
        ['test-zaak-id']
      );
      expect(result.status).toBe('ERROR');
    });
  });

  describe('transformPowerbrowserLinksResponse', () => {
    test('should transform powerbrowser links response', () => {
      const responseData = {
        records: [
          {
            fields: [
              { fieldName: 'ID', fieldValue: 'test-doc-id' },
              {
                fieldName: 'OMSCHRIJVING',
                fieldValue: 'BB Besluit vergunning bed and breakfast',
              },
              { fieldName: 'CREATEDATE', fieldValue: '2023-01-01' },
            ],
          },
        ],
      } as SearchRequestResponse<'DOCLINK', PBDocumentFields[]>;

      const encryptSpy = vi
        .spyOn(encryptDecrypt, 'encryptSessionIdWithRouteIdParam')
        .mockReturnValue('test-encrypted-value');

      const result = forTesting.transformPowerbrowserLinksResponse(
        'test-session-id',
        responseData
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'test-encrypted-value',
        title: 'Besluit toekenning',
        download: 'Besluit toekenning',
        datePublished: '2023-01-01',
        url: 'http://bff-api-host/api/v1/services/toeristische-verhuur/bed-and-breakfast/document?id=test-encrypted-value',
      });

      encryptSpy.mockRestore();
    });
  });
});
