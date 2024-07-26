export const AppRoutes = {
  ROOT: '/',
  HOME: '/',
  BURGERZAKEN: '/burgerzaken',
  'BURGERZAKEN/ID-KAART': '/burgerzaken/id-kaart/:id',
  ZORG: '/zorg-en-ondersteuning',
  'ZORG/VOORZIENINGEN': '/zorg-en-ondersteuning/voorzieningen/:id',

  HLI: '/regelingen-bij-laag-inkomen',
  'HLI/STADSPAS': '/regelingen-bij-laag-inkomen/stadspas/:id',
  'HLI/REGELING': '/regelingen-bij-laag-inkomen/regeling/:regeling/:id',
  'HLI/REGELINGEN_LIJST':
    '/regelingen-bij-laag-inkomen/eerdere-en-afgewezen-regelingen/:page?',

  'INKOMEN/BIJSTANDSUITKERING': '/inkomen/bijstandsuitkering/:id',
  'INKOMEN/SPECIFICATIES': '/inkomen/specificaties/:variant/:page?',
  'INKOMEN/TOZO': '/inkomen/tozo/:version/:id',
  'INKOMEN/TONK': '/inkomen/tonk/:version/:id',
  'INKOMEN/BBZ': '/inkomen/bbz/:version/:id',
  INKOMEN: '/inkomen',
  AFIS: '/afis',
  BRP: '/persoonlijke-gegevens',
  KVK: '/gegevens-handelsregister',
  BUURT: '/buurt',
  BEZWAREN: '/bezwaren',
  'BEZWAREN/DETAIL': '/bezwaren/:uuid',
  API_LOGIN: '/api/login',
  API1_LOGIN: '/api1/login',
  API2_LOGIN: '/api2/login',
  NOTIFICATIONS: '/overzicht-updates/:page?',
  AFVAL: '/afval',
  ACCESSIBILITY: '/toegankelijkheidsverklaring',
  GENERAL_INFO: '/uitleg',
  VERGUNNINGEN: '/vergunningen',
  'VERGUNNINGEN/LIST': '/vergunningen/lijst/:kind/:page?',
  'VERGUNNINGEN/DETAIL': '/vergunningen/:title/:id',
  TOERISTISCHE_VERHUUR: '/toeristische-verhuur',
  'TOERISTISCHE_VERHUUR/VERGUNNING': '/toeristische-verhuur/vergunning/:id',
  'TOERISTISCHE_VERHUUR/VERGUNNING/BB':
    '/toeristische-verhuur/vergunning/bed-and-breakfast/:id',
  'TOERISTISCHE_VERHUUR/VERGUNNING/VV':
    '/toeristische-verhuur/vergunning/vakantieverhuur/:id',
  SEARCH: '/zoeken',
  KREFIA: '/kredietbank-fibu',
  PARKEREN: '/parkeren',
  KLACHTEN: '/klachten/:page?',
  'KLACHTEN/KLACHT': '/klachten/klacht/:id',
  HORECA: '/horeca/',
  'HORECA/DETAIL': '/horeca/:title/:id',
  AVG: '/avg',
  'AVG/DETAIL': '/avg/verzoek/:id',
  BFF_500_ERROR: '/server-error-500',
  BODEM: '/bodem',
  'BODEM/LOOD_METING': '/lood-meting/:id',

  // Erfpacht v2
  ERFPACHTv2: '/erfpacht',
  'ERFPACHTv2/DOSSIERS': '/erfpacht/dossiers/:page?',
  'ERFPACHTv2/DOSSIERDETAIL': '/erfpacht/dossier/:dossierNummerUrlParam',
  'ERFPACHTv2/OPEN_FACTUREN': '/erfpacht/open-facturen/:page?',
  'ERFPACHTv2/ALLE_FACTUREN':
    '/erfpacht/facturen/:dossierNummerUrlParam/:page?',

  ZAAK_STATUS: '/zaak-status',
} as const;

export type RouteKey = keyof typeof AppRoutes;
export type AppRoute = (typeof AppRoutes)[RouteKey];
