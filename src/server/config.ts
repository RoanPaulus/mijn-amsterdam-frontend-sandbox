import {
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiPostponeResponse,
} from './../universal/helpers/api';
import { AxiosRequestConfig } from 'axios';
import { CorsOptions } from 'cors';
import { ConfigParams } from 'express-openid-connect';
import fs from 'fs';
import https from 'https';
import { FeatureToggle } from '../universal/config';
import { IS_ACCEPTANCE, IS_AP, IS_PRODUCTION } from '../universal/config/env';
import { TokenData } from './helpers/app';
import jose from 'jose';

const BFF_SERVER_ADP_ROOT_CA = process.env.BFF_SERVER_ADP_ROOT_CA;
const BFF_SERVER_PRIVATE_G1_CERT = process.env.BFF_SISA_CA;

export function getCertificateSync(path?: string, name?: string) {
  if (!path) {
    if (name) {
      console.log(`${name}: Certificate path empty ${path}`);
    }
    return '';
  }
  let fileContents: string = '';
  try {
    fileContents = fs.readFileSync(path).toString();
  } catch (error) {}

  return fileContents;
}

export const BFF_REQUEST_CACHE_ENABLED =
  typeof process.env.BFF_REQUEST_CACHE_ENABLED !== 'undefined'
    ? process.env.BFF_REQUEST_CACHE_ENABLED === 'true'
    : true;

// Urls used in the BFF api
// Microservices (Tussen Api) base url
export const BFF_HOST = process.env.BFF_HOST || 'localhost';
export const BFF_PORT = process.env.BFF_PORT || 5000;
export const BFF_BASE_PATH = '/api/v1';
export const BFF_PUBLIC_URL = `${
  process.env.BFF_PUBLIC_URL || `http://${BFF_HOST}:${BFF_PORT}`
}`;

const BFF_MS_API_HOST = IS_PRODUCTION
  ? process.env.BFF_MS_API_HOST || 'mijn.data.amsterdam.nl'
  : IS_ACCEPTANCE
  ? process.env.BFF_MS_API_HOST || 'acc.mijn.data.amsterdam.nl'
  : 'localhost';

const BFF_MS_API_PORT = IS_AP ? '' : `:${BFF_PORT}`;
const BFF_MS_API_PROTOCOL = IS_AP ? 'https' : 'http';

export const BFF_MS_API_BASE_PATH = IS_AP ? '/api' : '';
export const BFF_MS_API_BASE = `${BFF_MS_API_PROTOCOL}://${BFF_MS_API_HOST}${BFF_MS_API_PORT}`;
export const BFF_MS_API_BASE_URL = `${BFF_MS_API_BASE}${BFF_MS_API_BASE_PATH}`;

export const BFF_DATAPUNT_API_BASE_URL = IS_AP
  ? 'https://api.data.amsterdam.nl'
  : 'https://api.data.amsterdam.nl';

export interface DataRequestConfig extends AxiosRequestConfig {
  cacheTimeout?: number;
  cancelTimeout?: number;
  postponeFetch?: boolean;
  urls?: Record<string, string>;

  /**
   * The cacheKey is important if the automatically generated key doesn't suffice. For example if the url changes every request.
   * This can be the case if an IV encrypted parameter is added (erfpacht) to the url. If the url changes everytime the cache won't be hit.
   * In this case we can use a cacheKey. !!!!!Be sure this key is unique to the visitor.!!!!!! The for example the requestID parameter can be used.
   */
  cacheKey?: string;
  /**
   * If true the token passed via `authProfileAndToken` will be sent via { Authorization: `Bearer ${authProfileAndToken.token}` } with the request.
   * If this flag _and_ a custom Authorization header is configured for a request, the custom Header takes presedence.
   */
  passthroughOIDCToken?: boolean;

  combinePaginatedResults?: <T>(
    responseData: any,
    newRequest:
      | ApiSuccessResponse<T>
      | ApiErrorResponse<null>
      | ApiPostponeResponse
  ) => any;

  page?: number;
  maximumAmountOfPages?: number;
}

const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = 60 * ONE_SECOND_MS;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;

export const DEFAULT_API_CACHE_TTL_MS = 45 * ONE_SECOND_MS; // This means that every request that depends on the response of another will use the cached version of the response for a maximum of 45 seconds.
export const DEFAULT_CANCEL_TIMEOUT_MS = 20 * ONE_SECOND_MS; // This means a request will be aborted after 20 seconds without a response.

export const DEFAULT_REQUEST_CONFIG: DataRequestConfig = {
  cancelTimeout: DEFAULT_CANCEL_TIMEOUT_MS,
  method: 'get',
  cacheTimeout: DEFAULT_API_CACHE_TTL_MS,
  postponeFetch: false,
  passthroughOIDCToken: false,
  page: 1,
  maximumAmountOfPages: 0,
};

export type SourceApiKey =
  | 'WMO'
  | 'WPI_E_AANVRAGEN'
  | 'WPI_AANVRAGEN'
  | 'WPI_SPECIFICATIES'
  | 'WPI_STADSPAS'
  | 'BELASTINGEN'
  | 'BEZWAREN_LIST'
  | 'BEZWAREN_DOCUMENT'
  | 'BEZWAREN_DOCUMENTS'
  | 'BEZWAREN_STATUS'
  | 'CLEOPATRA'
  | 'VERGUNNINGEN'
  | 'CMS_CONTENT_GENERAL_INFO'
  | 'CMS_CONTENT_FOOTER'
  | 'CMS_MAINTENANCE_NOTIFICATIONS'
  | 'TIPS'
  | 'BRP'
  | 'ERFPACHT'
  | 'BAG'
  | 'AKTES'
  | 'AFVAL'
  | 'TOERISTISCHE_VERHUUR_REGISTRATIES'
  | 'KVK'
  | 'SEARCH_CONFIG'
  | 'SUBSIDIE'
  | 'KREFIA'
  | 'SIA'
  | 'ENABLEU_2_SMILE'
  | 'LOOD_365'
  | 'LOOD_365_OAUTH';

type ApiDataRequestConfig = Record<SourceApiKey, DataRequestConfig>;

export const ApiConfig: ApiDataRequestConfig = {
  WMO: {
    url: `${BFF_MS_API_BASE_URL}/wmoned/voorzieningen`,
    passthroughOIDCToken: true,
  },
  WPI_E_AANVRAGEN: {
    url: `${BFF_MS_API_BASE_URL}/wpi/e-aanvragen`,
    passthroughOIDCToken: true,
  },
  WPI_AANVRAGEN: {
    url: `${BFF_MS_API_BASE_URL}/wpi/uitkering-en-stadspas/aanvragen`,
    passthroughOIDCToken: true,
  },
  WPI_SPECIFICATIES: {
    url: `${BFF_MS_API_BASE_URL}/wpi/uitkering/specificaties-en-jaaropgaven`,
    passthroughOIDCToken: true,
  },
  WPI_STADSPAS: {
    url: `${BFF_MS_API_BASE_URL}/wpi/stadspas`,
    passthroughOIDCToken: true,
  },
  BEZWAREN_LIST: {
    url: `${process.env.BFF_BEZWAREN_API}/zgw/v1/zaken/_zoek`,
    method: 'POST',
    httpsAgent: new https.Agent({
      ca: IS_AP ? getCertificateSync(BFF_SERVER_PRIVATE_G1_CERT) : [],
    }),
    postponeFetch: !FeatureToggle.bezwarenActive,
  },
  BEZWAREN_DOCUMENT: {
    url: `${process.env.BFF_BEZWAREN_API}/zgw/v1/enkelvoudiginformatieobjecten/:id/download`,
    httpsAgent: new https.Agent({
      ca: IS_AP ? getCertificateSync(BFF_SERVER_PRIVATE_G1_CERT) : [],
    }),
    postponeFetch: !FeatureToggle.bezwarenActive,
  },
  BEZWAREN_DOCUMENTS: {
    url: `${process.env.BFF_BEZWAREN_API}/zgw/v1/zaakinformatieobjecten`,
    httpsAgent: new https.Agent({
      ca: IS_AP ? getCertificateSync(BFF_SERVER_PRIVATE_G1_CERT) : [],
    }),
    postponeFetch: !FeatureToggle.bezwarenActive,
  },
  BEZWAREN_STATUS: {
    url: `${process.env.BFF_BEZWAREN_API}/zgw/v1/statussen`,
    httpsAgent: new https.Agent({
      ca: IS_AP ? getCertificateSync(BFF_SERVER_PRIVATE_G1_CERT) : [],
    }),
    postponeFetch: !FeatureToggle.bezwarenActive,
  },
  BELASTINGEN: {
    url: `${process.env.BFF_BELASTINGEN_ENDPOINT}`,
    httpsAgent: new https.Agent({
      ca: IS_AP ? getCertificateSync(BFF_SERVER_ADP_ROOT_CA) : [],
    }),
    postponeFetch: !FeatureToggle.belastingApiActive,
  },
  CLEOPATRA: {
    url: `${process.env.BFF_CLEOPATRA_API_ENDPOINT}`,
    postponeFetch: !FeatureToggle.milieuzoneApiActive,
    method: 'POST',
    httpsAgent: new https.Agent({
      cert: IS_AP ? getCertificateSync(process.env.BFF_SERVER_CLIENT_CERT) : [],
      key: IS_AP ? getCertificateSync(process.env.BFF_SERVER_CLIENT_KEY) : [],
    }),
  },
  SIA: {
    url: `${process.env.BFF_SIA_BASE_URL}/private/signals/`,
    postponeFetch: !FeatureToggle.siaApiActive,
  },
  VERGUNNINGEN: {
    url: `${BFF_MS_API_BASE_URL}/decosjoin/getvergunningen`,
    postponeFetch: !FeatureToggle.vergunningenActive,
    passthroughOIDCToken: true,
  },
  CMS_CONTENT_GENERAL_INFO: {
    cacheTimeout: 4 * ONE_HOUR_MS,
    urls: {
      private:
        'https://www.amsterdam.nl/mijn-content/artikelen/ziet-amsterdam/?AppIdt=app-data',
      'private-commercial':
        'https://www.amsterdam.nl/mijn-content/artikelen/overzicht-producten-eenmanszaak/?AppIdt=app-data',
      'private-attributes':
        'https://www.amsterdam.nl/mijn-content/artikelen/ziet-amsterdam/?AppIdt=app-data',
      commercial:
        'https://www.amsterdam.nl/mijn-content/artikelen/overzicht-producten-ondernemers/?AppIdt=app-data',
    },
  },
  CMS_CONTENT_FOOTER: {
    url: 'https://www.amsterdam.nl/algemene_onderdelen/overige/footer/?AppIdt=app-data',
    cacheTimeout: 4 * ONE_HOUR_MS,
    postponeFetch: !FeatureToggle.cmsFooterActive,
  },
  CMS_MAINTENANCE_NOTIFICATIONS: {
    url: 'https://www.amsterdam.nl/storingsmeldingen/alle-meldingen-mijn-amsterdam?new_json=true&reload=true',
    cacheTimeout: ONE_HOUR_MS,
  },
  TIPS: {
    url: `${BFF_MS_API_BASE_URL}/tips/gettips`,
  },
  BRP: { url: `${BFF_MS_API_BASE_URL}/brp/brp`, passthroughOIDCToken: true },
  AKTES: {
    url: `${BFF_MS_API_BASE_URL}/aktes/aktes`,
    postponeFetch: !FeatureToggle.aktesActive,
  },
  ERFPACHT: {
    url: process.env.BFF_MIJN_ERFPACHT_API_URL,
  },
  BAG: { url: `${BFF_DATAPUNT_API_BASE_URL}/atlas/search/adres/` },
  AFVAL: {
    url: `${BFF_DATAPUNT_API_BASE_URL}/v1/afvalwijzer/afvalwijzer/`,
  },
  KVK: {
    url: `${BFF_MS_API_BASE_URL}/brp/hr`,
    passthroughOIDCToken: true,
  },
  TOERISTISCHE_VERHUUR_REGISTRATIES: {
    url: process.env.BFF_LVV_API_URL,
    headers: {
      'X-Api-Key': process.env.BFF_LVV_API_KEY + '',
      'Content-Type': 'application/json',
    },
    postponeFetch: !FeatureToggle.toeristischeVerhuurActive,
    httpsAgent: new https.Agent({
      ca: IS_AP ? getCertificateSync(BFF_SERVER_ADP_ROOT_CA) : [],
    }),
  },
  KREFIA: {
    url: `${BFF_MS_API_BASE_URL}/krefia/all`,
    postponeFetch: !FeatureToggle.krefiaActive,
    passthroughOIDCToken: true,
  },
  SUBSIDIE: {
    url: `${process.env.BFF_SISA_API_ENDPOINT}`,
    httpsAgent: new https.Agent({
      ca: IS_AP ? getCertificateSync(BFF_SERVER_PRIVATE_G1_CERT) : [],
    }),
    postponeFetch: !FeatureToggle.subsidieActive,
  },
  SEARCH_CONFIG: {
    url: 'https://raw.githubusercontent.com/Amsterdam/mijn-amsterdam-frontend/main/src/client/components/Search/search-config.json',
    httpsAgent: new https.Agent({
      rejectUnauthorized: false, // NOTE: Risk is assessed and tolerable for now because this concerns a request to a wel known actor (GH), no sensitive data is involved and no JS code is evaluated.
    }),
  },
  ENABLEU_2_SMILE: {
    url: `${process.env.BFF_ENABLEU_2_SMILE_ENDPOINT}`,
    method: 'POST',
    httpsAgent: new https.Agent({
      ca: IS_AP ? getCertificateSync(BFF_SERVER_PRIVATE_G1_CERT) : [],
    }),
  },
  LOOD_365: {
    url: `${process.env.BFF_LOOD_API_URL}`,
    method: 'POST',
    postponeFetch: !FeatureToggle.bodemActive,
  },
  LOOD_365_OAUTH: {
    url: `${process.env.BFF_LOOD_OAUTH}/${process.env.BFF_LOOD_TENANT}/oauth2/v2.0/token`,
    method: 'POST',
    postponeFetch: !FeatureToggle.bodemActive,
    cacheTimeout: 59 * ONE_MINUTE_MS,
  },
};

type ApiUrlObject = string | Partial<Record<ProfileType, string>>;
type ApiUrlEntry = [apiKey: SourceApiKey, apiUrl: ApiUrlObject];

export const ApiUrls = Object.entries(ApiConfig).reduce(
  (acc, [apiName, { url, urls }]) => {
    if (urls) {
      return Object.assign(acc, { [apiName]: urls });
    }
    return Object.assign(acc, { [apiName]: url || '' });
  },
  {} as Record<SourceApiKey, ApiUrlObject>
);

export type ApiUrlEntries = ApiUrlEntry[];
export const apiUrlEntries = Object.entries(ApiUrls) as ApiUrlEntries;

export function getApiConfig(name: SourceApiKey, config?: DataRequestConfig) {
  return Object.assign({}, ApiConfig[name] || {}, config || {});
}

export const RelayPathsAllowed = {
  VERGUNNINGEN_LIST_DOCUMENTS: '/decosjoin/listdocuments/:key',
  VERGUNNINGEN_DOCUMENT_DOWNLOAD: '/decosjoin/document/:key',
  WPI_DOCUMENT_DOWNLOAD: '/wpi/document',
  WPI_STADSPAS_TRANSACTIES: '/wpi/stadspas/transacties/:id',
  BRP_BEWONERS: '/brp/aantal_bewoners',
  TIP_IMAGES: '/tips/static/tip_images/:fileName',
  LOOD_DOCUMENT_DOWNLOAD: '/services/lood/:id/attachments',
  BEZWAREN_DOCUMENT: '/services/bezwaren/:id/attachments',
};

export const AUTH_BASE = '/api/v1/auth';
export const AUTH_BASE_DIGID = `${AUTH_BASE}/digid`;
export const AUTH_BASE_EHERKENNING = `${AUTH_BASE}/eherkenning`;
export const AUTH_BASE_YIVI = `${AUTH_BASE}/yivi`;

export const AUTH_BASE_SSO = `${AUTH_BASE}/sso`;
export const AUTH_BASE_SSO_DIGID = `${AUTH_BASE}/digid/sso`;
export const AUTH_BASE_SSO_EHERKENNING = `${AUTH_BASE}/eherkenning/sso`;

export const AUTH_LOGIN = `${process.env.BFF_OIDC_LOGIN}`;
export const AUTH_LOGOUT = `${process.env.BFF_OIDC_LOGOUT}`;
export const AUTH_CALLBACK = `${process.env.BFF_OIDC_CALLBACK}`;

export const BFF_OIDC_BASE_URL = `${
  process.env.BFF_OIDC_BASE_URL ?? 'https://mijn-bff.amsterdam.nl'
}`;

export const BffEndpoints = {
  API_RELAY: '/relay',
  SERVICES_TIPS: '/services/tips',
  SERVICES_ALL: '/services/all',
  SERVICES_STREAM: '/services/stream',
  MAP_DATASETS: '/map/datasets/:datasetId?/:id?',
  SEARCH_CONFIG: '/services/search-config',

  // Signalen endpoints
  SIA_ATTACHMENTS: '/services/signals/:id/attachments',
  SIA_HISTORY: '/services/signals/:id/history',
  SIA_LIST: '/services/signals/:status/:page',

  // Bezwaren
  BEZWAREN_ATTACHMENTS: '/services/bezwaren/:id/attachments',

  // start: OIDC config
  AUTH_BASE_DIGID,
  AUTH_BASE_EHERKENNING,
  AUTH_BASE_SSO,
  AUTH_BASE_SSO_DIGID,
  AUTH_BASE_SSO_EHERKENNING,
  AUTH_BASE_YIVI,

  // Digid
  AUTH_CALLBACK_DIGID: BFF_OIDC_BASE_URL + AUTH_BASE_DIGID + AUTH_CALLBACK,
  AUTH_LOGIN_DIGID: AUTH_BASE_DIGID + AUTH_LOGIN,
  AUTH_LOGIN_DIGID_LANDING: AUTH_BASE_DIGID + AUTH_LOGIN + '/landing',
  AUTH_LOGOUT_DIGID: AUTH_BASE_DIGID + AUTH_LOGOUT,

  // EHerkenning
  AUTH_CALLBACK_EHERKENNING:
    BFF_OIDC_BASE_URL + AUTH_BASE_EHERKENNING + AUTH_CALLBACK,
  AUTH_LOGIN_EHERKENNING: AUTH_BASE_EHERKENNING + AUTH_LOGIN,
  AUTH_LOGIN_EHERKENNING_LANDING:
    AUTH_BASE_EHERKENNING + AUTH_LOGIN + '/landing',
  AUTH_LOGOUT_EHERKENNING: AUTH_BASE_EHERKENNING + AUTH_LOGOUT,

  // YIVI
  AUTH_CALLBACK_YIVI: BFF_OIDC_BASE_URL + AUTH_BASE_YIVI + AUTH_CALLBACK,
  AUTH_LOGIN_YIVI: AUTH_BASE_YIVI + AUTH_LOGIN,
  AUTH_LOGIN_YIVI_LANDING: AUTH_BASE_YIVI + AUTH_LOGIN + '/landing',
  AUTH_LOGOUT_YIVI: AUTH_BASE_YIVI + AUTH_LOGOUT,

  // Application specific urls
  AUTH_CHECK: `${AUTH_BASE}/check`,
  AUTH_CHECK_EHERKENNING: `${AUTH_BASE_EHERKENNING}/check`,
  AUTH_CHECK_DIGID: `${AUTH_BASE_DIGID}/check`,
  AUTH_CHECK_YIVI: `${AUTH_BASE_YIVI}/check`,
  AUTH_TOKEN_DATA: `${AUTH_BASE}/token-data`,
  AUTH_TOKEN_DATA_EHERKENNING: `${AUTH_BASE_EHERKENNING}/token-data`,
  AUTH_TOKEN_DATA_DIGID: `${AUTH_BASE_DIGID}/token-data`,
  AUTH_TOKEN_DATA_YIVI: `${AUTH_BASE_YIVI}/token-data`,
  AUTH_LOGOUT: `${AUTH_BASE}/logout`,
  // end: OIDC config

  CMS_CONTENT: '/services/cms',
  CMS_MAINTENANCE_NOTIFICATIONS: '/services/cms/maintenance-notifications',
  CACHE_OVERVIEW: '/status/cache',
  LOGIN_STATS: '/status/logins/:authMethod?',
  STATUS_HEALTH: '/bff/status/health',

  LOODMETING_ATTACHMENTS: '/services/lood/:id/attachments',
};

export const PUBLIC_BFF_ENDPOINTS: string[] = [
  BffEndpoints.STATUS_HEALTH,
  BffEndpoints.CMS_CONTENT,
  BffEndpoints.CMS_MAINTENANCE_NOTIFICATIONS,
  BffEndpoints.CACHE_OVERVIEW,
];

export const RELAY_PATHS_EXCLUDED_FROM_ADDING_AUTHORIZATION_HEADER = [
  '/tips/static/tip_images',
];

export const OIDC_SESSION_MAX_AGE_SECONDS = 15 * 60; // 15 minutes
export const OIDC_SESSION_COOKIE_NAME = '__MA-appSession';
export const OIDC_COOKIE_ENCRYPTION_KEY = `${process.env.BFF_GENERAL_ENCRYPTION_KEY}`;
export const OIDC_ID_TOKEN_EXP = '1 hours'; // Arbitrary, MA wants a token to be valid for a maximum of 1 hours.
export const OIDC_IS_TOKEN_EXP_VERIFICATION_ENABLED = true;

const oidcConfigBase: ConfigParams = {
  authRequired: false,
  auth0Logout: false,
  idpLogout: true,
  secret: OIDC_COOKIE_ENCRYPTION_KEY,
  baseURL: BFF_OIDC_BASE_URL,
  issuerBaseURL: process.env.BFF_OIDC_ISSUER_BASE_URL,
  attemptSilentLogin: false,
  authorizationParams: { prompt: 'login' },
  clockTolerance: 120, // 2 minutes
  // @ts-ignore
  session: {
    rolling: true,
    rollingDuration: OIDC_SESSION_MAX_AGE_SECONDS,
    name: OIDC_SESSION_COOKIE_NAME,
  },
  routes: {
    login: false,
    logout: AUTH_LOGOUT,
    callback: AUTH_CALLBACK, // Relative to the Router path
    postLogoutRedirect: process.env.BFF_FRONTEND_URL,
  },
  afterCallback: (req, res, session) => {
    const claims = jose.JWT.decode(session.id_token) as {
      nonce: string;
    };

    const authVerification = JSON.parse(
      req.cookies.auth_verification.split('.')[0]
    );

    if (claims.nonce !== authVerification.nonce) {
      throw new Error(`Nonce invalid`);
    }

    if (req.query.state !== authVerification.state) {
      throw new Error(`State invalid`);
    }

    return session;
  },
};

export const oidcConfigDigid: ConfigParams = {
  ...oidcConfigBase,
  clientID: process.env.BFF_OIDC_CLIENT_ID_DIGID,
};

export const oidcConfigEherkenning: ConfigParams = {
  ...oidcConfigBase,
  clientID: process.env.BFF_OIDC_CLIENT_ID_EHERKENNING,
};

export const oidcConfigYivi: ConfigParams = {
  ...oidcConfigBase,
  clientID: process.env.BFF_OIDC_CLIENT_ID_YIVI,
  authorizationParams: { prompt: 'login', max_age: 0 },
  routes: {
    ...oidcConfigBase.routes,
    postLogoutRedirect: process.env.BFF_OIDC_YIVI_POST_LOGOUT_REDIRECT,
  },
};

// Op 1.13 met ketenmachtiging
export const EH_ATTR_INTERMEDIATE_PRIMARY_ID =
  'urn:etoegang:core:LegalSubjectID';
export const EH_ATTR_INTERMEDIATE_SECONDARY_ID =
  'urn:etoegang:1.9:IntermediateEntityID:KvKnr';

// 1.13 inlog zonder ketenmachtiging:
export const EH_ATTR_PRIMARY_ID = 'urn:etoegang:core:LegalSubjectID';

// < 1.13 id
export const EH_ATTR_PRIMARY_ID_LEGACY =
  'urn:etoegang:1.9:EntityConcernedID:KvKnr';

export const DIGID_ATTR_PRIMARY = 'sub';
export const YIVI_ATTR_PRIMARY = 'sub';

export const OIDC_TOKEN_ID_ATTRIBUTE = {
  eherkenning: (tokenData: TokenData) => {
    if (FeatureToggle.ehKetenmachtigingActive) {
      if (
        EH_ATTR_INTERMEDIATE_PRIMARY_ID in tokenData &&
        EH_ATTR_INTERMEDIATE_SECONDARY_ID in tokenData
      ) {
        return EH_ATTR_INTERMEDIATE_PRIMARY_ID;
      }

      if (EH_ATTR_PRIMARY_ID in tokenData) {
        return EH_ATTR_PRIMARY_ID;
      }
    }

    // Attr Prior to 1.13
    return EH_ATTR_PRIMARY_ID_LEGACY;
  },
  digid: () => DIGID_ATTR_PRIMARY,
  yivi: () => YIVI_ATTR_PRIMARY,
};

export const DEV_TOKEN_ID_ATTRIBUTE = {
  eherkenning: EH_ATTR_PRIMARY_ID,
  digid: DIGID_ATTR_PRIMARY,
  yivi: YIVI_ATTR_PRIMARY,
};

export const OIDC_TOKEN_AUD_ATTRIBUTE_VALUE = {
  get eherkenning() {
    return oidcConfigEherkenning.clientID;
  },
  get digid() {
    return oidcConfigDigid.clientID;
  },
  get yivi() {
    return oidcConfigYivi.clientID;
  },
};

export const corsOptions: CorsOptions = {
  origin: process.env.BFF_FRONTEND_URL,
  credentials: true,
};

export const DEV_JWK_PUBLIC: any = {
  kty: 'RSA',
  e: 'AQAB',
  use: 'sig',
  kid: '8YN3pNDUUyho-tQB25afq8DKCrxt2V-bS6W9gRk0cgk',
  alg: 'RS256',
  n: '0CXtOrsyIGkhhJ_sHzGbyK9U6sug4HdjdSNaq-FVbFFO_OeAaS8NvzM7DJXkZvmvZ7HNIPdlRk0-TCELmbOGK1RlddQZA_iic9DePydxloNJIWmUVI5GK1T84PxhjnMfBAD3SWPdTZ0zG1IubAjUJT4nwl0uVdzp0-LixbmKPQU87dqA1jt7ZuC73M55oZAyi1e2fzvgdxWyM7-NyvkZqwG2eGoDQ3SNb0rArlHTgdsLf1YsGPxn1wN3bSjhrq6af4fCnB5UVRb-r3g4NN_VJxBOc2xGDDoOgaPW9XW-BhSefc2hqRjTwtjaGiZFLdEuZdcq_mUB-AHc0YYD3_4VXw',
};

export const DEV_JWK_PRIVATE: any = {
  p: '8b-T1GJux6AGYWz1FLaXdTVkXsVQ2_oNFMs-gJBRXMpDT_1g3LlrjtEd_Y2-HuaDbEAoS8ccGlC9IIjbYcunQBqD1whl3tiGFswzDk2DUaJjXZnPAjYHWUHa1cl3tkDEo9uzWJ0h201QH7bG0Ls2Jl1IPOtSzPcNHBO0iWg_WH0',
  kty: 'RSA',
  q: '3GtC1fHI297LqVHGN9btnf5nt7pT_TVWltYxio3DJvrNsAHiAHmwr87FNheSLcaBgUgqGYcGnQrvnW4Ly_c5Sb_xEMwigp5TcpjPYjHZGv5ML5Rf8yEZJAjiFJ6RuUWRHOZ0qRJSnFuVDdj1xfH4dUkZGfJ2vl9DMm6mRhGk6As',
  d: 'mYegF_YD30wsYPrk241n7vsEk7tnCqqFPd25_5XRwHeo33qSiQMgDKvpHjthoWMCMmY_e9V_af-Ht_eX6uM0T7mMrQCpAvjeOrcRd1vMuMxVoMOTmVrn_wZNEFaYTs4zTmy3-fYjQiB1le1kOGO6t03FXeQFTWgJQTTVOCrHAIILrOSj0HqtQomzsw9J7MLXd2eRuKDZydRSbJEhPg3NUzHeJjbuKJg6aVlj-gSaQ1s79vteIjm3pwItAkEsSP5R4LCrlxPPdIW4ghemGwi2jIfJhxzW7v3Q0sI6MYZ10FwkiUh9W1IUbUADQIT7Jf7EZ1yt_u8s7c9dvJ-NotHi4Q',
  e: 'AQAB',
  use: 'sig',
  kid: '8YN3pNDUUyho-tQB25afq8DKCrxt2V-bS6W9gRk0cgk',
  qi: 'fAfkX1oqy_U-vU_eaCgEHYvZZxS7r1pSZpqipFitJdHayqlZEVwddmQZZ30IX3tHk3NRfjm6zy6FCXrVXVleAOkPyJpPXVsK_GiUufh28u5hPncs3KaFU0tTQ373Vd7IgOF7IhshyImR6UAXQiLSPLaEFQdte5DRL4kMkgwYHF8',
  dp: 'EyIpjh64S95zgtR_1ULaW_F83y9YxgBVdrbbXIuPlPuBNlyEhRO72pLcf8vvJzzxW-j8B3tb0w1e2qtaSbQ3qZAvrR5CCdAzVKyWweQKp7Rljuv0gWVLUZovusn2Spt3tMxXtoTBQD0vQUNTGwQmNgUeCYxKgmRvSjCZEmMI2HU',
  alg: 'RS256',
  dq: '2xIAK4NTjrOw12hfCcCkChOAIisertsEZIYeVwbunx9Gr1gvtyk7YoCvoUNsFfLlZAjFTvnUqODlpiJptx7P4WzTu04oPon9hjg6Ze4FSb7VGbTuaEbNJfNuP_AaBXoO8BpceG2tjZm4Wzr3ivUja-5q9E73ld44ezdeKuX-cGE',
  n: '0CXtOrsyIGkhhJ_sHzGbyK9U6sug4HdjdSNaq-FVbFFO_OeAaS8NvzM7DJXkZvmvZ7HNIPdlRk0-TCELmbOGK1RlddQZA_iic9DePydxloNJIWmUVI5GK1T84PxhjnMfBAD3SWPdTZ0zG1IubAjUJT4nwl0uVdzp0-LixbmKPQU87dqA1jt7ZuC73M55oZAyi1e2fzvgdxWyM7-NyvkZqwG2eGoDQ3SNb0rArlHTgdsLf1YsGPxn1wN3bSjhrq6af4fCnB5UVRb-r3g4NN_VJxBOc2xGDDoOgaPW9XW-BhSefc2hqRjTwtjaGiZFLdEuZdcq_mUB-AHc0YYD3_4VXw',
};

export const securityHeaders = {
  'Permissions-Policy':
    'geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()',
  'Referrer-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'Deny',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': `
    default-src 'none';
    connect-src 'none';
    script-src 'none';
    img-src 'none';
    frame-src 'none';
    style-src 'none';
    font-src 'none';
    manifest-src 'none';
    object-src 'none';
    frame-ancestors 'none';
    require-trusted-types-for 'script'
  `.replace(/\n/g, ''),
};
