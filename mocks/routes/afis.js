const settings = require('../settings');

const BASE = '/afis';
const REST_BASE = BASE + '/RESTAdapter';

module.exports = [
  {
    id: 'post-afis-businesspartner-bsn',
    url: `${settings.MOCK_BASE_PATH}${REST_BASE}/businesspartner/BSN`,
    method: 'POST',
    variants: [
      {
        id: 'standard',
        type: 'json',
        options: {
          status: 200,
          body: {
            BSN: 999999999,
            Zakenpartnernummer: '8888888888',
            Blokkade: 'Nee',
            Afnemers_indicatie: 'Nee',
            Gevonden: 'Ja',
          },
        },
      },
    ],
  },
  {
    id: 'post-afis-businesspartner-kvk',
    url: `${settings.MOCK_BASE_PATH}${REST_BASE}/businesspartner/KVK`,
    method: 'POST',
    variants: [
      {
        id: 'standard',
        type: 'json',
        options: {
          status: 200,
          body: {
            Record: {
              KVK: 55555555,
              Zakenpartnernummer: '8888888888',
              Blokkade: 'Nee',
              Gevonden: 'Ja',
            },
          },
        },
      },
    ],
  },
  {
    id: 'get-afis-businesspartner-details',
    url: `${settings.MOCK_BASE_PATH}${REST_BASE}/API/ZAPI_BUSINESS_PARTNER_DET_SRV/A_BusinessPartner`,
    method: 'GET',
    variants: [
      {
        id: 'standard',
        type: 'json',
        options: {
          status: 200,
          body: {
            feed: {
              entry: [
                {
                  content: {
                    '@type': 'application/xml',
                    properties: {
                      BusinessPartner: 515177,
                      FullName: 'Taxon Expeditions BV',
                      AddressID: 430844,
                      CityName: 'Leiden',
                      Country: 'NL',
                      HouseNumber: 20,
                      HouseNumberSupplementText: '',
                      PostalCode: '2311 VW',
                      Region: '',
                      StreetName: 'Rembrandtstraat',
                      StreetPrefixName: '',
                      StreetSuffixName: '',
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
  {
    id: 'get-afis-businesspartner-phonenumber',
    url: `${settings.MOCK_BASE_PATH}${REST_BASE}/API/ZAPI_BUSINESS_PARTNER_DET_SRV/A_AddressPhoneNumber`,
    method: 'GET',
    variants: [
      {
        id: 'standard',
        type: 'json',
        options: {
          status: 200,
          body: {
            feed: {
              entry: [
                {
                  content: {
                    '@type': 'application/xml',
                    properties: {
                      InternationalPhoneNumber: '+31622030313',
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
  {
    id: 'get-afis-businesspartner-emailaddress',
    url: `${settings.MOCK_BASE_PATH}${REST_BASE}/API/ZAPI_BUSINESS_PARTNER_DET_SRV/A_AddressEmailAddress`,
    method: 'GET',
    variants: [
      {
        id: 'standard',
        type: 'json',
        options: {
          status: 200,
          body: {
            feed: {
              entry: [
                {
                  content: {
                    '@type': 'application/xml',
                    properties: {
                      SearchEmailAddress: 'xxmail@arjanappel.nl',
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
];
