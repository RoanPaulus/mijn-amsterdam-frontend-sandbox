import { LOGIN_URL, LOGIN_EHERKENNING_URL } from './Api.constants';

export const AppRoutes = {
  ROOT: '/',
  BURGERZAKEN: '/burgerzaken',
  BURGERZAKEN_DOCUMENT: '/burgerzaken/document/:id',
  WONEN: '/wonen',
  BELASTINGEN: '/belastingen',
  ZORG: '/zorg-en-ondersteuning',
  'ZORG/VOORZIENINGEN': '/zorg-en-ondersteuning/voorzieningen/:id',
  INKOMEN: '/inkomen-en-stadspas',
  'INKOMEN/STADSPAS': '/inkomen-en-stadspas/stadspas/:id',
  'INKOMEN/BIJSTANDSUITKERING': '/inkomen-en-stadspas/bijstandsuitkering/:id',
  'INKOMEN/BIJZONDERE_BIJSTAND': '/inkomen-en-stadspas/bijzondere-bijstand/:id',
  'INKOMEN/SPECIFICATIES':
    '/inkomen-en-stadspas/uitkeringsspecificaties/:type?',
  'INKOMEN/TOZO': '/inkomen-en-stadspas/tozo/:id',
  MIJN_GEGEVENS: '/persoonlijke-gegevens',
  MIJN_BUURT: '/buurt',
  ABOUT: '/over-mijn-amsterdam',
  PROCLAIMER: '/proclaimer',
  API_LOGIN: LOGIN_URL,
  API1_LOGIN: LOGIN_EHERKENNING_URL,
  MIJN_TIPS: '/overzicht-tips',
  UPDATES: '/overzicht-updates',
  AFVAL: '/afval',
};

export const PublicRoutes = [AppRoutes.PROCLAIMER, AppRoutes.API_LOGIN];
export const PrivateRoutes = Object.values(AppRoutes).filter(
  path => !PublicRoutes.includes(path)
);

export const CustomTrackingUrls = {
  [AppRoutes.ROOT]: 'https://mijn.amsterdam.nl/home',
};
