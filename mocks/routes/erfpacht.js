const settings = require('../settings');

const ERFPACHT_RESPONSES = {
  NOTIFICATIONS: require('../fixtures/erfpacht-notifications.json'),
};

const ERFPACHT_V2_RESPONSES = {
  ERFPACHTER: require('../fixtures/erfpacht-v2-erfpachter.json'),
  DOSSIERS: require('../fixtures/erfpacht-v2-dossiers.json'),
  DOSSIER_INFO_DETAILS: require('../fixtures/erfpacht-v2-dossierinfo-bsn.json'),
};

module.exports = [
  {
    id: 'get-erfpacht',
    url: `${settings.MOCK_BASE_PATH}/erfpacht/api/v2/check/groundlease/:profile(user|company)/*`,
    method: 'get',
    variants: [
      {
        id: 'standard',
        type: 'text',
        options: {
          status: 200,
          body: 'true',
        },
      },
    ],
  },
  {
    id: 'get-erfpacht-notifications',
    url: `${settings.MOCK_BASE_PATH}/erfpacht/api/v2/notifications/:profile(bsn|kvk)/*`,
    method: 'get',
    variants: [
      {
        id: 'standard',
        type: 'json',
        options: {
          status: 200,
          body: ERFPACHT_RESPONSES.NOTIFICATIONS,
        },
      },
    ],
  },
  {
    id: 'get-erfpacht-v2-erfpachter',
    url: `${settings.MOCK_BASE_PATH}/erfpachtv2/vernise/api/erfpachter`,
    method: 'GET',
    variants: [
      {
        id: 'standard',
        type: 'json',
        options: {
          status: 200,
          body: ERFPACHT_V2_RESPONSES.ERFPACHTER,
        },
      },
    ],
  },
  {
    id: 'get-erfpacht-v2-dossiers',
    url: `${settings.MOCK_BASE_PATH}/erfpachtv2/vernise/api/dossierinfo`,
    method: 'GET',
    variants: [
      {
        id: 'standard',
        type: 'json',
        options: {
          status: 200,
          body: ERFPACHT_V2_RESPONSES.DOSSIERS,
        },
      },
    ],
  },
  {
    id: 'get-erfpacht-v2-dossier-info-details',
    url: `${settings.MOCK_BASE_PATH}/erfpachtv2/vernise/api/dossierinfo/*`,
    method: 'GET',
    variants: [
      {
        id: 'standard',
        type: 'json',
        options: {
          status: 200,
          body: ERFPACHT_V2_RESPONSES.DOSSIER_INFO_DETAILS,
        },
      },
    ],
  },
];
