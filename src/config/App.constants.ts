import { StateKey } from 'AppState';
import { ErrorMessageMap } from 'components/ErrorMessages/ErrorMessages';
import { MyNotification } from 'hooks/api/my-notifications-api.hook';
import { isProduction } from '../helpers/App';

// Within the team we call these Themes
export type Chapter =
  | 'ROOT'
  | 'BURGERZAKEN'
  | 'WONEN'
  | 'BELASTINGEN'
  | 'ZORG'
  | 'INKOMEN'
  | 'MELDINGEN'
  | 'MIJN_BUURT'
  | 'MIJN_TIPS'
  | 'MIJN_GEGEVENS'
  | 'AFVAL';

export const Chapters: { [chapter in Chapter]: Chapter } = {
  ROOT: 'ROOT',
  MIJN_BUURT: 'MIJN_BUURT',
  BURGERZAKEN: 'BURGERZAKEN',
  MIJN_GEGEVENS: 'MIJN_GEGEVENS',
  WONEN: 'WONEN',
  BELASTINGEN: 'BELASTINGEN',
  ZORG: 'ZORG',
  INKOMEN: 'INKOMEN',
  MELDINGEN: 'MELDINGEN',
  MIJN_TIPS: 'MIJN_TIPS',
  AFVAL: 'AFVAL',
};

export const AppRoutes = {
  ROOT: '/',
  BURGERZAKEN: '/burgerzaken',
  WONEN: '/wonen',
  BELASTINGEN: '/belastingen',
  ZORG: '/zorg-en-ondersteuning',
  'ZORG/VOORZIENINGEN': '/zorg-en-ondersteuning/voorzieningen/:id',
  INKOMEN: '/werk-en-inkomen',
  'INKOMEN/STADSPAS': '/werk-en-inkomen/stadspas/:id',
  'INKOMEN/BIJSTANDSUITKERING': '/werk-en-inkomen/bijstandsuitkering/:id',
  'INKOMEN/BIJZONDERE_BIJSTAND': '/werk-en-inkomen/bijzondere-bijstand/:id',
  MIJN_GEGEVENS: '/persoonlijke-gegevens',
  MIJN_BUURT: '/buurt',
  ABOUT: '/over-mijn-amsterdam',
  PROCLAIMER: '/proclaimer',
  API_LOGIN: '/api/login',
  MIJN_TIPS: '/overzicht-tips',
  MELDINGEN: '/overzicht-meldingen',
  AFVAL: '/afval',
};

export const PublicRoutes = [AppRoutes.PROCLAIMER, AppRoutes.API_LOGIN];
export const PrivateRoutes = Object.values(AppRoutes).filter(
  path => !PublicRoutes.includes(path)
);

export const PageTitleMain = 'Mijn Amsterdam';

// These are used for PageHeadings and link title props for example.
export const ChapterTitles: { [chapter in Chapter]: string } = {
  INKOMEN: 'Werk en inkomen',
  BURGERZAKEN: 'Burgerzaken',
  BELASTINGEN: 'Belastingen',
  WONEN: 'Erfpacht',
  ZORG: 'Zorg en ondersteuning',
  ROOT: 'Home',
  MELDINGEN: 'Actueel',
  MIJN_GEGEVENS: 'Mijn gegevens',
  MIJN_BUURT: 'Mijn buurt',
  MIJN_TIPS: 'Mijn tips',
  AFVAL: 'Afval',
};

export const PageTitles = {
  [AppRoutes.ROOT]: 'Home | Dashboard',
  [AppRoutes.BURGERZAKEN]: ChapterTitles.BURGERZAKEN,
  [AppRoutes.BELASTINGEN]: ChapterTitles.BELASTINGEN,
  [AppRoutes.ZORG]: `${ChapterTitles.ZORG} overzicht`,
  [AppRoutes['ZORG/VOORZIENINGEN']]: `Voorziening | ${ChapterTitles.ZORG}`,
  [AppRoutes.INKOMEN]: `${ChapterTitles.INKOMEN} | overzicht`,
  [AppRoutes['INKOMEN/BIJSTANDSUITKERING']]: `Bijstandsuitkering`,
  [AppRoutes['INKOMEN/STADSPAS']]: `Stadspas | ${ChapterTitles.INKOMEN}`,
  [AppRoutes[
    'INKOMEN/BIJZONDERE_BIJSTAND'
  ]]: `Bijzondere bijstand | ${ChapterTitles.INKOMEN}`,
  [AppRoutes.MIJN_GEGEVENS]: `Profiel`,
  [AppRoutes.MIJN_BUURT]: `Mijn buurt`,
  [AppRoutes.PROCLAIMER]: `Proclaimer`,
  [AppRoutes.MIJN_TIPS]: `Mijn Tips | overzicht`,
  [AppRoutes.MELDINGEN]: `${ChapterTitles.MELDINGEN} | overzicht`,
  [AppRoutes.AFVAL]: `${ChapterTitles.AFVAL} rond uw adres`,
};

export const CustomTrackingUrls = {
  [AppRoutes.ROOT]: 'https://mijn.amsterdam.nl/home',
};

export const LOGIN_URL = process.env.REACT_APP_LOGIN_URL || '/login';
export const LOGOUT_URL = process.env.REACT_APP_LOGOUT_URL || '/logout';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const DATAPUNT_API_BASE_URL = process.env.REACT_APP_DATAPUNT_API_URL;

export type ApiName = StateKey | 'BAG' | 'AUTH' | 'AFVAL_OPHAAL_GEBIEDEN';

export const ApiUrls: TypeIndex<ApiName, string> = {
  MELDINGEN: `${API_BASE_URL}/mijn-meldingen`,
  MY_CASES: `${API_BASE_URL}/focus/aanvragen`,
  MIJN_TIPS: `${API_BASE_URL}/tips/gettips`,
  BRP: `${API_BASE_URL}/brp/brp`,
  WMO: `${API_BASE_URL}/wmoned/voorzieningen`,
  FOCUS: `${API_BASE_URL}/focus/aanvragen`,
  AUTH: `${API_BASE_URL}/auth/check`,
  ERFPACHT: `${API_BASE_URL}/erfpacht/check-erfpacht`,
  BAG: `${DATAPUNT_API_BASE_URL}/atlas/search/adres/`,
  AFVAL_OPHAAL_GEBIEDEN: `${DATAPUNT_API_BASE_URL}/afvalophaalgebieden/search/`,
};

export interface ApiConfig {
  postponeFetch: boolean;
}

export const ApiConfig: TypeIndex<ApiName, ApiConfig> = {
  FOCUS: {
    postponeFetch: false,
  },
  WMO: {
    postponeFetch: false,
  },
  MIJN_TIPS: {
    postponeFetch: true, // Stays true because we're not fetching immediately
  },
};

export const FeatureToggle = {
  myTipsoptInOutPersonalization: true,
  garbageInformationPage: true,
  focusDocumentDownload: !isProduction(),
};

export const errorMessageMap: ErrorMessageMap = {
  BRP: {
    name: 'Persoonsgegevens',
    error: 'Communicatie met api mislukt.',
  },
  MELDINGEN: {
    name: 'Actueel',
    error: 'Communicatie met api mislukt.',
  },
  MY_CASES: {
    name: 'Mijn lopende aanvragen',
    error: 'Communicatie met api mislukt.',
  },
  MIJN_TIPS: {
    name: 'Mijn tips',
    error: 'Communicatie met api mislukt.',
  },
  WMO: {
    name: 'Zorg en ondersteuning',
    error: 'Communicatie met api mislukt.',
  },
  FOCUS: {
    name: 'Stadspas of Bijstandsuitkering',
    error: 'Communicatie met api mislukt.',
  },
  ERFPACHT: {
    name: 'Erfpacht',
    error: 'Communicatie met api mislukt.',
  },
  GARBAGE: {
    name: 'Afval',
    error: 'Communicatie met api mislukt.',
  },
};

// See https://date-fns.org/v1.30.1/docs/format for more formatting options
export const DEFAULT_DATE_FORMAT = 'dd MMMM yyyy';

export const ExternalUrls = {
  CHANGE_PERSONAL_DATA:
    'https://www.amsterdam.nl/veelgevraagd/?productid=%7B989C04B3-AD81-4ABA-8DFE-465A29E2BF85%7D',
  REPORT_RELOCATION:
    'https://www.amsterdam.nl/burgerzaken/verhuizing-doorgeven/',
  CONTACT_FORM:
    'https://formulieren.amsterdam.nl/TripleForms/DirectRegelen/formulier/nl-NL/evAmsterdam/Klachtenformulier.aspx',
  SSO_ERFPACHT: process.env.REACT_APP_ERFPACHT_URL,
  BERICHTENBOX: 'https://mijn.overheid.nl/berichtenbox/inbox/',
  CONTACT_GENERAL: 'https://www.amsterdam.nl/contact/',
  AMSTERDAM_NEWSLETTER:
    'https://www.amsterdam.nl/nieuwsbrieven/actueel/nieuwsbrief/nieuwsbrief/',
  AMSTERDAM_TWITTER: 'https://twitter.com/AmsterdamNL',
  AMSTERDAM_FACEBOOK: 'https://www.facebook.com/gemeenteamsterdam',
  AMSTERDAM_INSTAGRAM: 'https://www.instagram.com/gemeenteamsterdam/',
  AMSTERDAM_LINKEDIN: 'https://www.linkedin.com/company/gemeente-amsterdam',
  AMSTERDAM_VACATURES:
    'https://www.amsterdam.nl/bestuur-organisatie/werkenbij/',
  ZORG_LEES_MEER: 'https://www.amsterdam.nl/zorg-ondersteuning/',
  SSO_BELASTINGEN: 'https://belastingbalie.amsterdam.nl/digid.saml.php?start',
  MIJN_SUBSIDIES: 'https://mijnsubsidies.amsterdam.nl/loket/',
  MIJN_AMSTERDAM_VEELGEVRAAGD:
    'https://www.amsterdam.nl/veelgevraagd/?productid={68422ECA-8C56-43EC-A9AA-B3DF190B5077}',
  AMSTERDAM: 'https://www.amsterdam.nl',
  WPI_CONTACT: 'https://www.amsterdam.nl/werk-inkomen/contact/',
  WPI_REGELINGEN: 'https://www.amsterdam.nl/werk-inkomen/uitkeringen/',
  AFVAL: 'https://www.amsterdam.nl/afval/',
  AFVAL_AFSPRAAK_MAKEN:
    'https://formulieren.amsterdam.nl/TriplEforms/DirectRegelen/formulier/nl-NL/evAmsterdam/Grofvuil.aspx',
  AMSTERDAM_COMPLAINTS_FROM:
    'https://formulieren.amsterdam.nl/TriplEforms/DirectRegelen/formulier/nl-NL/evAmsterdam/scKlachtenformulier.aspx/fKlachtenformulier',
  AMSTERDAM_PRIVACY_PAGE: 'https://www.amsterdam.nl/privacy',
  AFVAL_MELDING_FORMULIER:
    'https://formulier.amsterdam.nl/mail/afval/afvalwijzer/',
};

// NOTE: Keep up-to-date with _colors.scss
export const Colors = {
  white: 'white',
  black: 'black',
  primaryRed: '#EC0000',
  primaryDarkblue: '#004699',
  neutralGrey1: '#F5F5F5',
  neutralGrey2: '#E6E6E6',
  neutralGrey3: '#B4B4B4',
  neutralGrey4: '#767676',
  neutralGrey5: '#323232',
  supportValid: '#00A03C',
  supportInvalid: '#EC0000',
  supportFocus: '#FEC813',
  supportPurple: '#A00078',
  supportPink: '#E50082',
  supportOrange: '#FF9100',
  supportYellow: '#FFE600',
  supportLightgreen: '#BED200',
  supportDarkgreen: '#00A03C',
  supportLightblue: '#009DEC',
  overlayBlack50: 'rgba(0, 0, 0, 0.5)',
};

// NOTE: Keep up-to-date with _breakpoints.scss
export const Breakpoints = {
  tablet: 1024, // px
  phone: 640, // px
};

export const WelcomeNotification: MyNotification = {
  id: 'welcome01',
  chapter: Chapters.MELDINGEN,
  datePublished: new Date(2019, 10, 11).toISOString(),
  title: 'Welkom op Mijn Amsterdam!',
  description:
    'Deze website is nog volop in ontwikkeling. Gaandeweg komt meer informatie voor u beschikbaar.',
  customLink: {
    callback: () => {
      const usabilla = (window as any).usabilla_live;
      if (usabilla) {
        usabilla('click');
      } else {
        window.location.href = ExternalUrls.CONTACT_FORM;
      }
    },
    title: 'Laat ons weten wat u ervan vindt',
  },
};
