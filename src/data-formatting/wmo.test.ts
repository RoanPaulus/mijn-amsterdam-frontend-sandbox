import { formatWmoApiResponse, WmoApiResponse } from './wmo';

const testData: WmoApiResponse = [
  {
    Omschrijving: 'handbewogen rolstoel',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Medipoint B.V.',
    Checkdatum: null,
    Voorzieningsoortcode: 'ROL',
    Voorzieningcode: '427',
    Aanvraagdatum: '2012-08-08T00:00:00',
    Beschikkingsdatum: '2012-10-05T00:00:00',
    VoorzieningIngangsdatum: '2012-10-05T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2017-06-01T00:00:00',
      Leverancier: 'LA014',
      IngangsdatumGeldigheid: '2012-10-05T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2017-06-01T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'woonruimteaanpassing',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Gebr Koenen B.V.',
    Checkdatum: null,
    Voorzieningsoortcode: 'WRA',
    Voorzieningcode: 'WRA',
    Aanvraagdatum: '2013-04-25T00:00:00',
    Beschikkingsdatum: '2013-05-17T00:00:00',
    VoorzieningIngangsdatum: '2013-05-06T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2013-05-17T00:00:00',
      Leverancier: 'LA0994',
      IngangsdatumGeldigheid: '2013-05-06T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2013-06-17T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'woonruimteaanpassing',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Gebr Koenen B.V.',
    Checkdatum: null,
    Voorzieningsoortcode: 'WRA',
    Voorzieningcode: 'WRA',
    Aanvraagdatum: '2013-11-12T00:00:00',
    Beschikkingsdatum: '2013-12-09T00:00:00',
    VoorzieningIngangsdatum: '2013-12-05T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2013-12-09T00:00:00',
      Leverancier: 'LA0994',
      IngangsdatumGeldigheid: '2013-12-05T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2014-01-28T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'elektrische hulpaandrijving voor rolstoel',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Medipoint B.V.',
    Checkdatum: null,
    Voorzieningsoortcode: 'OVE',
    Voorzieningcode: '545',
    Aanvraagdatum: '2014-07-25T00:00:00',
    Beschikkingsdatum: '2014-09-09T00:00:00',
    VoorzieningIngangsdatum: '2014-09-08T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2017-06-01T00:00:00',
      Leverancier: 'LA014',
      IngangsdatumGeldigheid: '2014-09-08T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2017-06-01T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'woonruimteaanpassing',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Gebr Koenen B.V.',
    Checkdatum: null,
    Voorzieningsoortcode: 'WRA',
    Voorzieningcode: 'WRA',
    Aanvraagdatum: '2014-07-25T00:00:00',
    Beschikkingsdatum: '2014-09-11T00:00:00',
    VoorzieningIngangsdatum: '2014-09-08T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2014-09-11T00:00:00',
      Leverancier: 'LA0994',
      IngangsdatumGeldigheid: '2014-09-08T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2014-11-07T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving:
      'douche-/toiletstoel (verrijdbaar/kantelbaar/individueel aangepast)',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Medipoint B.V.',
    Checkdatum: null,
    Voorzieningsoortcode: 'RWD',
    Voorzieningcode: '929',
    Aanvraagdatum: '2012-08-08T00:00:00',
    Beschikkingsdatum: '2012-10-05T00:00:00',
    VoorzieningIngangsdatum: '2012-10-05T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2017-06-01T00:00:00',
      Leverancier: 'LA014',
      IngangsdatumGeldigheid: '2012-10-05T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2017-06-01T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'dagbesteding',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Amstelring',
    Checkdatum: '2019-10-04T00:00:00',
    Voorzieningsoortcode: 'DBS',
    Voorzieningcode: '073',
    Aanvraagdatum: '2017-06-01T00:00:00',
    Beschikkingsdatum: '2017-06-01T00:00:00',
    VoorzieningIngangsdatum: '2017-06-01T00:00:00',
    VoorzieningEinddatum: '2018-03-08T00:00:00',
    Levering: {
      Opdrachtdatum: '2017-06-01T00:00:00',
      Leverancier: 'Z00103',
      IngangsdatumGeldigheid: '2017-06-01T00:00:00',
      EinddatumGeldigheid: '2018-03-08T00:00:00',
      StartdatumLeverancier: '2017-06-01T00:00:00',
      EinddatumLeverancier: '2018-03-08T00:00:00',
    },
  },
  {
    Omschrijving: 'hulp bij het huishouden',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Emile Thuiszorg',
    Checkdatum: '2019-01-25T00:00:00',
    Voorzieningsoortcode: 'WMH',
    Voorzieningcode: '013',
    Aanvraagdatum: '2017-06-01T00:00:00',
    Beschikkingsdatum: '2017-06-01T00:00:00',
    VoorzieningIngangsdatum: '2017-06-01T00:00:00',
    VoorzieningEinddatum: '2018-04-13T00:00:00',
    Levering: {
      Opdrachtdatum: '2017-06-01T00:00:00',
      Leverancier: 'Z00151',
      IngangsdatumGeldigheid: '2017-06-01T00:00:00',
      EinddatumGeldigheid: '2018-04-13T00:00:00',
      StartdatumLeverancier: '2017-06-01T00:00:00',
      EinddatumLeverancier: '2018-04-13T00:00:00',
    },
  },
  {
    Omschrijving: 'ambulante ondersteuning',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Amstelring',
    Checkdatum: '2019-10-04T00:00:00',
    Voorzieningsoortcode: 'AO5',
    Voorzieningcode: '021',
    Aanvraagdatum: '2017-11-24T00:00:00',
    Beschikkingsdatum: '2017-11-24T00:00:00',
    VoorzieningIngangsdatum: '2017-11-24T00:00:00',
    VoorzieningEinddatum: '2018-11-23T00:00:00',
    Levering: {
      Opdrachtdatum: '2017-11-24T00:00:00',
      Leverancier: 'Z00103',
      IngangsdatumGeldigheid: '2017-11-24T00:00:00',
      EinddatumGeldigheid: '2018-11-23T00:00:00',
      StartdatumLeverancier: '2017-11-24T00:00:00',
      EinddatumLeverancier: '2018-11-23T00:00:00',
    },
  },
  {
    Omschrijving: 'dagbesteding',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Amstelring',
    Checkdatum: '2019-10-04T00:00:00',
    Voorzieningsoortcode: 'DBS',
    Voorzieningcode: '073',
    Aanvraagdatum: '2018-03-09T00:00:00',
    Beschikkingsdatum: '2018-04-19T00:00:00',
    VoorzieningIngangsdatum: '2018-03-09T00:00:00',
    VoorzieningEinddatum: '2019-03-08T00:00:00',
    Levering: {
      Opdrachtdatum: '2018-04-19T00:00:00',
      Leverancier: 'Z00103',
      IngangsdatumGeldigheid: '2018-03-09T00:00:00',
      EinddatumGeldigheid: '2019-03-08T00:00:00',
      StartdatumLeverancier: '2018-03-09T00:00:00',
      EinddatumLeverancier: '2019-03-08T00:00:00',
    },
  },
  {
    Omschrijving: 'woonruimteaanpassing',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Welzorg',
    Checkdatum: null,
    Voorzieningsoortcode: 'WRA',
    Voorzieningcode: 'WRA',
    Aanvraagdatum: '2018-10-10T00:00:00',
    Beschikkingsdatum: '2018-12-27T00:00:00',
    VoorzieningIngangsdatum: '2018-10-24T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2019-02-15T13:45:36',
      Leverancier: 'LA0992',
      IngangsdatumGeldigheid: '2018-10-24T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2019-03-25T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'ambulante ondersteuning',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Amstelring',
    Checkdatum: '2019-10-04T00:00:00',
    Voorzieningsoortcode: 'AO5',
    Voorzieningcode: '021',
    Aanvraagdatum: '2018-11-28T00:00:00',
    Beschikkingsdatum: '2018-11-29T00:00:00',
    VoorzieningIngangsdatum: '2018-11-28T00:00:00',
    VoorzieningEinddatum: '2019-03-08T00:00:00',
    Levering: {
      Opdrachtdatum: '2018-11-29T00:00:00',
      Leverancier: 'Z00103',
      IngangsdatumGeldigheid: '2018-11-28T00:00:00',
      EinddatumGeldigheid: '2019-03-08T00:00:00',
      StartdatumLeverancier: '2018-11-28T00:00:00',
      EinddatumLeverancier: '2019-03-08T00:00:00',
    },
  },
  {
    Omschrijving: 'hulp bij het huishouden',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Emile Thuiszorg',
    Checkdatum: '2019-10-04T00:00:00',
    Voorzieningsoortcode: 'WMH',
    Voorzieningcode: '013',
    Aanvraagdatum: '2018-04-14T00:00:00',
    Beschikkingsdatum: '2018-04-25T00:00:00',
    VoorzieningIngangsdatum: '2018-04-14T00:00:00',
    VoorzieningEinddatum: '2019-04-13T00:00:00',
    Levering: {
      Opdrachtdatum: '2018-04-25T00:00:00',
      Leverancier: 'Z00151',
      IngangsdatumGeldigheid: '2018-04-14T00:00:00',
      EinddatumGeldigheid: '2019-04-13T00:00:00',
      StartdatumLeverancier: '2018-04-14T00:00:00',
      EinddatumLeverancier: '2019-04-13T00:00:00',
    },
  },
  {
    Omschrijving: 'ambulante ondersteuning',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Amstelring',
    Checkdatum: '2019-10-04T00:00:00',
    Voorzieningsoortcode: 'AO5',
    Voorzieningcode: '021',
    Aanvraagdatum: '2019-03-09T00:00:00',
    Beschikkingsdatum: '2019-03-11T00:00:00',
    VoorzieningIngangsdatum: '2019-03-09T00:00:00',
    VoorzieningEinddatum: '2020-03-08T00:00:00',
    Levering: {
      Opdrachtdatum: '2019-03-11T00:00:00',
      Leverancier: 'Z00103',
      IngangsdatumGeldigheid: '2019-03-09T00:00:00',
      EinddatumGeldigheid: '2020-03-08T00:00:00',
      StartdatumLeverancier: '2019-03-09T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'dagbesteding',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Amstelring',
    Checkdatum: '2019-10-04T00:00:00',
    Voorzieningsoortcode: 'DBS',
    Voorzieningcode: '073',
    Aanvraagdatum: '2019-03-09T00:00:00',
    Beschikkingsdatum: '2019-03-11T00:00:00',
    VoorzieningIngangsdatum: '2019-03-09T00:00:00',
    VoorzieningEinddatum: '2020-03-08T00:00:00',
    Levering: {
      Opdrachtdatum: '2019-03-11T00:00:00',
      Leverancier: 'Z00103',
      IngangsdatumGeldigheid: '2019-03-09T00:00:00',
      EinddatumGeldigheid: '2020-03-08T00:00:00',
      StartdatumLeverancier: '2019-03-09T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'hulp bij het huishouden',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Emile Thuiszorg',
    Checkdatum: '2019-10-04T00:00:00',
    Voorzieningsoortcode: 'WMH',
    Voorzieningcode: '013',
    Aanvraagdatum: '2019-04-14T00:00:00',
    Beschikkingsdatum: '2019-04-15T00:00:00',
    VoorzieningIngangsdatum: '2019-04-14T00:00:00',
    VoorzieningEinddatum: '2020-03-08T00:00:00',
    Levering: {
      Opdrachtdatum: '2019-04-15T00:00:00',
      Leverancier: 'Z00151',
      IngangsdatumGeldigheid: '2019-04-14T00:00:00',
      EinddatumGeldigheid: '2020-03-08T00:00:00',
      StartdatumLeverancier: '2019-04-14T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'Kamer tot kamer vervoer',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Transvision',
    Checkdatum: null,
    Voorzieningsoortcode: 'AOV',
    Voorzieningcode: '740',
    Aanvraagdatum: '2012-08-07T00:00:00',
    Beschikkingsdatum: '2012-08-07T00:00:00',
    VoorzieningIngangsdatum: '2012-08-07T00:00:00',
    VoorzieningEinddatum: null,
    Levering: null,
  },
  {
    Omschrijving: 'kinderspeelvoertuig',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Welzorg',
    Checkdatum: null,
    Voorzieningsoortcode: 'OVE',
    Voorzieningcode: '310',
    Aanvraagdatum: '2013-01-17T00:00:00',
    Beschikkingsdatum: '2013-05-13T00:00:00',
    VoorzieningIngangsdatum: '2013-03-14T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2017-06-22T00:00:00',
      Leverancier: 'LH0015',
      IngangsdatumGeldigheid: '2013-03-14T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2017-06-02T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'ambulante ondersteuning',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Leger des Heils',
    Checkdatum: '2019-10-09T00:00:00',
    Voorzieningsoortcode: 'AO5',
    Voorzieningcode: '021',
    Aanvraagdatum: '2018-11-20T00:00:00',
    Beschikkingsdatum: '2018-11-22T00:00:00',
    VoorzieningIngangsdatum: '2018-11-20T00:00:00',
    VoorzieningEinddatum: '2019-11-20T00:00:00',
    Levering: {
      Opdrachtdatum: '2018-11-22T00:00:00',
      Leverancier: 'Z00118',
      IngangsdatumGeldigheid: '2018-11-20T00:00:00',
      EinddatumGeldigheid: '2019-11-20T00:00:00',
      StartdatumLeverancier: '2018-11-20T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'Deur tot deur Plus vervoer',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Transvision',
    Checkdatum: null,
    Voorzieningsoortcode: 'AOV',
    Voorzieningcode: '730',
    Aanvraagdatum: '2016-04-08T00:00:00',
    Beschikkingsdatum: '2016-04-15T00:00:00',
    VoorzieningIngangsdatum: '2016-04-14T00:00:00',
    VoorzieningEinddatum: null,
    Levering: null,
  },
  {
    Omschrijving: 'ambulante ondersteuning',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Stichting Forsa Amsterdam',
    Checkdatum: '2019-10-08T00:00:00',
    Voorzieningsoortcode: 'AO5',
    Voorzieningcode: '021',
    Aanvraagdatum: '2018-01-01T00:00:00',
    Beschikkingsdatum: '2018-08-13T00:00:00',
    VoorzieningIngangsdatum: '2018-01-01T00:00:00',
    VoorzieningEinddatum: '2018-12-30T00:00:00',
    Levering: {
      Opdrachtdatum: '2018-08-13T00:00:00',
      Leverancier: 'Z00181',
      IngangsdatumGeldigheid: '2018-01-01T00:00:00',
      EinddatumGeldigheid: '2018-12-30T00:00:00',
      StartdatumLeverancier: '2018-01-01T00:00:00',
      EinddatumLeverancier: '2018-12-30T00:00:00',
    },
  },
  {
    Omschrijving: 'ambulante ondersteuning',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Familysupporters/Forsa',
    Checkdatum: '2019-11-19T00:00:00',
    Voorzieningsoortcode: 'AO5',
    Voorzieningcode: '021',
    Aanvraagdatum: '2018-12-31T00:00:00',
    Beschikkingsdatum: '2019-01-31T00:00:00',
    VoorzieningIngangsdatum: '2018-12-31T00:00:00',
    VoorzieningEinddatum: '2018-12-31T00:00:00',
    Levering: {
      Opdrachtdatum: '2019-01-31T00:00:00',
      Leverancier: 'Z00216',
      IngangsdatumGeldigheid: '2018-12-31T00:00:00',
      EinddatumGeldigheid: '2018-12-31T00:00:00',
      StartdatumLeverancier: '2018-12-31T00:00:00',
      EinddatumLeverancier: '2018-12-31T00:00:00',
    },
  },
  {
    Omschrijving: 'ambulante ondersteuning',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Familysupporters/Forsa',
    Checkdatum: '2019-11-19T00:00:00',
    Voorzieningsoortcode: 'AO5',
    Voorzieningcode: '021',
    Aanvraagdatum: '2019-01-01T00:00:00',
    Beschikkingsdatum: '2019-01-31T00:00:00',
    VoorzieningIngangsdatum: '2019-01-01T00:00:00',
    VoorzieningEinddatum: '2019-12-31T00:00:00',
    Levering: {
      Opdrachtdatum: '2019-01-31T00:00:00',
      Leverancier: 'Z00216',
      IngangsdatumGeldigheid: '2019-01-01T00:00:00',
      EinddatumGeldigheid: '2019-12-31T00:00:00',
      StartdatumLeverancier: '2019-01-01T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'scootmobiel voor buitengebruik',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Medipoint B.V.',
    Checkdatum: null,
    Voorzieningsoortcode: 'SCO',
    Voorzieningcode: '136',
    Aanvraagdatum: '2005-03-08T00:00:00',
    Beschikkingsdatum: '2005-03-21T00:00:00',
    VoorzieningIngangsdatum: '2014-12-29T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2017-06-01T00:00:00',
      Leverancier: 'LA014',
      IngangsdatumGeldigheid: '2014-12-29T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2017-06-01T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'woonruimteaanpassing',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Ergomedi Bouw B.V.',
    Checkdatum: null,
    Voorzieningsoortcode: 'WRA',
    Voorzieningcode: 'WRA',
    Aanvraagdatum: '2014-12-23T00:00:00',
    Beschikkingsdatum: '2015-06-23T00:00:00',
    VoorzieningIngangsdatum: '2015-02-19T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2015-06-23T00:00:00',
      Leverancier: 'LA0995',
      IngangsdatumGeldigheid: '2015-02-19T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2015-09-08T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'dagbesteding',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Cordaan',
    Checkdatum: '2020-01-30T00:00:00',
    Voorzieningsoortcode: 'DBS',
    Voorzieningcode: '073',
    Aanvraagdatum: '2017-06-01T00:00:00',
    Beschikkingsdatum: '2017-06-01T00:00:00',
    VoorzieningIngangsdatum: '2017-06-01T00:00:00',
    VoorzieningEinddatum: '2018-05-01T00:00:00',
    Levering: {
      Opdrachtdatum: '2017-06-01T00:00:00',
      Leverancier: 'Z00110',
      IngangsdatumGeldigheid: '2017-06-01T00:00:00',
      EinddatumGeldigheid: '2018-05-01T00:00:00',
      StartdatumLeverancier: '2017-06-01T00:00:00',
      EinddatumLeverancier: '2018-05-01T00:00:00',
    },
  },
  {
    Omschrijving: 'handbewogen rolstoel voor semi-permanent gebruik',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Medipoint B.V.',
    Checkdatum: null,
    Voorzieningsoortcode: 'ROL',
    Voorzieningcode: '426',
    Aanvraagdatum: '2018-07-16T00:00:00',
    Beschikkingsdatum: '2018-09-17T00:00:00',
    VoorzieningIngangsdatum: '2018-09-07T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2019-06-24T07:25:14',
      Leverancier: 'LA014',
      IngangsdatumGeldigheid: '2019-05-23T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2019-05-23T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'dagbesteding',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Vivium Zorggroep',
    Checkdatum: '2019-03-19T00:00:00',
    Voorzieningsoortcode: 'DBS',
    Voorzieningcode: '073',
    Aanvraagdatum: '2018-07-06T00:00:00',
    Beschikkingsdatum: '2018-08-20T00:00:00',
    VoorzieningIngangsdatum: '2018-07-06T00:00:00',
    VoorzieningEinddatum: '2019-01-01T00:00:00',
    Levering: {
      Opdrachtdatum: '2018-08-20T00:00:00',
      Leverancier: 'Z00158',
      IngangsdatumGeldigheid: '2018-07-06T00:00:00',
      EinddatumGeldigheid: '2019-01-01T00:00:00',
      StartdatumLeverancier: '2018-07-06T00:00:00',
      EinddatumLeverancier: '2019-01-01T00:00:00',
    },
  },
  {
    Omschrijving: 'woonruimteaanpassing',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Welzorg',
    Checkdatum: null,
    Voorzieningsoortcode: 'WRA',
    Voorzieningcode: 'WRA',
    Aanvraagdatum: '2018-03-29T00:00:00',
    Beschikkingsdatum: '2018-05-09T00:00:00',
    VoorzieningIngangsdatum: '2018-04-20T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2018-07-12T10:33:59',
      Leverancier: 'LA0992',
      IngangsdatumGeldigheid: '2018-04-20T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2018-08-20T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'woonruimteaanpassing',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Welzorg',
    Checkdatum: null,
    Voorzieningsoortcode: 'WRA',
    Voorzieningcode: 'WRA',
    Aanvraagdatum: '2018-07-02T00:00:00',
    Beschikkingsdatum: '2018-07-20T00:00:00',
    VoorzieningIngangsdatum: '2018-07-17T00:00:00',
    VoorzieningEinddatum: null,
    Levering: {
      Opdrachtdatum: '2018-07-23T13:31:36',
      Leverancier: 'LA0992',
      IngangsdatumGeldigheid: '2018-07-17T00:00:00',
      EinddatumGeldigheid: null,
      StartdatumLeverancier: '2018-10-08T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'dagbesteding',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: 'Amstelring',
    Checkdatum: '2020-01-30T00:00:00',
    Voorzieningsoortcode: 'DBS',
    Voorzieningcode: '073',
    Aanvraagdatum: '2019-03-13T00:00:00',
    Beschikkingsdatum: '2019-03-14T00:00:00',
    VoorzieningIngangsdatum: '2019-03-13T00:00:00',
    VoorzieningEinddatum: '2020-03-12T00:00:00',
    Levering: {
      Opdrachtdatum: '2019-03-14T00:00:00',
      Leverancier: 'Z00103',
      IngangsdatumGeldigheid: '2019-03-13T00:00:00',
      EinddatumGeldigheid: '2020-03-12T00:00:00',
      StartdatumLeverancier: '2019-03-13T00:00:00',
      EinddatumLeverancier: null,
    },
  },
  {
    Omschrijving: 'Deur tot deur Plus vervoer',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Transvision',
    Checkdatum: null,
    Voorzieningsoortcode: 'AOV',
    Voorzieningcode: '730',
    Aanvraagdatum: '2017-10-19T00:00:00',
    Beschikkingsdatum: '2017-11-25T00:00:00',
    VoorzieningIngangsdatum: '2017-11-24T00:00:00',
    VoorzieningEinddatum: '2018-02-26T00:00:00',
    Levering: null,
  },
  {
    Omschrijving: 'Deur tot deur Plus vervoer',
    Wet: 1,
    Actueel: true,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 6,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per beschikking',
    Leverancier: 'Transvision',
    Checkdatum: null,
    Voorzieningsoortcode: 'AOV',
    Voorzieningcode: '730',
    Aanvraagdatum: '2018-01-25T00:00:00',
    Beschikkingsdatum: '2018-04-06T00:00:00',
    VoorzieningIngangsdatum: '2018-02-27T00:00:00',
    VoorzieningEinddatum: null,
    Levering: null,
  },
  {
    Omschrijving: 'ambulante ondersteuning',
    Wet: 1,
    Actueel: false,
    Volume: 1,
    Eenheid: '82',
    Frequentie: 3,
    Leveringsvorm: 'ZIN',
    Omvang: '1 stuks per vier weken',
    Leverancier: '2Learn B.V.',
    Checkdatum: '2019-01-10T00:00:00',
    Voorzieningsoortcode: 'AO5',
    Voorzieningcode: '021',
    Aanvraagdatum: '2018-02-21T00:00:00',
    Beschikkingsdatum: '2018-03-22T00:00:00',
    VoorzieningIngangsdatum: '2018-02-21T00:00:00',
    VoorzieningEinddatum: '2019-02-21T00:00:00',
    Levering: {
      Opdrachtdatum: '2018-03-22T00:00:00',
      Leverancier: 'Z00187',
      IngangsdatumGeldigheid: '2018-02-21T00:00:00',
      EinddatumGeldigheid: '2019-02-21T00:00:00',
      StartdatumLeverancier: '2018-02-21T00:00:00',
      EinddatumLeverancier: '2019-02-21T00:00:00',
    },
  },
];

it('Should format WMO data correctly', () => {
  expect(formatWmoApiResponse(testData)).toMatchSnapshot();
});
