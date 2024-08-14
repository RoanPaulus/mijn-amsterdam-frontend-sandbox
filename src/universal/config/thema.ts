// Within the team we call these Themes / Thema's
export type Thema =
  | 'AFIS'
  | 'AFVAL'
  | 'BELASTINGEN'
  | 'BURGERZAKEN'
  | 'BUURT'
  | 'BEZWAREN'
  | 'INKOMEN'
  | 'HLI'
  | 'BRP'
  | 'MILIEUZONE'
  | 'OVERTREDINGEN'
  | 'NOTIFICATIONS'
  | 'ROOT'
  | 'ERFPACHT'
  | 'ERFPACHTv2'
  | 'ZORG'
  | 'VERGUNNINGEN'
  | 'SVWI'
  | 'KVK'
  | 'TOERISTISCHE_VERHUUR'
  | 'SEARCH'
  | 'SUBSIDIE'
  | 'PARKEREN'
  | 'KLACHTEN'
  | 'HORECA'
  | 'KREFIA'
  | 'AVG'
  | 'BODEM'
  | string;

export const Themas: Record<Thema, Thema> = {
  AFIS: 'AFIS',
  AFVAL: 'AFVAL',
  AVG: 'AVG',
  BELASTINGEN: 'BELASTINGEN',
  BEZWAREN: 'BEZWAREN',
  BODEM: 'BODEM',
  BRP: 'BRP',
  BURGERZAKEN: 'BURGERZAKEN',
  BUURT: 'BUURT',
  ERFPACHT: 'ERFPACHT',
  ERFPACHTv2: 'ERFPACHTv2',
  HLI: 'HLI',
  HORECA: 'HORECA',
  INKOMEN: 'INKOMEN',
  KLACHTEN: 'KLACHTEN',
  KREFIA: 'KREFIA',
  KVK: 'KVK',
  MILIEUZONE: 'MILIEUZONE',
  NOTIFICATIONS: 'NOTIFICATIONS',
  OVERTREDINGEN: 'OVERTREDINGEN',
  PARKEREN: 'PARKEREN',
  ROOT: 'ROOT',
  SEARCH: 'SEARCH',
  SUBSIDIE: 'SUBSIDIE',
  SVWI: 'SVWI',
  TOERISTISCHE_VERHUUR: 'TOERISTISCHE_VERHUUR',
  VERGUNNINGEN: 'VERGUNNINGEN',
  ZORG: 'ZORG',
};
