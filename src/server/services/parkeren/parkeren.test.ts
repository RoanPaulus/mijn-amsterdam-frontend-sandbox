import { getAuthProfileAndToken, remoteApi } from '../../../test-utils';
import { getFromEnv } from '../../helpers/env';
import { fetchSSOParkerenURL } from './parkeren';

const REQUEST_ID = '123';
const STATUS_OK_200 = 200;
const url = 'https://parkeren.nl/sso-login';

beforeEach(() => {
  vi.clearAllMocks();
});

test('Calls with digid', async () => {
  const authProfileAndToken = getAuthProfileAndToken('private');

  remoteApi
    .get('/parkeren/sso/get_authentication_url?service=digid')
    .reply(STATUS_OK_200, {
      url,
    });

  const response = await fetchSSOParkerenURL(REQUEST_ID, authProfileAndToken);

  expect(response).toStrictEqual({
    content: {
      isKnown: true,
      url,
    },
    status: 'OK',
  });
});

test('Calls with eherkenning', async () => {
  let authProfileAndToken = getAuthProfileAndToken('commercial');

  remoteApi
    .get('/parkeren/sso/get_authentication_url?service=eherkenning')
    .reply(STATUS_OK_200, {
      url,
    });

  const response = await fetchSSOParkerenURL(REQUEST_ID, authProfileAndToken);

  expect(response).toStrictEqual({
    content: {
      isKnown: true,
      url,
    },
    status: 'OK',
  });
});

describe('Sets isKnown to false when url is invalid', async () => {
  const FALLBACK_URL_RESPONSE = {
    content: {
      isKnown: true,
      url: getFromEnv('BFF_PARKEREN_EXTERNAL_FALLBACK_URL'),
    },
    status: 'OK',
  };

  test('URL is null', async () => {
    let authProfileAndToken = getAuthProfileAndToken('private');

    remoteApi
      .get('/parkeren/sso/get_authentication_url?service=digid')
      .reply(STATUS_OK_200, {
        url: null,
      });

    const response = await fetchSSOParkerenURL(REQUEST_ID, authProfileAndToken);

    expect(response).toStrictEqual(FALLBACK_URL_RESPONSE);
  });

  test('Unexpected body in 200 response', async () => {
    let authProfileAndToken = getAuthProfileAndToken('private');

    remoteApi
      .get('/parkeren/sso/get_authentication_url?service=digid')
      .reply(200, { noUrl: 'Invalid response' });

    const response = await fetchSSOParkerenURL(REQUEST_ID, authProfileAndToken);

    expect(response).toStrictEqual(FALLBACK_URL_RESPONSE);
  });
});
