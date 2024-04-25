import Mockdate from 'mockdate';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import {
  getServiceResultsForTips,
  getTipNotifications,
  servicesTipsByProfileType,
} from './controller';
import * as helpers from '../helpers/app';

const mocks = vi.hoisted(() => {
  return {
    MOCK_SOURCE_TIP: {
      profileTypes: ['private'],
      datePublished: '2022-06-15',
      description: 'Can we fake it today?',
      id: 'mijn-999',
      link: {
        title: 'Kijk op fake.amsterdam',
        to: 'https://fake.amsterdam/',
      },
      priority: 70,
      reason: ['Omdat dit een fake tip is.'],
      title: 'Voor fake Amsterdammers',
    },
  };
});

vi.mock('./tips-and-notifications', async () => {
  return {
    getTipsAndNotificationsFromApiResults: vi.fn(),
    sortNotifications: vi.fn(),
    fetchServicesNotifications: vi.fn(),
    fetchTipsAndNotifications: async () => {
      return [mocks.MOCK_SOURCE_TIP];
    },
  };
});

describe('controller', () => {
  const servicesPrivate = servicesTipsByProfileType.private;
  const servicesCommercial = servicesTipsByProfileType.commercial;

  beforeAll(() => {
    Mockdate.set('2022-07-22');
  });

  beforeEach(() => {
    servicesTipsByProfileType.private = {
      BRP: async () => {
        return {
          content: {
            persoon: {
              geboortedatum: `${new Date().getFullYear() - 17}-06-06`,
            },
          },
        };
      },
    };

    servicesTipsByProfileType.commercial = {
      KVK: async () => {
        return {
          content: {
            onderneming: {
              datumAanvang: null,
              datumEinde: null,
              handelsnamen: ['Kruijff Sport', 'Local Streetplanet Eenmanszaak'],
              hoofdactiviteit: 'Caf\u00e9s',
              overigeActiviteiten: ['Jachthavens'],
              rechtsvorm: null,
              kvkNummer: '90006178',
            },
            vestigingen: [],
          },
        };
      },
    };
  });

  afterAll(() => {
    servicesTipsByProfileType.private = servicesPrivate;
    servicesTipsByProfileType.commercial = servicesCommercial;
    Mockdate.reset();
  });

  test('Get service results for private:digid tips', async () => {
    vi.spyOn(helpers, 'getAuth').mockResolvedValueOnce({
      profile: {
        id: '123456789',
        profileType: 'private',
        authMethod: 'digid',
        sid: '',
      },
      token: 'xxx==',
    });

    const results = await getServiceResultsForTips('xx12xx', {
      cookies: {},
    } as any);

    expect(results).toMatchInlineSnapshot(`
      {
        "BRP": {
          "content": {
            "persoon": {
              "geboortedatum": "2005-06-06",
            },
          },
        },
      }
    `);
  });

  test('Get service results for private:digid tips', async () => {
    vi.spyOn(helpers, 'getAuth').mockResolvedValueOnce({
      profile: {
        id: '90006178',
        profileType: 'commercial',
        authMethod: 'eherkenning',
        sid: '',
      },
      token: 'xxx==',
    });

    const results2 = await getServiceResultsForTips('xx12xx', {
      cookies: {},
    } as any);

    expect(results2).toMatchInlineSnapshot(`
      {
        "KVK": {
          "content": {
            "onderneming": {
              "datumAanvang": null,
              "datumEinde": null,
              "handelsnamen": [
                "Kruijff Sport",
                "Local Streetplanet Eenmanszaak",
              ],
              "hoofdactiviteit": "Cafés",
              "kvkNummer": "90006178",
              "overigeActiviteiten": [
                "Jachthavens",
              ],
              "rechtsvorm": null,
            },
            "vestigingen": [],
          },
        },
      }
    `);
  });

  test('getTipNotifications private', async () => {
    vi.spyOn(helpers, 'getAuth').mockResolvedValue({
      profile: {
        id: '123456789',
        profileType: 'private',
        authMethod: 'digid',
        sid: '',
      },
      token: 'xxx==',
    });

    const result = await getTipNotifications('xx1xx', { cookies: '' } as any);

    expect(result).toMatchInlineSnapshot('[]');
  });

  test('getTipNotifications commercial', async () => {
    vi.spyOn(helpers, 'getAuth').mockResolvedValue({
      profile: {
        id: '90006178',
        profileType: 'commercial',
        authMethod: 'eherkenning',
        sid: '',
      },
      token: 'xxx==',
    });

    const result = await getTipNotifications('xx2xx', { cookies: '' } as any);

    expect(result).toMatchInlineSnapshot('[]');
  });
});
