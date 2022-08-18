import {
  hasAOV,
  hasBijstandsuitkering,
  hasBnBTransitionRight,
  hasBnBVergunning,
  hasDutchNationality,
  hasKidsBetweenAges2And18,
  hasStadspasGroeneStip,
  hasToeristicheVerhuurVergunningen,
  hasTozo,
  hasValidId,
  hasValidStadspasRequest,
  hasVerhuurRegistrations,
  is18OrOlder,
  isBetween17and18,
  isLivingInAmsterdamLessThanNumberOfDays,
  isMokum,
  isReceivingSubsidy,
  not,
  or,
  previouslyLivingInAmsterdam,
} from './predicates';
import { Tip } from './tip-types';

export const tips: Tip[] = [
  {
    id: 'mijn-2',
    active: true,
    dateActiveStart: null,
    dateActiveEnd: null,
    priority: 20,
    datePublished: '2019-07-24',
    title: 'Vrijwilliger worden?',
    audience: ['persoonlijk'],
    description:
      'Er is altijd vrijwilligerswerk dat bij u past. Bekijk de vacatures.',
    link: {
      title: 'Vrijwilligerscentrale Amsterdam',
      to: 'https://www.vca.nu/vacaturebank/',
    },
    imgUrl: '/tips/static/tip_images/vrijwilliger.jpg',
    isPersonalized: false,
  },
  {
    id: 'mijn-3',
    active: true,
    dateActiveStart: null,
    dateActiveEnd: null,
    priority: 25,
    datePublished: '2019-07-24',
    title: 'Grofvuil',
    audience: ['persoonlijk'],
    description:
      'Op een Afvalpunt kunt u uw grofvuil, klein chemisch afval en tweedehands spullen inleveren.',
    link: {
      title: 'Adressen Afvalpunten',
      to: 'https://www.amsterdam.nl/afval/grofvuil/grofvuil-wegbrengen/',
    },
    imgUrl: '/tips/static/tip_images/grofvuil.jpg',
    isPersonalized: false,
  },
  {
    id: 'mijn-4',
    active: true,
    dateActiveStart: null,
    dateActiveEnd: null,
    priority: 20,
    datePublished: '2019-07-24',
    title: 'Geveltuin',
    audience: ['persoonlijk'],
    description:
      'Bekijk hoe u gratis een geveltuin kunt aanvragen bij uw stadsdeel. Of hoe u de geveltuin kunt laten verwijderen.',
    link: {
      title: 'Meer informatie',
      to: 'https://www.amsterdam.nl/wonen-leefomgeving/medebeheer/geveltuin-aanvragen/',
    },
    imgUrl: '/tips/static/tip_images/geveltuin.jpg',
    isPersonalized: false,
  },
  {
    id: 'mijn-10',
    active: true,
    dateActiveStart: null,
    dateActiveEnd: null,
    priority: 70,
    datePublished: '2019-08-18',
    title: 'Bekijk de afvalpunten in de buurt',
    audience: ['persoonlijk'],
    description: 'Kijk waar het dichtstbijzijnde Afvalpunt is.',
    predicates: [isLivingInAmsterdamLessThanNumberOfDays(3)],
    reason: 'U ziet deze tip omdat u net bent verhuisd',
    isPersonalized: true,
    link: {
      title: 'Kijk op de kaart',
      to: '/buurt',
    },
    imgUrl: '/tips/static/tip_images/afvalpunt.jpg',
  },
  {
    id: 'mijn-11',
    active: true,
    dateActiveStart: null,
    dateActiveEnd: null,
    priority: 70,
    datePublished: '2019-10-22',
    title: 'Op stap met uw Stadspas',
    audience: ['persoonlijk'],
    description: 'Haalt u alles uit uw Stadspas?',
    reason: 'U ziet deze tip omdat u een stadspas hebt aangevraagd.',
    predicates: [hasValidStadspasRequest],
    isPersonalized: true,
    link: {
      title: 'Bekijk de aanbiedingen',
      to: 'https://www.amsterdam.nl/toerisme-vrije-tijd/stadspas/',
    },
    imgUrl: '/tips/static/tip_images/stadspas.jpg',
  },
  {
    id: 'mijn-12',
    owner: 'Daniel Nagel',
    dateActiveStart: '2020-04-01',
    dateActiveEnd: null,
    active: true,
    priority: 70,
    datePublished: '2020-06-15',
    title: 'Amsterdammers helpen Amsterdammers',
    audience: ['persoonlijk'],
    description:
      'Maakt u mondkapjes? Of zoekt u manieren om te blijven bewegen? Amsterdammers helpen elkaar tijdens de coronacrisis.',
    isPersonalized: false,
    link: {
      title: 'Vind elkaar',
      to: 'https://wijamsterdam.nl/',
    },
    imgUrl: '/tips/static/tip_images/mondkapjes.jpg',
  },
  {
    id: 'mijn-13',
    dateActiveStart: '2020-05-18',
    dateActiveEnd: '2020-08-18',
    active: true,
    priority: 70,
    datePublished: '2020-06-15',
    title: 'Gratis energieadvies',
    audience: ['persoonlijk'],
    description:
      'Werkt u thuis? Dan neemt uw energieverbruik toe. Wij geven gratis energieadvies aan Verenigingen van Eigenaren.',
    isPersonalized: false,
    link: {
      title: 'Kijk hoe u energie kunt besparen',
      to: 'https://www.amsterdam.nl/wonen-leefomgeving/duurzaam-amsterdam/vve-advies/',
    },
    imgUrl: '/tips/static/tip_images/energieadvies.jpg',
  },
  {
    id: 'mijn-14',
    owner: 'OIS / Chief Science Officer',
    dateActiveStart: '2020-05-26',
    dateActiveEnd: null,
    active: true,
    priority: 70,
    datePublished: '2020-06-15',
    title: 'Voor nieuwsgierige Amsterdammers',
    audience: ['persoonlijk'],
    description:
      'Bent u op zoek naar gegevens of onderzoek over uw stad of buurt? U vindt al deze informatie nu op 1 website.',
    isPersonalized: false,
    link: {
      title: 'Kijk op openresearch.amsterdam',
      to: 'https://openresearch.amsterdam/',
    },
    imgUrl: '/tips/static/tip_images/openresearch.jpg',
  },
  {
    id: 'mijn-16',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: null,
    active: true,
    priority: 70,
    datePublished: '2020-07-03',
    title: 'Welkom in Amsterdam',
    audience: ['persoonlijk'],
    description:
      'U bent net in Amsterdam komen wonen, welkom! Blijf op de hoogte van het nieuws in uw stadsdeel.',
    predicates: [
      isLivingInAmsterdamLessThanNumberOfDays(6),
      not(previouslyLivingInAmsterdam),
    ],
    reason: 'U ziet deze tip omdat u net naar Amsterdam bent verhuisd',
    isPersonalized: true,
    link: {
      title: 'Lees meer in deze nieuwsbrief',
      to: 'https://www.amsterdam.nl/nieuwsbrief/',
    },
    imgUrl: '/tips/static/tip_images/nieuwinamsterdam.jpg',
  },
  {
    id: 'mijn-17',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: null,
    active: true,
    priority: 70,
    datePublished: '2020-09-09',
    title: 'Gemeentelijke belastingen voor ondernemers',
    audience: ['zakelijk'],
    description:
      'Als ondernemer moet u belastingen en heffingen betalen. Welke belastingen? Dat hangt af van uw type bedrijf.',
    reason: '',
    isPersonalized: false,
    link: {
      title: 'Kijk wat voor u geldt',
      to: 'https://www.amsterdam.nl/veelgevraagd/?productid=%7B5DDAF0C4-9649-4E15-90DC-23C6E48A0575%7D',
    },
    imgUrl: '/tips/static/tip_images/gemeentelijke belastingen.jpg',
  },
  {
    id: 'mijn-18',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: null,
    active: true,
    priority: 70,
    datePublished: '2020-09-09',
    title: 'Idee voor uw buurt of straat?',
    audience: ['zakelijk'],
    description:
      'Neem dan contact op met een gebiedsmakelaar. Benieuwd wie in uw buurt de gebiedsmakelaar is?',
    reason: '',
    isPersonalized: false,
    link: {
      title: 'Kijk op de kaart',
      to: 'https://www.amsterdam.nl/buurten/',
    },
    imgUrl: '/tips/static/tip_images/Idee voor uw buurt.jpg',
  },
  {
    id: 'mijn-19',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: null,
    active: true,
    priority: 70,
    datePublished: '2020-09-09',
    title: 'Subsidie Bedrijveninvesteringszones (BIZ)',
    audience: ['zakelijk'],
    description:
      'Met dit geld kunt u uw winkelstraat, horecagebied of bedrijventerrein opknappen of veiliger maken.',
    reason: '',
    isPersonalized: false,
    link: {
      title: 'Lees hoe het werkt',
      to: 'https://www.amsterdam.nl/veelgevraagd/?productid=%7B17DE644B-ADB1-4AD3-B04E-40D6736566B3%7D',
    },
    imgUrl: '/tips/static/tip_images/Bedrijveninvesteringszones.jpg',
  },
  {
    id: 'mijn-20',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: null,
    active: true,
    priority: 70,
    datePublished: '2020-09-09',
    title: 'Bedrijfsafval laten ophalen',
    audience: ['zakelijk'],
    description:
      'Hebt u per week meer dan 9 vuilniszakken aan afval? Dan moet u een contract afsluiten met een erkende afvalinzamelaar of de gemeente.',
    reason: '',
    isPersonalized: false,
    link: {
      title: 'Kijk wat de mogelijkheden zijn',
      to: 'https://www.amsterdam.nl/veelgevraagd/?productid=%7B3D70B70E-8A19-4A95-BE31-8743995BC545%7D',
    },
    imgUrl: '/tips/static/tip_images/Bedrijfsafval.jpg',
  },
  {
    id: 'mijn-21',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: null,
    active: true,
    priority: 70,
    datePublished: '2020-09-09',
    title: 'Op zoek naar bedrijfsruimte?',
    audience: ['zakelijk'],
    description:
      'De Stadsloods helpt u bij het vinden van een geschikte ruimte voor uw bedrijf.',
    reason: '',
    isPersonalized: false,
    link: {
      title: 'Meld u aan',
      to: 'https://www.amsterdam.nl/ondernemen/bedrijfsruimte/stadsloods/',
    },
    imgUrl: '/tips/static/tip_images/bedrijfsruimte.jpg',
  },
  {
    id: 'mijn-22',
    owner: 'Alex Willems',
    dateActiveStart: null,
    dateActiveEnd: '2021-10-01',
    active: true,
    priority: 71,
    datePublished: '2020-11-12',
    title: 'Laat geen geld liggen',
    audience: ['persoonlijk'],
    description:
      'Had u als ondernemer in 2020 moeite om rond te komen? Of had u geldproblemen? Misschien zijn deze regelingen dan interessant voor u.',
    predicates: [hasTozo],
    reason: 'U ziet deze tip omdat u een TOZO aanvraag heeft gedaan',
    isPersonalized: true,
    link: {
      title: 'Kijk of u recht hebt',
      to: 'https://www.amsterdam.nl/pakjekans',
    },
    imgUrl: '/tips/static/tip_images/laat_geen_geld_liggen.jpg',
  },
  {
    id: 'mijn-23',
    owner: '',
    dateActiveStart: '2020-11-16',
    dateActiveEnd: '2021-11-16',
    active: true,
    priority: 71,
    datePublished: '2020-11-25',
    title: 'Download de 020werkt-app',
    audience: ['persoonlijk', 'zakelijk'],
    description:
      'Via de 020werkt-app krijgt u informatie  over werk, inkomen en meedoen in de wijk. De app is gratis, anoniem en makkelijk in gebruik.',
    predicates: [or([hasValidStadspasRequest, hasTozo, hasBijstandsuitkering])],
    reason: 'U ziet deze tip omdat u TOZO, stadspas of bijstandsuitkering hebt',
    isPersonalized: true,
    link: {
      title: 'Bekijk het filmpje',
      to: 'https://vimeo.com/436735156',
    },
    imgUrl: '/tips/static/tip_images/020werkt.jpg',
  },
  {
    id: 'mijn-24',
    owner: '',
    dateActiveStart: '2020-11-16',
    dateActiveEnd: null,
    active: true,
    priority: 71,
    datePublished: '2020-11-26',
    title: 'Draag uw mondkapje',
    audience: ['persoonlijk'],
    description:
      'Tijdens corona moet u een mondkapje op als u reist met het aanvullend openbaar vervoer. Hiermee beschermt u uzelf en anderen.',
    predicates: [hasAOV],
    reason: 'U ziet deze tip omdat u een aanvullend openbaar vervoer hebt',
    isPersonalized: true,
    link: {
      title: 'Bekijk de coronamaatregelen van RMC en Transvision',
      to: 'https://www.amsterdam.nl/veelgevraagd/?productid=%7BAC803D4E-BAB4-4865-91EA-88BD00EBD9F2%7D#case_%7B549B25AF-B9C1-47E3-8106-6DE7F5551AB2%7D',
    },
    imgUrl: '/tips/static/tip_images/mondkapje.jpg',
  },
  {
    id: 'mijn-25',
    owner: '',
    dateActiveStart: '2021-01-01',
    dateActiveEnd: '2021-12-31',
    active: true,
    priority: 71,
    datePublished: '2020-11-26',
    title: 'Sporten met korting',
    audience: ['persoonlijk'],
    description:
      'Met de Stadspas krijgt u maximaal € 300 korting op een sportabonnement voor uw kind.',
    predicates: [hasValidStadspasRequest, hasKidsBetweenAges2And18],

    reason:
      'U ziet deze tip omdat u een Stadspas hebt en u een kind tussen de 2 en 18 hebt.',
    isPersonalized: true,
    link: {
      title: 'Kies een sportvereniging',
      to: 'https://www.amsterdam.nl/svjeugd',
    },
    imgUrl: '/tips/static/tip_images/sporten_met_korting.jpg',
  },
  {
    id: 'mijn-26',
    owner: '',
    dateActiveStart: '2020-11-16',
    dateActiveEnd: '2021-11-16',
    active: true,
    priority: 71,
    datePublished: '2020-12-20',
    title: 'Hulp bij geldproblemen',
    audience: ['persoonlijk', 'zakelijk'],
    description:
      'Is uw inkomen te laag om alle rekeningen te betalen of  hebt u schulden? Meld u aan voor gratis hulp',
    predicates: [or([hasValidStadspasRequest, hasTozo, hasBijstandsuitkering])],
    reason: 'U ziet deze tip omdat u TOZO, stadspas of bijstandsuitkering hebt',
    isPersonalized: true,
    link: {
      title: 'Vind hulp bij u in de buurt',
      to: 'https://www.buurtteamamsterdam.nl/',
    },
    imgUrl: '/tips/static/tip_images/schuldhulpverlening.jpg',
  },
  {
    id: 'mijn-27',
    owner: '',
    dateActiveStart: '2021-02-02',
    dateActiveEnd: '2021-03-10',
    active: true,
    priority: 80,
    datePublished: '2021-02-02',
    title: 'Gratis ID-kaart om te stemmen',
    audience: ['persoonlijk'],
    description:
      'U hebt een geldige ID-kaart of geldig paspoort nodig om te stemmen. Hebt u een Stadspas met groene stip? Dan kunt u gratis een nieuwe ID-kaart krijgen.',
    predicates: [
      not(hasValidId),
      is18OrOlder,
      hasStadspasGroeneStip,
      hasDutchNationality,
    ],
    reason:
      'U ziet deze tip omdat u een Stadspas met groene stip hebt en geen geldige ID-kaart of paspoort',
    isPersonalized: true,
    link: {
      title: 'Bekijk de voorwaarden',
      to: 'https://www.amsterdam.nl/veelgevraagd/?caseid=%7B0391171C-BA2E-40D2-8CBE-F013192D09A6%7D',
    },
    imgUrl: '/tips/static/tip_images/stemmen2021.jpg',
  },
  {
    id: 'mijn-28',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: null,
    active: true,
    priority: 70,
    datePublished: '2021-02-02',
    title: 'Breng je basis op orde',
    audience: ['persoonlijk'],
    description:
      'Met Ping Ping weet je precies wat je moet regelen als je 18 wordt, gaat werken, gaat studeren of op jezelf gaat wonen.',
    predicates: [isBetween17and18],
    reason:
      'Je ziet deze tip omdat je net 18 bent geworden of binnenkort 18 wordt',
    isPersonalized: true,
    link: {
      title: 'Download de app',
      to: 'https://pingping.amsterdam.nl/',
    },
    imgUrl: '/tips/static/tip_images/pingping.jpg',
  },
  {
    id: 'mijn-29',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: '2021-02-25',
    active: true,
    priority: 80,
    datePublished: '2021-02-04',
    title: 'Veilig stemmen voor de Tweede Kamer',
    audience: ['persoonlijk'],
    description:
      'We doen er veel aan om te zorgen dat u veilig kunt stemmen op 15, 16 of 17 maart. Vergeet uw mondkapje niet en doe vooraf de gezondheidscheck!',

    reason: '',
    isPersonalized: false,
    link: {
      title: 'Bekijk de coronamaatregelen',
      to: 'https://www.amsterdam.nl/veelgevraagd/?productid=%7B43A9E379-2E1B-463F-BE4D-168BD48C0499%7D#case_%7BC2578879-6863-4240-BC62-296645E60625%7D',
    },
    imgUrl: '/tips/static/tip_images/stem.jpg',
  },
  {
    id: 'mijn-30',
    owner: '',
    dateActiveStart: '2021-02-25',
    dateActiveEnd: '2021-03-10',
    active: true,
    priority: 80,
    datePublished: '2021-02-04',
    title: 'Iemand anders voor u laten stemmen',
    audience: ['persoonlijk'],
    description:
      'Misschien kunt u zelf niet stemmen. Maak dan toch van uw stemrecht gebruik door een andere kiezer te machtigen. De gemachtigde mag voor maximaal 3 andere kiezers stemmen.',

    reason: '',
    isPersonalized: false,
    link: {
      title: 'Kijk hoe u iemand machtigt',
      to: 'https://www.amsterdam.nl/veelgevraagd/?productid=%7b6D786182-CBA3-4319-A794-F915E7DE37C2%7d',
    },
    imgUrl: '/tips/static/tip_images/stem.jpg',
  },
  {
    id: 'mijn-31',
    owner: '',
    dateActiveStart: '2021-03-10',
    dateActiveEnd: '2021-03-17',
    active: true,
    priority: 80,
    datePublished: '2021-03-04',
    title: 'Kom stemmen op 15, 16 of 17 maart',
    audience: ['persoonlijk'],
    description:
      'Bent u ouder dan 60 of hebt u gezondheidsklachten? Kom dan alvast op 15 of 16 maart stemmen bij een van de 50 stembureaus. Op 17 maart zijn er meer dan 450 stembureaus open.',

    reason: '',
    isPersonalized: false,
    link: {
      title: 'Kijk voor een stembureau bij u in de buurt',
      to: 'https://stembureaus.amsterdam.nl/map',
    },
    imgUrl: '/tips/static/tip_images/stem.jpg',
  },
  {
    id: 'mijn-32',
    owner: '',
    dateActiveStart: '2021-03-10',
    dateActiveEnd: '2021-03-17',
    active: true,
    priority: 80,
    datePublished: '2021-03-04',
    title: 'Met de auto stemmen',
    audience: ['persoonlijk'],
    description:
      'Misschien gaat u vanwege corona liever niet naar een stembureau. Ga dan stemmen met de auto. Dat kan in de stemstraat bij de RAI.',

    reason: '',
    isPersonalized: false,
    link: {
      title: 'Bekijk de flyer hoe de stemstraat werkt',
      to: 'https://www.amsterdam.nl/veelgevraagd/?productid=%7B43A9E379-2E1B-463F-BE4D-168BD48C0499%7D#case_%7BC2578879-6863-4240-BC62-296645E60625%7D',
    },
    imgUrl: '/tips/static/tip_images/stem.jpg',
  },
  {
    id: 'mijn-33',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: '2021-12-31',
    active: true,
    priority: 10,
    datePublished: '2021-06-15',
    title: 'Particuliere vakantieverhuur',
    audience: ['persoonlijk'],
    description:
      'Bij vakantieverhuur moet u naast het eenmalige registratienummer ook jaarlijks een vergunning bij de gemeente aanvragen. Ook moet u iedere keer dat u de woning verhuurt dit bij ons melden.',
    predicates: [
      hasToeristicheVerhuurVergunningen,
      not(hasVerhuurRegistrations),
    ],
    reason: 'U ziet deze tip omdat u een vergunning vakantieverhuur hebt',
    isPersonalized: true,
    link: {
      title: 'U leest hier wat de voorwaarden zijn',
      to: 'https://www.amsterdam.nl/vakantieverhuur',
    },
    imgUrl: '/tips/static/tip_images/vakantieverhuur.jpg',
  },
  {
    id: 'mijn-34',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: '2026-01-07',
    active: true,
    priority: 11,
    datePublished: '2021-06-15',
    title: 'Overgangsrecht bij Bed and breakfast',
    audience: ['persoonlijk'],
    description:
      'Hebt u uw B&B voor 1 januari 2019 aangevraagd? Dan mag u tot 1 juli 2026 verhuren volgens deze regels.',
    predicates: [hasBnBTransitionRight],
    reason:
      'U ziet deze tip omdat u een B&B vergunning aangevraagd heeft voor 2019',
    isPersonalized: true,
    link: {
      title: 'Lees hier de voorwaarde',
      to: 'https://www.amsterdam.nl/wonen-leefomgeving/wonen/bedandbreakfast/oude-regels/',
    },
    imgUrl: '/tips/static/tip_images/vakantieverhuur.jpg',
  },
  {
    id: 'mijn-35',
    owner: '',
    dateActiveStart: null,
    dateActiveEnd: '2022-12-31',
    active: true,
    priority: 11,
    datePublished: '2021-06-15',
    title: 'Bed & breakfast',
    audience: ['persoonlijk'],
    description:
      'Vanaf 1 april 2021 moet u naast een vergunning ook een registratienummer aanvragen voor een bed & breakfast.',
    predicates: [hasBnBVergunning, not(hasVerhuurRegistrations), isMokum],
    reason: 'U ziet deze tip omdat u een vergunning bed & breakfast hebt',
    isPersonalized: true,
    link: {
      title: 'U leest hier wat de voorwaarden zijn',
      to: 'https://www.amsterdam.nl/bedandbreakfast ',
    },
    imgUrl: '/tips/static/tip_images/vakantieverhuur.jpg',
  },
  {
    id: 'mijn-36',
    owner: '',
    dateActiveStart: '2021-08-01',
    dateActiveEnd: '2021-12-31',
    active: true,
    priority: 11,
    datePublished: '2021-08-01',
    title: 'Sportvergoeding voor kinderen',
    audience: ['persoonlijk'],
    description:
      'Hebt u moeite om sportactiviteiten voor uw kind te betalen? Regel de vergoeding via Stichting SINA (Samen is niet alleen).',
    predicates: [not(hasStadspasGroeneStip), isReceivingSubsidy],
    reason: 'u heeft een bijstand, TOZO of TONK en geen Stadspas Groene Stip',
    isPersonalized: true,
    link: {
      title: 'Vraag direct vergoeding aan',
      to: 'https://www.stichtingsina.nl/sport/',
    },
    imgUrl: '/tips/static/tip_images/sporten_met_korting.jpg',
  },
  {
    id: 'mijn-37',
    owner: '',
    dateActiveStart: '2022-03-10',
    dateActiveEnd: '2022-03-16',
    active: true,
    priority: 81,
    datePublished: '2022-03-10',
    title: 'Kom stemmen op 14, 15 of 16 maart',
    audience: ['persoonlijk'],
    description:
      'Woensdag 16 maart 2022 kiezen we een nieuwe gemeenteraad. Op dezelfde dag zijn ook de verkiezingen voor de stadsdeelcommissies. Om drukte bij de stembureaus te voorkomen mag u ook op maandag 14 en dinsdag 15 maart stemmen.',
    reason: '',
    isPersonalized: false,
    alwaysVisible: true,
    link: {
      title: 'Kijk voor een stembureau bij u in de buurt',
      to: 'http://www.amsterdam.nl/verkiezingen',
    },
    imgUrl: '/tips/static/tip_images/stem.jpg',
  },
  {
    id: 'mijn-39',
    owner: '',
    dateActiveStart: '2022-02-28',
    dateActiveEnd: '2022-03-16',
    active: true,
    priority: 81,
    datePublished: '2022-02-28',
    title: 'Iemand anders voor u laten stemmen',
    audience: ['persoonlijk'],
    description:
      'Misschien kunt u zelf niet stemmen. Maak dan toch van uw stemrecht gebruik door een andere kiezer te machtigen. Een gemachtigde mag per verkiezing voor maximaal 2 andere mensen stemmen en voor de stadsdeelcommissie moet de gemachtigde in hetzelfde stadsdeel als u wonen.',
    reason: '',
    isPersonalized: false,
    alwaysVisible: true,
    link: {
      title: 'Kijk hoe u iemand machtigt',
      to: 'https://www.amsterdam.nl/veelgevraagd/?productid=%7BA991E320-B926-4DD8-845D-65E51519D304%7D',
    },
    imgUrl: '/tips/static/tip_images/stemmen.jpg',
  },
  {
    id: 'mijn-40',
    owner: '',
    dateActiveStart: '2022-03-03',
    dateActiveEnd: '2022-03-16',
    active: true,
    priority: 81,
    datePublished: '2022-03-03',
    title: 'Verkiezingen komen eraan: op wie kunt u stemmen?',
    audience: ['persoonlijk'],
    description:
      'Op amsterdam.nl/verkiezingen kunt u alle kandidatenlijsten inzien, zodat u weet op welke partijen en kandidaten u op 14, 15 of 16 maart kunt stemmen.',
    reason: '',
    isPersonalized: false,
    alwaysVisible: true,
    link: {
      title: 'Bekijk de kandidatenlijsten',
      to: 'https://www.amsterdam.nl/verkiezingen',
    },
    imgUrl: '/tips/static/tip_images/stemmen.jpg',
  },
  {
    id: 'mijn-41',
    owner: '',
    dateActiveStart: '2022-03-07',
    dateActiveEnd: '2022-03-16',
    active: true,
    priority: 81,
    datePublished: '2022-03-07',
    title: 'Nog zwevend?',
    audience: ['persoonlijk'],
    description:
      'Vul de stemwijzer in en ontdek met welke kandidaat jouw mening het meest overeenkomt.',
    reason: '',
    isPersonalized: false,
    alwaysVisible: true,
    link: {
      title: 'Bekijk de stemwijzer',
      to: 'https://www.amsterdam.nl/verkiezingen',
    },
    imgUrl: '/tips/static/tip_images/stemmen.jpg',
  },
];
