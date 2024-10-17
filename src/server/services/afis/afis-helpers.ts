import { fetchAfisTokenHeader } from './afis';
import { AfisApiFeedResponseSource } from './afis-types';
import { DataRequestConfig } from '../../config/source-api';
import { getFromEnv } from '../../helpers/env';
import { getApiConfig } from '../../helpers/source-api-helpers';

export function getFeedEntryProperties<T>(
  response: AfisApiFeedResponseSource<T>
) {
  if (Array.isArray(response?.feed?.entry)) {
    return response.feed.entry
      .map((entry) => {
        return entry?.content?.properties ?? null;
      })
      .filter((entry) => entry !== null);
  }

  return [];
}

export async function getAfisApiConfig(additionalConfig?: DataRequestConfig) {
  // If Afis EnableU is active, token fetching is taken care of by EnableU Gateway.
  const authHeader =
    getFromEnv('BFF_AFIS_ENABLEU_ACTIVE') === 'true'
      ? { apiKey: getFromEnv('BFF_ENABLEU_AFIS_API_KEY') }
      : await fetchAfisTokenHeader();

  const additionalConfigWithHeader: DataRequestConfig = {
    ...(additionalConfig ?? null),
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
  };
  return getApiConfig('AFIS', additionalConfigWithHeader);
}
