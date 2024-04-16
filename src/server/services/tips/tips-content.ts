import { Chapters } from '../../../universal/config';
import {
  hasBijstandsuitkering,
  hasBnBTransitionRight,
  hasBnBVergunning,
  hasDutchNationality,
  hasKidsBetweenAges2And18,
  hasKidsBetweenAges4And11,
  hasOldestKidBornFrom2016,
  hasStadspasGroeneStip,
  hasToeristicheVerhuurVergunningen,
  hasTozo,
  hasValidId,
  hasValidIdForVoting,
  hasValidStadspasRequest,
  hasVerhuurRegistrations,
  is18OrOlder,
  isBetween17and18,
  isLivingInAmsterdamLessThanNumberOfDays,
  isMarriedOrLivingTogether,
  isMokum,
  isReceivingSubsidy,
  not,
  or,
  previouslyLivingInAmsterdam,
} from './predicates';
import { Tip } from './tip-types';

export const tips: Tip[] = [
  {
    id: 'mijn-10',
    active: true,
    dateActiveStart: null,
    dateActiveEnd: null,
    priority: 70,
    datePublished: '2019-08-18',
    title: 'Tip: Bekijk de afvalpunten in de buurt',
    profileTypes: ['private'],
    chapter: Chapters.AFVAL,
    description: 'Kijk waar het dichtstbijzijnde Afvalpunt is.',
    predicates: [isLivingInAmsterdamLessThanNumberOfDays(3)],
    reason: 'U ziet deze tip omdat u net bent verhuisd',
    link: {
      title: 'Kijk op de kaart',
      to: '/buurt',
    },
  },
  {
    id: 'mijn-11',
    active: true,
    dateActiveStart: null,
    dateActiveEnd: null,
    priority: 70,
    datePublished: '2019-10-22',
    title: 'Tip: Op stap met uw Stadspas',
    profileTypes: ['private'],
    chapter: Chapters.STADSPAS,
    description: 'Haalt u alles uit uw Stadspas?',
    reason: 'U ziet deze tip omdat u een stadspas hebt aangevraagd.',
    predicates: [hasValidStadspasRequest],
    link: {
      title: 'Bekijk de aanbiedingen',
      to: 'https://www.amsterdam.nl/toerisme-vrije-tijd/stadspas/',
    },
  },
  {
    id: 'mijn-16',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: null,
    active: true,
    priority: 70,
    datePublished: '2020-07-03',
    title: 'Tip: Welkom in Amsterdam',
    chapter: Chapters.BRP,
    profileTypes: ['private'],
    description:
      'U bent net in Amsterdam komen wonen, welkom! Blijf op de hoogte van het nieuws in uw stadsdeel.',
    predicates: [
      isLivingInAmsterdamLessThanNumberOfDays(6),
      not(previouslyLivingInAmsterdam),
    ],
    reason: 'U ziet deze tip omdat u net naar Amsterdam bent verhuisd',
    link: {
      title: 'Lees meer in deze nieuwsbrief',
      to: 'https://www.amsterdam.nl/nieuwsbrief/',
    },
  },
  {
    id: 'mijn-23',
    owner: '',
    dateActiveStart: '2020-11-16',
    dateActiveEnd: '2021-11-16',
    active: true,
    priority: 71,
    datePublished: '2020-11-25',
    title: 'Tip: Download de 020werkt-app',
    chapter: Chapters.INKOMEN,
    profileTypes: ['private', 'commercial'],
    description:
      'Via de 020werkt-app krijgt u informatie  over werk, inkomen en meedoen in de wijk. De app is gratis, anoniem en makkelijk in gebruik.',
    predicates: [or([hasValidStadspasRequest, hasTozo, hasBijstandsuitkering])],
    reason: 'U ziet deze tip omdat u TOZO, stadspas of bijstandsuitkering hebt',
    link: {
      title: 'Bekijk het filmpje',
      to: 'https://vimeo.com/436735156',
    },
  },
  {
    id: 'mijn-25',
    owner: '',
    dateActiveStart: '2021-01-01',
    dateActiveEnd: '2021-12-31',
    active: true,
    priority: 71,
    datePublished: '2020-11-26',
    title: 'Tip: Sporten met korting',
    chapter: Chapters.STADSPAS,
    profileTypes: ['private'],
    description:
      'Met de Stadspas krijgt u maximaal € 300 korting op een sportabonnement voor uw kind.',
    predicates: [hasValidStadspasRequest, hasKidsBetweenAges2And18],

    reason:
      'U ziet deze tip omdat u een Stadspas hebt en u een kind tussen de 2 en 18 hebt.',
    link: {
      title: 'Kies een sportvereniging',
      to: 'https://www.amsterdam.nl/svjeugd',
    },
  },
  {
    id: 'mijn-26',
    owner: '',
    dateActiveStart: '2020-11-16',
    dateActiveEnd: '2021-11-16',
    active: true,
    priority: 71,
    datePublished: '2020-12-20',
    title: 'Tip: Hulp bij geldproblemen',
    chapter: Chapters.INKOMEN,
    profileTypes: ['private', 'commercial'],
    description:
      'Is uw inkomen te laag om alle rekeningen te betalen of hebt u schulden? Meld u aan voor gratis hulp',
    predicates: [or([hasValidStadspasRequest, hasTozo, hasBijstandsuitkering])],
    reason: 'U ziet deze tip omdat u TOZO, stadspas of bijstandsuitkering hebt',
    link: {
      title: 'Vind hulp bij u in de buurt',
      to: 'https://www.buurtteamamsterdam.nl/',
    },
  },
  {
    id: 'mijn-27',
    owner: '',
    dateActiveStart: '2023-10-16',
    dateActiveEnd: '2023-11-20',
    active: true,
    priority: 80,
    datePublished: '2023-10-16',
    title: 'Tip: Gratis ID-kaart om te stemmen',
    chapter: Chapters.BRP,
    profileTypes: ['private'],
    description:
      'U hebt een geldige ID-kaart of geldig paspoort nodig om te stemmen. Hebt u een Stadspas met groene stip? Dan kunt u gratis een nieuwe ID-kaart krijgen.',
    predicates: [
      not(hasValidIdForVoting),
      is18OrOlder,
      hasStadspasGroeneStip,
      hasDutchNationality,
    ],
    reason:
      'U ziet deze tip omdat u een Stadspas met groene stip hebt en geen geldige ID-kaart of paspoort',
    link: {
      title: 'Bekijk de voorwaarden',
      to: 'https://www.amsterdam.nl/veelgevraagd/gratis-identiteitskaart-aanvragen-d09a6-kp',
    },
  },
  {
    id: 'mijn-28',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: null,
    active: false,
    priority: 70,
    datePublished: '2021-02-02',
    title: 'Tip: Breng je basis op orde',
    chapter: Chapters.INKOMEN,
    profileTypes: ['private'],
    description:
      'Met Ping Ping weet je precies wat je moet regelen als je 18 wordt, gaat werken, gaat studeren of op jezelf gaat wonen.',
    predicates: [isBetween17and18],
    reason:
      'Je ziet deze tip omdat je net 18 bent geworden of binnenkort 18 wordt',
    link: {
      title: 'Download de app',
      to: 'https://pingping.amsterdam.nl/',
    },
  },
  {
    id: 'mijn-33',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: '2023-12-31',
    active: true,
    priority: 10,
    datePublished: '2023-10-15',
    title: 'Tip: Particuliere vakantieverhuur',
    chapter: Chapters.TOERISTISCHE_VERHUUR,
    profileTypes: ['private'],
    description:
      'Bij vakantieverhuur moet u naast het eenmalige registratienummer ook jaarlijks een vergunning bij de gemeente aanvragen. Ook moet u iedere keer dat u de woning verhuurt dit bij ons melden.',
    predicates: [
      hasToeristicheVerhuurVergunningen,
      not(hasVerhuurRegistrations),
    ],
    reason: 'U ziet deze tip omdat u een vergunning vakantieverhuur hebt',
    link: {
      title: 'U leest hier wat de voorwaarden zijn',
      to: 'https://www.amsterdam.nl/vakantieverhuur',
    },
  },
  {
    id: 'mijn-34',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: '2026-01-07',
    active: true,
    priority: 11,
    datePublished: '2021-06-15',
    title: 'Tip: Overgangsrecht bij Bed and breakfast',
    chapter: Chapters.TOERISTISCHE_VERHUUR,
    profileTypes: ['private'],
    description:
      'Hebt u uw B&B voor 1 januari 2019 aangevraagd? Dan mag u tot 1 juli 2026 verhuren volgens deze regels.',
    predicates: [hasBnBTransitionRight],
    reason:
      'U ziet deze tip omdat u een B&B vergunning aangevraagd heeft voor 2019',
    link: {
      title: 'Lees hier de voorwaarde',
      to: 'https://www.amsterdam.nl/wonen-leefomgeving/wonen/bedandbreakfast/oude-regels/',
    },
  },
  {
    id: 'mijn-35',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: '2022-12-31',
    active: true,
    priority: 11,
    datePublished: '2021-06-15',
    title: 'Tip: Bed & breakfast',
    chapter: Chapters.TOERISTISCHE_VERHUUR,
    profileTypes: ['private'],
    description:
      'Vanaf 1 april 2021 moet u naast een vergunning ook een registratienummer aanvragen voor een bed & breakfast.',
    predicates: [hasBnBVergunning, not(hasVerhuurRegistrations), isMokum],
    reason: 'U ziet deze tip omdat u een vergunning bed & breakfast hebt',
    link: {
      title: 'U leest hier wat de voorwaarden zijn',
      to: 'https://www.amsterdam.nl/bedandbreakfast ',
    },
  },
  {
    id: 'mijn-36',
    owner: '',
    dateActiveStart: '2021-08-01',
    dateActiveEnd: '2021-12-31',
    active: true,
    priority: 11,
    datePublished: '2021-08-01',
    title: 'Tip: Sportvergoeding voor kinderen',
    chapter: Chapters.INKOMEN,
    profileTypes: ['private'],
    description:
      'Hebt u moeite om sportactiviteiten voor uw kind te betalen? Regel de vergoeding via Stichting SINA (Samen is niet alleen).',
    predicates: [not(hasStadspasGroeneStip), isReceivingSubsidy],
    reason: 'u heeft een bijstand, TOZO of TONK en geen Stadspas Groene Stip',
    link: {
      title: 'Vraag direct vergoeding aan',
      to: 'https://www.stichtingsina.nl/sport/',
    },
  },
  {
    id: 'mijn-42',
    owner: '',
    dateActiveStart: '2023-07-22',
    dateActiveEnd: '2023-11-30',
    active: true,
    priority: 81,
    datePublished: '2023-07-28',
    title: 'Tip: Gratis openbaar vervoer voor kinderen',
    predicates: [hasKidsBetweenAges4And11, isMokum],
    profileTypes: ['private'],
    isNotification: true,
    chapter: Chapters.INKOMEN,
    description:
      'Kinderen van 4 tot en met 11 jaar kunnen van 22 juli tot en met 30 november gratis reizen met het openbaar vervoer in Amsterdam. Elk kind heeft een ov-chipkaart nodig.',
    reason:
      'U ziet deze tip omdat u kinderen heeft in de leeftijd van 4 t/m 11 en woonachtig bent in Amsterdam.',
    link: {
      title: 'Hoe vraag je het aan?',
      to: 'https://www.amsterdam.nl/nieuws/nieuwsoverzicht/gratis-ov-kinderen/',
    },
  },
  {
    id: 'mijn-43',
    owner: '',
    dateActiveStart: '2023-11-23',
    dateActiveEnd: null,
    active: true,
    priority: 82,
    datePublished: '2023-11-23',
    title: 'Vraag een gratis ID-kaart aan',
    chapter: Chapters.BRP,
    profileTypes: ['private'],
    description:
      'Uw ID-kaart en/of paspoort zijn niet meer geldig. Met de stadspas groene stip krijgt u gratis een nieuwe ID-kaart.',
    predicates: [
      not(hasValidId),
      is18OrOlder,
      hasStadspasGroeneStip,
      hasDutchNationality,
    ],
    reason:
      'U ziet deze tip omdat u een Stadspas met groene stip hebt en geen geldige ID-kaart of paspoort',
    link: {
      title: 'Bekijk de voorwaarden',
      to: 'https://www.amsterdam.nl/veelgevraagd/gratis-identiteitskaart-aanvragen-d09a6-kp',
    },
  },
  {
    id: 'mijn-44',
    owner: '',
    dateActiveStart: '2024-01-01',
    dateActiveEnd: '2024-12-31',
    active: true,
    priority: 1,
    datePublished: '2024-04-04',
    title: 'Overgangsregeling: achternaam van kind kiezen',
    chapter: Chapters.BRP,
    profileTypes: ['private'],
    description:
      'Op 1 januari 2024 is de wet Gecombineerde achternaam ingegaan. In 2024 is hiervoor een overgangsregeling. Dit betekent dat u als ouders de achternaam van uw kinderen kunt wijzigen naar een combinatie van allebei uw achternamen.',
    predicates: [hasOldestKidBornFrom2016, isMarriedOrLivingTogether],
    reason:
      'U ziet deze tip omdat uw oudste kind geboren is tussen 1 januari 2016 - 31 december 2023 en u gehuwd bent of een geregisterd partnerschap hebt.',
    link: {
      title: 'Hoe vraagt u het aan?',
      to: 'https://www.amsterdam.nl/veelgevraagd/achternaam-van-kind-kiezen-2f07e',
    },
  },
];
