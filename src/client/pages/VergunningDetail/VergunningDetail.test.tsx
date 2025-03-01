import { render } from '@testing-library/react';
import { generatePath } from 'react-router-dom';
import { MutableSnapshot } from 'recoil';
import slug from 'slugme';
import { describe, expect, it } from 'vitest';

import { transformVergunningenData } from '../../../server/services/vergunningen/vergunningen';
import { AppRoutes } from '../../../universal/config/routes';
import { appStateAtom } from '../../hooks/useAppState';
import MockApp from '../MockApp';
import VergunningDetail from './VergunningDetail';
import { bffApi } from '../../../testing/utils';

const vergunningenData = {
  content: [
    {
      caseType: 'Parkeerontheffingen Blauwe zone particulieren',
      dateDecision: null,
      dateEnd: null,
      dateRequest: '2022-09-01',
      dateStart: '2022-09-09',
      dateWorkflowActive: '2022-09-01',
      decision: null,
      description: 'Ontheffing Blauwe Zone Bewoner',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABjKYDIOgDQc8saVY2ZLlB6GL7lYkkLmPGiyQQpkrtr_WsCzAaNTNGDJ4lZeOojHKiiJbDY7FIBAQd_xBOpIcb09p0QoPQRUtBLZ3UYBpcIeOnAVUHe6h_PVrLmoXfn7XKbL9yt',
      id: '2191426354',
      identifier: 'Z/22/19795392',
      kenteken: 'GD-33-MV',
      status: 'Ontvangen',
      title: 'Parkeerontheffingen Blauwe zone particulieren',
      processed: false,
    },
    {
      caseType: 'Parkeerontheffingen Blauwe zone particulieren',
      dateDecision: '2022-09-01',
      dateEnd: '2022-09-30',
      dateRequest: '2022-08-31',
      dateStart: '2022-09-01',
      dateWorkflowActive: '2022-08-31',
      decision: 'Verleend',
      description: 'Ontheffing Blauwe Zone Bewoner',
      documentsUrl:
        'https://example.com//decosjoin/listdocuments/gAAAAABjKYDIW5uIPJMbvPENwMiCHvpFMqPWpGFgnJllKUUZrEDsNjSjcsxQ8gUJ5O0Ub9j5XyXot8je3Ao8BLEvPF0W3CpOmtnQYO2uOSChEpabt70mV3C6Pu7LFwlTo-RVEvHB-4r_',
      id: '162761969',
      identifier: 'Z/22/19795384',
      kenteken: 'GE-12-XD | XY-666-Z',
      status: 'Afgehandeld',
      title: 'Parkeerontheffingen Blauwe zone particulieren',
      processed: true,
    },
    {
      caseType: 'Parkeerontheffingen Blauwe zone bedrijven',
      dateDecision: null,
      dateEnd: null,
      dateRequest: '2022-09-01',
      dateStart: '2022-09-09',
      dateWorkflowActive: '2022-09-01',
      decision: null,
      description: 'Ontheffing Blauwe Zone Bedrijven',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABjKYDIOgDQc8saVY2ZLlB6GL7lYkkLmPGiyQQpkrtr_WsCzAaNTNGDJ4lZeOojHKiiJbDY7FIBAQd_xBOpIcb09p0QoPQRUtBLZ3UYBpcIeOnAVUHe6h_PVrLmoXfn7XKbL9yt',
      id: '219142236354',
      identifier: 'Z/22/1979539',
      companyName: 'Bedrijfje van de zaak',
      numberOfPermits: '2',
      status: 'Ontvangen',
      title: 'Parkeerontheffingen Blauwe zone bedrijven',
      processed: false,
    },
    {
      caseType: 'Parkeerontheffingen Blauwe zone bedrijven',
      dateDecision: '2022-09-01',
      dateEnd: '2080-09-30',
      dateRequest: '2022-08-31',
      dateStart: '2022-09-01',
      dateWorkflowActive: '2022-08-31',
      decision: 'Verleend',
      description: 'Ontheffing Blauwe Zone Bedrijven',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABjKYDIW5uIPJMbvPENwMiCHvpFMqPWpGFgnJllKUUZrEDsNjSjcsxQ8gUJ5O0Ub9j5XyXot8je3Ao8BLEvPF0W3CpOmtnQYO2uOSChEpabt70mV3C6Pu7LFwlTo-RVEvHB-4r_',
      id: '162777761969',
      identifier: 'Z/22/1979538',
      companyName: 'Bedrijfje van de zaak',
      numberOfPermits: '44',
      status: 'Afgehandeld',
      title: 'Parkeerontheffingen Blauwe zone bedrijven',
      processed: true,
    },
    {
      caseType: 'Omzettingsvergunning',
      id: 'unique-id-of-zaak',
      title: '(WEESP!!!) Vergunning voor kamerverhuur (omzettingsvergunning)',
      dateDecision: null,
      dateRequest: '2021-03-28',
      decision: null,
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/000/000001',
      location: 'Herengracht 23 1382AG Weesp',
      status: 'Ontvangen',
      description: 'Amstel 1 Omzettingsvergunning voor het een en ander',
      dateWorkflowActive: null,
      processed: false,
    },
    {
      caseType: 'Omzettingsvergunning',
      id: 'unique-id-of-zaak',
      title: 'Vergunning voor kamerverhuur (omzettingsvergunning) (Röel)',
      dateDecision: null,
      dateRequest: '2021-09-28',
      decision: null,
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/no-documents',
      identifier: 'Z/000/000001.b',
      location: 'Burgemeester Röellstraat 1 1064 BH Amsterdam',
      status: 'In behandeling',
      description: 'Amstel 1 Omzettingsvergunning voor het een en ander',
      dateWorkflowActive: '2021-10-08',
      processed: false,
    },
    {
      caseType: 'Omzettingsvergunning',
      id: 'unique-id-of-zaak',
      title: 'Vergunning voor kamerverhuur (omzettingsvergunning)',
      dateDecision: null,
      dateRequest: '2021-09-28',
      decision: null,
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/no-documents',
      identifier: 'Z/000/000001.c',
      location: 'Amstel 1 1017AB Amsterdam',
      status: 'In behandeling',
      description: 'Amstel 1 Omzettingsvergunning voor het een en ander',
      dateWorkflowActive: null,
      processed: false,
    },
    {
      caseType: 'Omzettingsvergunning',
      id: 'unique-id-of-zaak',
      title: 'Vergunning voor kamerverhuur (omzettingsvergunning)',
      dateDecision: '2021-10-18',
      dateRequest: '2021-09-28',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/no-documents',
      identifier: 'Z/000/000001.d',
      location: 'Amstel 1 1017AB Amsterdam',
      status: 'Afgehandeld',
      description: 'Amstel 1 Omzettingsvergunning voor het een en ander',
      dateWorkflowActive: '2021-10-08',
      processed: true,
    },
    {
      caseType: 'Evenement melding',
      id: 'unique-id-of-zaak',
      title: 'Evenement melding',
      dateDecision: '2021-10-17',
      dateRequest: '2021-10-01',
      identifier: 'Z/000/000002',
      location: 'Amstel 1 1011PN Amsterdam',
      status: 'Afgehandeld',
      description: 'Amstel 1 Evenement melding',
      dateStart: '2021-10-13',
      dateEnd: '2021-10-13',
      timeEnd: '11:30',
      timeStart: '08:30',
      eventType: 'Dance evenement',
      activities: 'Dansen en plezier maken',
      visitorCount: '3.000',
      decision: 'Gemeld',
      dateWorkflowActive: '2021-10-01',
      processed: true,
    },
    {
      caseType: 'Evenement melding',
      id: 'unique-id-of-zaak',
      title: 'Evenement melding',
      dateDecision: null,
      dateRequest: '2021-10-17',
      identifier: 'Z/000/000003',
      location: 'Amstel 1 1011PN Amsterdam',
      status: 'Ontvangen',
      description: 'Amstel 1 Evenement melding',
      dateStart: '2021-10-13',
      dateEnd: '2021-10-13',
      timeEnd: '11:00',
      timeStart: '08:00',
      eventType: 'Dance evenement',
      activities: 'Dansen en plezier maken',
      visitorCount: '3.000',
      decision: null,
      dateWorkflowActive: '2021-10-17',
      processed: false,
    },
    {
      caseType: 'Evenement vergunning',
      id: 'unique-id-of-zaak',
      title: 'Evenement vergunning',
      dateDecision: '2021-10-17',
      dateRequest: '2021-10-01',
      identifier: 'Z/111/000002',
      location: 'Amstel 1 1011PN Amsterdam',
      status: 'Afgehandeld',
      description: 'Amstel 1 Evenement vergunning',
      dateStart: '2021-10-13',
      dateEnd: '2021-10-13',
      timeEnd: '11:00',
      timeStart: '08:00',
      decision: 'Verleend',
      dateWorkflowActive: '2021-10-01',
      processed: true,
    },
    {
      caseType: 'Evenement vergunning',
      id: 'unique-id-of-zaak',
      title: 'Evenement vergunning',
      dateDecision: null,
      dateRequest: '2021-10-01',
      identifier: 'Z/111/000003',
      location: 'Amstel 1 1011PN Amsterdam',
      status: 'Ontvangen',
      description: 'Amstel 1 Evenement vergunning',
      dateStart: '2021-10-13',
      dateEnd: '2021-10-13',
      timeEnd: '11:15',
      timeStart: '08:15',
      decision: null,
      dateWorkflowActive: '2021-10-01',
      processed: false,
    },
    {
      caseType: 'Evenement vergunning',
      id: 'unique-id-of-zaak',
      title: 'Evenement vergunning',
      dateDecision: '2021-10-17',
      dateRequest: '2021-10-01',
      identifier: 'Z/111/000004',
      location: 'Amstel 1 1011PN Amsterdam',
      status: 'Afgehandeld',
      description: 'Amstel 1 Evenement vergunning',
      dateStart: '2021-10-13',
      dateEnd: '2021-10-13',
      timeEnd: '11:30',
      timeStart: '08:30',
      decision: null,
      dateWorkflowActive: '2021-10-01',
      processed: false,
    },
    {
      caseType: 'E-RVV - TVM',
      id: 'unique-id-of-zaak',
      title:
        'e-RVV (Gratis verkeersontheffing voor elektrisch goederenvervoer)',
      dateDecision: null,
      dateRequest: '2021-09-03',
      decision: null,
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/000/000003',
      dateStart: '2021-09-26',
      dateEnd: '2022-09-28',
      location: 'Amstel 1 1017AB Amsterdam',
      status: 'Ontvangen',
      timeEnd: '18:00',
      timeStart: '10:00',
      description: 'Amstel 1 E-RVV aanvraag',
      dateWorkflowActive: '2021-09-03',
      processed: false,
    },
    {
      caseType: 'Vakantieverhuur vergunningsaanvraag',
      id: 'unique-id-of-zaak',
      title: 'Vergunning vakantieverhuur',
      dateDecision: null,
      dateRequest: '2020-05-10',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/XXX/000007',
      dateStart: '2020-08-01',
      dateEnd: '2021-09-30',
      location: 'Amstel 1 1017AB Amsterdam',
      status: 'Afgehandeld',
      description: 'Amstel 1 Vakantieverhuur aanvraag vergunning',
      dateWorkflowActive: '2020-05-10',
      processed: true,
    },
    {
      caseType: 'Vakantieverhuur vergunningsaanvraag',
      id: 'unique-id-of-zaak-1',
      title: 'Vergunning vakantieverhuur',
      dateDecision: null,
      dateRequest: '2023-05-10',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/XXX/000018',
      dateStart: '2023-08-01',
      dateEnd: '2024-09-30',
      location: 'Amstel 1 1017AB Amsterdam',
      status: 'Afgehandeld',
      description: 'Amstel 1 Vakantieverhuur aanvraag vergunning',
      dateWorkflowActive: '2023-08-02',
      processed: false,
    },
    {
      caseType: 'Vakantieverhuur vergunningsaanvraag',
      id: 'unique-id-of-zaak-2',
      title: 'Vergunning vakantieverhuur',
      dateDecision: null,
      dateRequest: '2022-05-10',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/XXX/000007',
      dateStart: '2022-08-01',
      dateEnd: '2023-08-22',
      location: 'Amstel 1 1017AB Amsterdam',
      status: 'Afgehandeld',
      description: 'Amstel 1 Vakantieverhuur aanvraag vergunning',
      dateWorkflowActive: '2022-05-10',
      processed: true,
    },
    {
      caseType: 'Vakantieverhuur vergunningsaanvraag',
      id: 'unique-id-of-zaak',
      title: 'Vergunning vakantieverhuur',
      dateDecision: null,
      dateRequest: '2021-05-10',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/000/000040',
      dateStart: '2019-06-01',
      dateEnd: '2020-05-31',
      location: 'Amstel 1 1017AB Amsterdam',
      status: 'Afgehandeld',
      description: 'Amstel 1 Vakantieverhuur aanvraag vergunning',
      dateWorkflowActive: '2021-05-10',
      processed: true,
    },
    {
      caseType: 'Vakantieverhuur vergunningsaanvraag',
      id: 'unique-id-of-zaak',
      title: 'Vergunning vakantieverhuur',
      dateDecision: null,
      dateRequest: '2021-05-10',
      decision: 'Ingetrokken',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/001/000040',
      dateStart: '2020-06-01',
      dateEnd: '2024-05-31',
      location: 'Amstel 1 1017AB Amsterdam',
      status: 'Ingetrokken',
      description: 'Amstel 1 Vakantieverhuur aanvraag vergunning',
      dateWorkflowActive: '2021-05-10',
      processed: true,
    },
    {
      caseType: 'GPK',
      id: 'unique-id-of-zaak',
      title: 'Europese gehandicaptenparkeerkaart (GPK)',
      dateDecision: null,
      dateRequest: '2021-09-03',
      dateEnd: '2021-10-06',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/000/000008',
      cardtype: 'Bestuurder',
      cardNumber: '1234567',
      requestReason: 'Men heeft iets nodig',
      location: 'Amstel 1 1017AB Amsterdam',
      status: 'Ontvangen',
      description: 'Amstel 1 GPK aanvraag',
      dateWorkflowActive: '2021-09-03',
      processed: true,
    },
    {
      caseType: 'GPP',
      id: 'unique-id-of-zaak',
      title: 'Vaste parkeerplaats voor gehandicapten (GPP)',
      dateDecision: null,
      dateRequest: '2021-04-07',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/000/000009',
      kenteken: '12-ghz-2',
      location: 'Amstel 1 1017AB Amsterdam',
      status: 'Ontvangen',
      description: 'Amstel 1 GPP aanvraag',
      dateWorkflowActive: '2021-04-07',
      processed: false,
    },
    {
      caseType: 'Parkeerontheffingen Blauwe zone particulieren',
      id: 'unique-id-of-zaak',
      title: 'Parkeerontheffingen Blauwe zone particulieren',
      dateDecision: '2021-06-02',
      dateStart: '2020-07-02',
      dateRequest: '2020-06-24T00:00:00',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/21/1500000',
      kenteken: 'A0-03-48N',
      status: 'Afgehandeld',
      dateEnd: '2021-07-02',
      dateWorkflowActive: '2020-06-24T00:00:00',
      processed: true,
    },
    {
      caseType: 'Parkeerontheffingen Blauwe zone bedrijven',
      id: 'unique-id-of-zaak',
      title: 'Parkeerontheffingen Blauwe zone bedrijven',
      dateDecision: '2021-06-02',
      dateStart: '2021-07-02',
      dateRequest: '2020-06-24T00:00:00',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/21/1600000',
      companyName: 'Haineken B.V.',
      status: 'Afgehandeld',
      dateEnd: '2022-07-02',
      dateWorkflowActive: '2020-06-24T00:00:00',
      processed: true,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: '2020-07-02',
      dateStart: '2020-07-02',
      dateRequest: '2020-06-24T00:00:00',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BFgweMqwmY9tcEAPAxQWJ9SBWhDTQ7AJiil0gZugQ37PC4I3f2fLEwmClmh59sYy3i4olBXM2uMWNzxrigD01Xuf7vL3DFuVp4c8SK_tj6nLLrf4QyGq1SqNESYjPTW_n',
      identifier: 'Z/20/1597204',
      kenteken: null,
      location: 'Reguliersdwarsstraat 63 1012AA',
      status: 'Afgehandeld',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: 'Slopen',
      dateEnd: '2020-07-02',
      dateWorkflowActive: '2020-06-24T00:00:00',
      processed: true,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: '2020-06-24',
      dateStart: '2021-09-02',
      dateRequest: '2020-06-24T00:00:00',
      decision: 'Ingetrokken',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BiDeLiZclCHUeM8wRTQL6CJwTD7eXL51f6WoMs7EydDB-R8wCFKNXOHAeqpkOsPJOo9ZxkNyKiY12t-v5O6v4w3eDWkv3KX6jVzlog5j3MnfThjZj58Eg2arrp_Ka3RAi',
      identifier: 'Z/20/1597203',
      kenteken: null,
      location: 'Arent Janszoon Ernststraat 780 1012AA',
      status: 'Afgehandeld',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: 'TVM / 3 PV - Arent Janszoon Ernststraat 780',
      dateEnd: '2022-07-02',
      dateWorkflowActive: '2020-06-24T00:00:00',
      processed: true,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: '2020-07-01',
      dateStart: '2020-07-02',
      dateRequest: '2020-06-24T00:00:00',
      decision: 'Niet verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8B4fWrQkMPX107g6Z4ZpDvW5saWPO4TFZVRxnvRNz925dUwzwMUoqk4PR4b9vY46ixhPgPxePH-cPJdPjVgVuq_co3hd8fxnBo8Ujnbqn1gOHo150Hi8jrJQiu5wZZ9s9d',
      identifier: 'Z/20/1597202',
      kenteken: null,
      location: 'Arent Janszoon Ernststraat 779 1012AA',
      status: 'Afgehandeld',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: 'Arent Janszoon Ernststraat 779 1012AA',
      dateEnd: '2020-07-02',
      dateWorkflowActive: '2020-06-24T00:00:00',
      processed: true,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: '2020-07-02',
      dateStart: '2020-07-02',
      dateRequest: '2020-06-24T00:00:00',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8B_A_8N0kRa61AnaFx1ukkOJkS9i9BL3aNqOPE_yiAs_J9GtwMkpKOUZKqg3kosfrmo-Afun2a9zJ3zxfSnS56I6qXWNstP6_T2Q71O104D-S0_E7Noct6AZkqLXod3cAx',
      identifier: 'Z/20/1597199',
      kenteken: null,
      location: 'Arent Janszoon Ernststraat 777 1012AA',
      status: 'Afgehandeld',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: 'TVM / 3 PV - Arent Janszoon Ernststraat 777',
      dateEnd: '2020-07-02',
      dateWorkflowActive: '2020-06-24T00:00:00',
      processed: true,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: null,
      dateStart: '2020-07-02',
      dateRequest: '2020-06-24T00:00:00',
      decision: null,
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BU7XXFMtejAqUADchRf4mU6mk83QMNmDMN8RxeWpfk59BR5Tqhlpu1LuPq8ShlB7WPn_TWrKHiqaJQ2T-iphE4vI7gwuA95zfZm48U-82dnsSDWt5ejakNe_5MY_e6mqk',
      identifier: 'Z/20/1597197',
      kenteken: null,
      location: 'Bloemstraat 5 1012AA',
      status: 'Advies beheer',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: 'Wij gaan verbouwen aan de Bloemstraat 5',
      dateEnd: '2020-07-02',
      dateWorkflowActive: '2020-06-24T00:00:00',
      processed: false,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: null,
      dateStart: '2020-07-02',
      dateRequest: '2020-06-24T00:00:00',
      decision: null,
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BKIvxUYeub2oPpNueyL-1Lr5JdG-L2UPVG7jmPcDhUHyrb20Jjs_A_6UhQmGkh3mKq-WTe8pZae1zLWLvUE6fS2l0p_0Frv9ZbeUpv_1-6P6u8Wr6uDQoKvJdc2X9V4ig',
      identifier: 'Z/20/1597196',
      kenteken: null,
      location: 'Bloemstraat 4 1012AA',
      status: 'In behandeling',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: 'Wij gaan verbouwen aan de Bloemstraat 4',
      dateEnd: '2020-07-02',
      dateWorkflowActive: '2020-06-24T00:00:00',
      processed: false,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: null,
      dateStart: null,
      dateRequest: '2020-06-24T00:00:00',
      decision: null,
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BhtvxVvOW-wWMN9EIaligBEXA8tfdmS4w5loQW0CGBaRc1PYq2UvN1ExiKf6KvDUtMR-RJSCibEwBGe40CQGzecXWnZ6pxxozbKCAHSvykOY80mKh4oTz7C0LOupYS0eD',
      identifier: 'Z/20/1597195',
      kenteken: null,
      location: 'Driemondweg 21 1108AJ Amsterdam',
      status: 'Toewijzen',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: 'Nellestein RVV ontheffing',
      dateEnd: null,
      dateWorkflowActive: '2020-06-24T00:00:00',
      processed: false,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: null,
      dateStart: '2020-07-02',
      dateRequest: '2020-06-24T00:00:00',
      decision: null,
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BuecgJVZzmn4vhcgyf_i5p7FHNmBlNMFkghsSXB5EGR7DSoxRzJrhQsz7aJH5vcZqPp75NkeSoFfnpa_kdEeGmJGD-PlOEwAuMWTnURUsJbVEZqT0FpauMSbXtoQBIuV9',
      identifier: 'Z/20/1597194',
      kenteken: null,
      location: 'Amstel 1 1012AA',
      status: 'Ontvangen',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: 'Wij gaan verbouwen aan de Bloemstraat 2',
      dateEnd: '2020-07-02',
      dateWorkflowActive: '2020-06-24T00:00:00',
      processed: false,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: null,
      dateStart: '2020-07-02',
      dateRequest: '2020-06-24T00:00:00',
      decision: null,
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BWLAyCzcMXN2ka4zd53kLAyOrzH9cDI973pm6FhX-P4YMZOz4prQoB-dmQvnDiI9XGTj1QuJ0Sf9e3EdaQhi0cfWQN12yHPFtCVDI-vzwqYyqyUA3D3oymYAGV4Gj4Ao_',
      identifier: 'Z/20/1597193',
      kenteken: null,
      location: 'Amstel 1 1012AA',
      status: 'Ontvangen',
      timeEnd: '16:00',
      timeStart: '10:00',
      description:
        'Wij gaan verbouwen aan de Bloemstraat 26 h. Wij willen hiervoor graag 2 parkeervakken reserveren om materialen / container op te plaatsen.',
      dateEnd: '2020-07-02',
      dateWorkflowActive: '2020-06-24T00:00:00',
      processed: false,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: '2020-06-25',
      dateStart: '2020-06-25',
      dateRequest: '2020-06-17T00:00:00',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8Bxt50lUmw-jZeIOfylCtPmPKVAIOxxKgRDvhW0Xij-Bu7mYt-NmTQPQOAYZXgXKzc7uS3khLECSDdY1SCXWEWBYplEWxbf5i-X30L35OYysNq2enC6S8_yUllByC6d4Vx',
      identifier: 'Z/20/1595179',
      kenteken: null,
      location: null,
      status: 'Afgehandeld',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: 'SB RVV ontheffing hele stad',
      dateEnd: '2020-06-25',
      dateWorkflowActive: '2020-06-17T00:00:00',
      processed: true,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: null,
      dateStart: '2020-06-16',
      dateRequest: '2020-06-08T00:00:00',
      decision: null,
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BIIOcTuSpya8IJbec2HN4wysWP0TYaSTWrhJFfdhxmjMSOwSSxrftbBrxEBihptB79Qet5fQmIazTsSISGE1u1EH2j8HNTK5lpLgMcDdSM6mMr_bOxSgERrdLq_R5gfJ4',
      identifier: 'Z/20/1592761',
      kenteken: null,
      location: null,
      status: 'Ontvangen',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: 'SB RVV ontheffing hele stad',
      dateEnd: '2020-06-16',
      dateWorkflowActive: '2020-06-08T00:00:00',
      processed: false,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: null,
      dateStart: null,
      dateRequest: '2020-05-03T00:00:00',
      decision: null,
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8Bx6gGMpuZivIQUZcz1H6IJoWFP0j8l201bdqt9XsE-R_Ph0qr3kVGkUM6gPXqPmBFUHQHTy23IrxhYwk1pNuXXt4Cl5uAgonchVXFkFME-A4XBkLVsp0aS01JymCA9pkM',
      identifier: 'Z/20/1592521',
      kenteken: null,
      location: null,
      status: 'Toewijzen',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: '7,5 ton ontheffing',
      dateEnd: null,
      dateWorkflowActive: '2020-05-03T00:00:00',
      processed: false,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: '2019-12-05',
      dateStart: '2019-12-19',
      dateRequest: '2019-12-31T00:00:00',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8ByB3W0mG0jCmrdtu084W7_BnXX1zhJLkFQKNmbQXo6ZvID-WTv-8UkfjCfeaUXiakdwfewSy_EE9eie9uYcjBwgqZgeb_XcC9g2FiHthNcSVTTQO2Eg77-6-8xBmjREkJ',
      identifier: 'Z/20/615500',
      kenteken: 'A00348',
      location: 'Heel Amsterdam',
      status: 'Afgehandeld',
      timeEnd: '16:00',
      timeStart: '10:00',
      description:
        'Bulkaanvraag door Raoul Verheezen t.b.v. Wagenpark (M-AMS1909 004195)',
      dateEnd: '2020-12-31',
      dateWorkflowActive: '2019-12-31T00:00:00',
      processed: true,
    },
    {
      caseType: 'TVM - RVV - Object',
      id: 'unique-id-of-zaak',
      title: 'Tijdelijke verkeersmaatregel',
      dateDecision: '2019-06-21',
      dateStart: '2020-07-02',
      dateRequest: '2019-06-13T00:00:00',
      decision: 'Verleend',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABfOl8BLWvZaJ12J4bVL-VMUrz1kwwMgPoCEV5Mj_MHRB0kkz_3yruaz8cOHvx0m5uSCxossChfjb-aGvS78Uq3vI_Mz_MPv0NIKdy9rL319pbzzCypdrn07wx5vR-bWmX0e1ka',
      identifier: 'Z/20/1597205',
      kenteken: null,
      location: 'Arent Janszoon Ernststraat 888 1012AA',
      status: 'Afgehandeld',
      timeEnd: '16:00',
      timeStart: '10:00',
      description: 'TVM / 3 PV - Arent Janszoon Ernststraat 888',
      dateEnd: '2020-07-02',
      dateWorkflowActive: '2019-06-13T00:00:00',
      processed: true,
    },
    {
      caseType: 'Flyeren-Sampling',
      id: 'unique-id-of-zaak',
      title: 'Verspreiden reclamemateriaal (sampling)',
      identifier: 'Z/22/1597501',
      dateRequest: '2022-07-13T00:00:00',
      dateDecision: '2022-07-31T00:00:00',
      location: 'Gustav Mahlerlaan 10 1082 PP Amsterdam',
      dateStart: '2022-09-01T00:00:00',
      dateEnd: '2022-09-05T00:00:00',
      timeStart: '10:00',
      timeEnd: '17:00',
      status: 'Afgehandeld',
      decision: 'Verleend',
      dateWorkflowActive: '2022-07-13T00:00:00',
      processed: true,
    },
    {
      caseType: 'Flyeren-Sampling',
      id: 'unique-id-of-zaak',
      title: 'Verspreiden reclamemateriaal (sampling)',
      identifier: 'Z/22/1597501',
      dateRequest: '2022-08-08T00:00:00',
      location: 'Gustav Mahlerlaan 10 1082 PP Amsterdam',
      dateStart: '2022-10-01T00:00:00',
      dateEnd: '2022-10-05T00:00:00',
      timeStart: '11:00',
      timeEnd: '16:00',
      status: 'Ontvangen',
      decision: 'Verleend',
      dateWorkflowActive: '2022-08-08T00:00:00',
      processed: true,
    },
    {
      caseType: 'Flyeren-Sampling',
      id: 'unique-id-of-zaak',
      title: 'Verspreiden reclamemateriaal (sampling)',
      identifier: 'Z/22/1597502',
      dateRequest: '2022-08-09T00:00:00',
      location: 'Gustav Mahlerlaan 10 1082 PP Amsterdam',
      dateStart: '2022-09-05T00:00:00',
      dateEnd: null,
      timeStart: '11:00',
      timeEnd: '17:00',
      status: 'Ontvangen',
      decision: 'Verleend',
      dateWorkflowActive: '2022-08-08T00:00:00',
      processed: true,
    },
    {
      caseType: 'Flyeren-Sampling',
      dateDecision: null,
      dateEnd: null,
      dateRequest: '2022-07-29',
      dateStart: '2022-08-05',
      dateWorkflowActive: '2022-07-29',
      decision: 'Ingetrokken',
      description: 'Flyeren',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABi_zeO4a-nizqypkMoIzQ1pSLyeLUMK6zuHCLmvNuf6eiA1fo4jHhmqXruqiOr3h1USFONE6c9NNKMmEM_M-SH4QkdKg4a5msw2pUlRMtFqajhFi2N4jiJMpWJ--CWUeDYU2iI',
      id: '1580959320',
      identifier: 'Z/22/1978055',
      location: 'Solebaystraat 20',
      status: 'Ontvangen',
      timeEnd: '21:00',
      timeStart: '09:00',
      title: 'Verspreiden reclamemateriaal (sampling)',
      link: {
        to: '/vergunningen/flyeren-sampling/1580959320',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
      processed: true,
    },
    {
      caseType: 'Aanbieden van diensten',
      id: 'unique-id-of-zaak',
      title: 'Aanbieden van diensten',
      identifier: 'Z/22/1597602',
      dateRequest: '2022-01-17T00:00:00',
      dateDecision: '2022-02-08T00:00:00',
      location: 'Gustav Mahlerlaan 7 1082 PP Amsterdam',
      dateStart: '2022-04-01T00:00:00',
      dateEnd: '2022-04-05T00:00:00',
      status: 'Afgehandeld',
      decision: 'Verleend',
      dateWorkflowActive: '2022-01-13T00:00:00',
      processed: true,
    },
    {
      caseType: 'Aanbieden van diensten',
      id: 'unique-id-of-zaak',
      title: 'Aanbieden van diensten',
      identifier: 'Z/22/1597471',
      dateRequest: '2022-02-07T00:00:00',
      dateDecision: '2022-02-08T00:00:00',
      location: 'Gustav Mahlerlaan 7 1082 PP Amsterdam',
      dateStart: '2022-06-01T00:00:00',
      dateEnd: '2022-06-01T00:00:00',
      status: 'Afgehandeld',
      decision: 'Verleend',
      dateWorkflowActive: '2022-02-07T00:00:00',
      processed: true,
    },
    {
      caseType: 'Aanbieden van diensten',
      id: 'unique-id-of-zaak',
      title: 'Aanbieden van diensten',
      identifier: 'Z/22/1597712',
      dateRequest: '2022-01-17T00:00:00',
      dateDecision: '2022-02-08T00:00:00',
      status: 'Ontvangen',
      dateWorkflowActive: '2022-01-13T00:00:00',
      processed: false,
    },
    {
      caseType: 'Nachtwerkontheffing',
      id: 'unique-id-of-zaak',
      title:
        'Geluidsontheffing werken in de openbare ruimte (nachtwerkontheffing)',
      identifier: 'Z/22/1691001',
      dateRequest: '2022-07-13T00:00:00',
      dateDecision: '2022-09-15T00:00:00',
      location: 'Gustav Mahlerlaan 10 1082 PP Amsterdam',
      dateStart: '2022-10-01',
      dateEnd: '2022-10-05',
      timeStart: '10:15',
      timeEnd: '18:35',
      status: 'Afgehandeld',
      decision: 'Verleend',
      dateWorkflowActive: '2022-07-13T00:00:00',
      processed: true,
    },
    {
      caseType: 'Nachtwerkontheffing',
      id: 'unique-id-of-zaak',
      title:
        'Geluidsontheffing werken in de openbare ruimte (nachtwerkontheffing)',
      identifier: 'Z/22/1691001',
      dateRequest: '2022-09-16T00:00:00',
      dateDecision: null,
      location: 'Gustav Mahlerlaan 10 1082 PP Amsterdam',
      dateStart: '2022-10-15',
      dateEnd: '2022-10-25',
      timeStart: '22:10',
      timeEnd: '05:35',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: '2022-09-16T00:00:00',
      processed: false,
    },
    {
      caseType: 'Zwaar verkeer',
      id: 'unique-id-of-zaak',
      title: 'Ontheffing zwaar verkeer',
      identifier: 'Z/22/1692002',
      dateRequest: '2022-10-16T00:00:00',
      dateDecision: null,
      dateStart: '2022-11-15',
      dateEnd: '2023-11-25',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: null,
      exemptionKind:
        'Jaarontheffing hele zone met gewichtsverklaring en verklaring ondeelbare lading',
      licensePlates: 'XX-123-Z, XX-122-Z',
      processed: false,
    },
    {
      caseType: 'Zwaar verkeer',
      id: 'unique-id-of-zaak',
      title: 'Ontheffing zwaar verkeer',
      identifier: 'Z/22/1692013',
      dateRequest: '2022-10-19T00:00:00',
      dateDecision: null,
      dateStart: '2023-01-15',
      dateEnd: '2023-12-15',
      status: 'In behandeling',
      decision: null,
      dateWorkflowActive: '2022-10-21',
      exemptionKind: 'Routeontheffing breed opgezette wegen tot en met 30 ton',
      licensePlates:
        'EE-123-C, DD-122-X, EE-123-C, DD-122-X, EE-123-C, DD-122-X, EE-123-C, DD-122-X, EE-123-C, DD-122-X, EE-123-C, DD-122-X',
      processed: false,
    },
    {
      caseType: 'Splitsingsvergunning',
      id: 'unique-id-of-zaak',
      title: 'Splitsingsvergunning',
      identifier: 'Z/22/1697573',
      dateRequest: '2022-11-01T00:00:00',
      dateDecision: null,
      location: 'Gustav Mahlerlaan 7 1082 PP Amsterdam',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: '2022-11-01T00:00:00',
      processed: false,
    },
    {
      caseType: 'Woningvormingsvergunning',
      id: 'unique-id-of-zaak',
      title: 'Vormen van Woonruimte',
      identifier: 'Z/22/1697574',
      dateRequest: '2022-10-27T00:00:00',
      dateDecision: null,
      location: 'Gustav Mahlerlaan 14 1082 PP Amsterdam',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: '2022-11-01T00:00:00',
      processed: false,
    },
    {
      caseType: 'Onttrekkingsvergunning voor sloop',
      id: 'unique-id-of-zaak',
      title: 'Onttrekkingsvergunning voor sloop',
      identifier: 'Z/22/1797585',
      dateRequest: '2022-11-01T00:00:00',
      dateDecision: null,
      location: 'Gustav Mahlerlaan 14 1082 PP Amsterdam',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: null,
      processed: false,
    },
    {
      caseType: 'Onttrekkingsvergunning',
      id: 'unique-id-of-zaak',
      title: 'Onttrekkingsvergunning voor ander gebruik',
      identifier: 'Z/22/1797707',
      dateRequest: '2022-11-01T00:00:00',
      dateDecision: '2022-11-08T00:00:00',
      location: 'Gustav Mahlerlaan 14 1082 PP Amsterdam',
      status: 'Afgehandeld',
      decision: 'Verleend',
      dateWorkflowActive: '2022-11-07T00:00:00',
      processed: true,
    },
    {
      caseType: 'Samenvoegingsvergunning',
      id: 'unique-id-of-zaak',
      title: 'Samenvoegingsvergunning',
      identifier: 'Z/22/1797696',
      dateRequest: '2022-11-01T00:00:00',
      dateDecision: '2022-11-01T00:00:00',
      location: 'Gustav Mahlerlaan 14 1082 PP Amsterdam',
      status: 'Ontvangen',
      decision: 'Verleend',
      dateWorkflowActive: '2022-11-01T00:00:00',
      processed: false,
    },
    {
      caseType: 'VOB',
      id: 'unique-id-of-zaak',
      title: 'Ligplaatsvergunning',
      identifier: 'Z/23/1797714',
      dateRequest: '2023-01-01T00:00:00',
      dateDecision: '2023-01-02T00:00:00',
      location: 'J.J. Cremerplein 54-1 1054 TM Amsterdam',
      status: 'Ontvangen',
      decision: 'Verleend',
      dateWorkflowActive: '2023-01-01T00:00:00',
      processed: true,
      requestKind: 'Ligplaatsvergunning woonboot',
      reason: 'Nieuwe ligplaats',
      dateEnd: '2025-01-02T00:00:00',
    },
    {
      caseType: 'VOB',
      id: 'unique-id-of-zaak',
      title: 'Ligplaatsvergunning',
      identifier: 'Z/23/1797715',
      dateRequest: '2023-01-03T00:00:00',
      dateDecision: null,
      location: 'J.J. Cremerplein 54-1 1054 TM Amsterdam',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: '2023-01-03T00:00:00',
      processed: false,
      requestKind: 'Ligplaatsvergunning woonboot',
      reason: 'Nieuwe ligplaats',
      vesselKind: 'Sloep',
      vesselName: 'Sloepie IX',
    },
    {
      caseType: 'VOB',
      id: 'unique-id-of-zaak',
      title: 'Ligplaatsvergunning',
      identifier: 'Z/23/1797716',
      dateRequest: '2023-03-09T00:00:00',
      dateDecision: null,
      location: 'J.J. Cremerplein 54-1 1054 TM Amsterdam',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: null,
      processed: false,
      requestKind: 'Ligplaatsvergunning woonboot',
      reason: 'Nieuwe ligplaats',
      vesselKind: 'Sloep',
      vesselName: 'Sloepie XX',
    },
    {
      caseType: 'Horeca vergunning exploitatie Horecabedrijf',
      id: 'unique-id-of-zaak',
      title: 'Horeca vergunning exploitatie Horecabedrijf',
      identifier: 'Z/23/1808826',
      dateRequest: '2022-10-20T00:00:00',
      location: 'J.J. Cremerplein 54-1 1054 TM Amsterdam',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: null,
      processed: false,
      dateStart: '2022-11-01T00:00:00',
      dateEnd: '2024-01-02T00:00:00',
      dateStartPermit: '2022-11-02T00:00:00',
      dateDecision: '2022-11-01T00:00:00',
      numberOfPermits: 10,
    },
    {
      caseType: 'Horeca vergunning exploitatie Horecabedrijf',
      id: 'unique-id-of-zaak',
      title: 'Horeca vergunning exploitatie Horecabedrijf',
      identifier: 'Z/23/1808827',
      dateRequest: '2022-11-20T00:00:00',
      location: 'J.J. Cremerplein 54-1 1054 TM Amsterdam',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: '2022-11-25T00:00:00',
      processed: false,
      dateStart: '2023-11-01T00:00:00',
      dateEnd: '2025-01-02T00:00:00',
      dateStartPermit: '2023-11-02T00:00:00',
      dateDecision: '2022-12-01T00:00:00',
      numberOfPermits: 10,
    },
    {
      caseType: 'Horeca vergunning exploitatie Horecabedrijf',
      id: 'unique-id-of-zaak',
      dateDecision: '2023-04-28',
      dateEnd: '2023-06-21',
      dateRequest: '2023-04-26',
      dateStart: null,
      dateWorkflowActive: '2023-04-27',
      decision: 'Verleend',
      description:
        'Nieuwe aanvraag, alcohol vrij, Het restotje, Berkelstraat  1',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABkWjUO7A9AhzlW9X40GruHXP-NVljBzvfRd5xoYu06JeI8_-6iU1x-YbZylG9r1IrOPkcIYboFSaN44tZ-frbPjndv-cOVYN18x5uwswBfJsWCYnz1NRrvV22dWHKLR9qAsE6J',
      identifier: 'Z/23/1984708',
      location: 'Berkelstraat 1 1078CT',
      processed: true,
      status: 'Afgehandeld',
      title: 'Horeca vergunning exploitatie Horecabedrijf',
      link: {
        to: '/horeca/horeca-vergunning-exploitatie-horecabedrijf/1234418712',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      caseType: 'RVV - Hele stad',
      id: 'unique-id-of-zaak',
      title: 'RVV-verkeersontheffing',
      identifier: 'Z/23/1809938',
      dateRequest: '2023-04-20T00:00:00',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: '2023-04-25T00:00:00',
      processed: false,
      dateStart: '2023-11-01T00:00:00',
      dateEnd: '2025-01-02T00:00:00',
      dateDecision: null,
      licensePlates: 'YY-123-A, ZZ-122-A',
    },
    {
      caseType: 'RVV Sloterweg',
      id: 'unique-id-of-zaak',
      title: 'RVV ontheffing Sloterweg (Nieuw/Verleend)',
      identifier: 'Z/23/98798273423',
      dateRequest: '2023-07-23T11:21:33',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: null,
      dateWorkflowVerleend: '2023-07-27T00:00:00',
      processed: false,
      dateStart: '2023-08-01T00:00:00',
      dateEnd: '2024-08-01T00:00:00',
      dateDecision: null,
      licensePlates: 'YY-123-A, ZZ-122-A',
      previousLicensePlates: '',
      requestType: 'Nieuw',
      area: 'Vaan van Laanderen',
    },
    {
      caseType: 'RVV Sloterweg',
      id: 'unique-id-of-zaak',
      title: 'RVV ontheffing van Vlaanderenlaan (Wijziging/Ontvangen)',
      identifier: 'Z/23/98989234',
      dateRequest: '2023-09-24T11:21:33',
      status: 'Ontvangen',
      decision: 'Verleend',
      dateWorkflowActive: '2023-09-26T00:00:00',
      dateWorkflowVerleend: '2023-09-28T00:00:00',
      processed: true,
      dateStart: '2023-10-02T00:00:00',
      dateEnd: '2024-10-02T00:00:00',
      dateDecision: null,
      licensePlates: 'AA-899-C',
      previousLicensePlates: 'CC-122-A',
      requestType: 'Wijziging',
      area: 'van Vlaanderenlaan',
    },
    {
      caseType: 'RVV Sloterweg',
      id: 'unique-id-of-zaak',
      title: 'RVV ontheffing van Vlaanderenlaan (Wijziging/Ingetrokken)',
      identifier: 'Z/23/23423409',
      dateRequest: '2023-07-24T11:21:33',
      status: 'Ontvangen',
      decision: 'Ingetrokken',
      dateWorkflowActive: '2023-07-26T00:00:00',
      dateWorkflowVerleend: null,
      processed: true,
      dateStart: '2023-08-02T00:00:00',
      dateEnd: '2024-08-02T00:00:00',
      dateDecision: '2023-07-26T00:00:00',
      licensePlates: 'BB-344-P, VV-899-C',
      previousLicensePlates: 'YY-123-A, ZZ-122-A',
      requestType: 'Wijziging',
      area: 'van Vlaanderenlaan',
    },
    {
      caseType: 'RVV Sloterweg',
      id: 'unique-id-of-zaak',
      title: 'RVV ontheffing Sloterweg (Wijziging/Verleend)',
      identifier: 'Z/23/091823087',
      dateRequest: '2023-07-24T11:21:33',
      status: 'Ontvangen',
      decision: null,
      dateWorkflowActive: '2023-07-26T00:00:00',
      dateWorkflowVerleend: '2023-07-28T00:00:00',
      processed: true,
      dateStart: '2023-08-02T00:00:00',
      dateEnd: '2024-08-02T00:00:00',
      dateDecision: '2023-07-28T00:00:00',
      licensePlates: 'BB-344-E',
      previousLicensePlates: 'ZZ-122-C',
      requestType: 'Wijziging',
      area: 'Sloterweg',
    },
    {
      caseType: 'RVV Sloterweg',
      id: 'unique-id-of-zaak',
      title: 'RVV ontheffing Sloterweg (Wijziging/Verlopen)',
      identifier: 'Z/23/92222273423',
      dateRequest: '2023-07-01T11:21:33',
      status: 'iets?',
      decision: 'Verlopen',
      dateWorkflowActive: '2023-07-02T00:00:00',
      dateWorkflowVerleend: '2023-07-28T00:00:00',
      processed: true,
      dateStart: '2023-07-12T00:00:00',
      dateEnd: '2023-07-22T00:00:00',
      dateDecision: '2023-07-03T00:00:00',
      licensePlates: 'BB-344-Q',
      previousLicensePlates: 'YY-123-B',
      requestType: 'Wijziging',
      area: 'Sloterweg',
    },
    {
      caseType: 'RVV Sloterweg',
      id: 'unique-id-of-zaak',
      title: 'RVV ontheffing Sloterweg (Nieuw/Verlopen)',
      identifier: 'Z/23/98744444423',
      dateRequest: '2023-07-01T11:21:33',
      status: 'iets?',
      decision: 'Verlopen',
      dateWorkflowActive: '2023-07-02T00:00:00',
      dateWorkflowVerleend: '2023-07-02T00:00:00',
      processed: true,
      dateStart: '2023-07-12T00:00:00',
      dateEnd: '2023-07-22T00:00:00',
      dateDecision: '2023-07-03T00:00:00',
      licensePlates: 'ZZ-122-A',
      previousLicensePlates: '',
      requestType: 'Nieuw',
      area: 'Sloterweg',
    },
    {
      caseType: 'RVV Sloterweg',
      id: 'unique-id-of-zaak',
      title: 'RVV ontheffing Laan van Vlaanderen (Nieuw/Ingetrokken)',
      identifier: 'Z/23/123123456',
      dateRequest: '2023-07-01T11:21:33',
      status: 'iets?',
      decision: 'Ingetrokken',
      dateWorkflowActive: '2023-07-02T00:00:00',
      dateWorkflowVerleend: '2023-07-02T00:00:00',
      processed: true,
      dateStart: '2023-07-12T00:00:00',
      dateEnd: '2023-07-22T00:00:00',
      dateDecision: '2023-07-03T00:00:00',
      licensePlates: 'YY-123-A',
      previousLicensePlates: '',
      requestType: 'Nieuw',
      area: 'Laan van Vlaanderen',
    },
    {
      area: 'Sloterweg',
      caseType: 'RVV Sloterweg',
      dateDecision: null,
      dateEnd: '2025-08-31',
      dateRequest: '2023-08-29',
      dateStart: '2023-08-31',
      dateWorkflowActive: null,
      dateWorkflowVerleend: null,
      decision: null,
      description: 'RVV-ontheffing Sloterweg',
      id: '1097314015',
      identifier: 'Z/23/2003529',
      licensePlates: '37BHK4',
      previousLicensePlates: null,
      processed: false,
      requestType: 'Nieuw',
      status: 'Actief',
      title: 'RVV ontheffing Sloterweg (Nieuw / In behandeling)',
      link: {
        to: '/vergunningen/rvv-sloterweg/1097314015',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      area: 'Sloterweg West',
      caseType: 'RVV Sloterweg',
      dateDecision: '2023-09-01',
      dateEnd: '2023-08-31',
      dateRequest: '2023-08-29',
      dateStart: '2023-08-31',
      dateWorkflowActive: null,
      dateWorkflowVerleend: '2023-08-31',
      decision: 'Vervallen',
      description: 'RVV-ontheffing Sloterweg',
      id: '394540596',
      identifier: 'Z/23/2003533',
      licensePlates: 'PR067L',
      previousLicensePlates: null,
      processed: true,
      requestType: 'Nieuw',
      status: 'Afgehandeld',
      title: 'RVV ontheffing Sloterweg West (Nieuw vervallen)',
      link: {
        to: '/vergunningen/rvv-sloterweg/394540596',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      area: 'Sloterweg West',
      caseType: 'RVV Sloterweg',
      dateDecision: '2023-09-01',
      dateEnd: '2024-08-31',
      dateRequest: '2023-08-29',
      dateStart: '2023-08-31',
      dateWorkflowActive: null,
      dateWorkflowVerleend: '2023-08-31',
      decision: 'Vervallen',
      description: 'RVV-ontheffing Sloterweg',
      id: '394540596',
      identifier: 'Z/23/200323232323',
      licensePlates: 'PR067L',
      previousLicensePlates: null,
      processed: true,
      requestType: 'Wijziging',
      status: 'Afgehandeld',
      title: 'RVV ontheffing Sloterweg West (Wijziging vervallen)',
      link: {
        to: '/vergunningen/rvv-sloterweg/394540596',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      area: 'Sloterweg West',
      caseType: 'RVV Sloterweg',
      dateDecision: null,
      dateEnd: '2025-08-31',
      dateRequest: '2023-08-29',
      dateStart: '2023-08-31',
      dateWorkflowActive: null,
      dateWorkflowVerleend: null,
      decision: null,
      description: 'RVV-ontheffing Sloterweg wijzigen',
      id: '1623553971',
      identifier: 'Z/23/2003534',
      licensePlates: 'TT148N',
      previousLicensePlates: 'PR067L',
      processed: false,
      requestType: 'Wijziging',
      status: 'Actief',
      title: 'RVV ontheffing Sloterweg West (Wijziging / ontvangen)',
      link: {
        to: '/vergunningen/rvv-sloterweg/1623553971',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      area: 'Sloterweg West',
      caseType: 'RVV Sloterweg',
      dateDecision: null,
      dateEnd: '2025-08-19',
      dateRequest: '2023-08-17',
      dateStart: '2023-08-19',
      dateWorkflowActive: null,
      dateWorkflowVerleend: null,
      decision: null,
      description: 'RVV-ontheffing Sloterweg',
      id: '4069415615',
      identifier: 'Z/23/2003388',
      licensePlates: '37BHK4',
      previousLicensePlates: null,
      processed: false,
      requestType: 'Nieuw',
      status: 'Ontvangen',
      title: 'RVV ontheffing Sloterweg West (Nieuw in behandeling)',
      link: {
        to: '/vergunningen/rvv-sloterweg/4069415615',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      area: 'Sloterweg West',
      caseType: 'RVV Sloterweg',
      dateDecision: null,
      dateEnd: '2025-08-19',
      dateRequest: '2023-11-17',
      dateStart: '2023-11-19',
      dateWorkflowActive: null,
      dateWorkflowVerleend: null,
      decision: 'Ingetrokken',
      description: 'RVV-ontheffing Sloterweg',
      id: '4069415615',
      identifier: 'Z/23/123123123',
      licensePlates: '1234356',
      previousLicensePlates: null,
      processed: false,
      requestType: 'Kenteken wijziging',
      status: 'Ontvangen',
      title: 'RVV ontheffing Sloterweg West (Wijziging ingetrokken)',
      link: {
        to: '/vergunningen/rvv-sloterweg/4069415615',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      area: 'Sloterweg West',
      caseType: 'RVV Sloterweg',
      dateDecision: null,
      dateEnd: '2025-08-19',
      dateRequest: '2023-11-17',
      dateStart: '2023-11-19',
      dateWorkflowActive: null,
      dateWorkflowVerleend: '2023-11-20',
      decision: 'Ingetrokken',
      description: 'RVV-ontheffing Sloterweg',
      id: '4069415615',
      identifier: 'Z/23/789076676',
      licensePlates: '9998877',
      previousLicensePlates: null,
      processed: false,
      requestType: 'Kenteken wijziging',
      status: 'Ontvangen',
      title: 'RVV ontheffing Sloterweg West (Wijziging Verleend + ingetrokken)',
      link: {
        to: '/vergunningen/rvv-sloterweg/4069415615',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      caseType: 'Eigen parkeerplaats',
      dateDecision: null,
      dateEnd: null,
      dateRequest: '2023-10-10',
      dateStart: null,
      dateWorkflowActive: null,
      decision: null,
      description:
        'Eigen parkeerplaats  - [verloskundige] T. Test - Oudezijds Voorburgwal 233',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABlJVcsXFVhhc_KycTS0mSh43y5oEasj3ysjNOzmwWq0jfizKqPrPeWuQD-FWTnbwXlHhr22kuOpasPd_5p9nVufKorpGCzVtLsYwbb31CVx8deGAiNFqT4rDcK1B1rWHe56lyY',
      id: '1817502388',
      identifier: 'Z/23/2230352',
      isCarsharingpermit: false,
      isExtension: false,
      isLicensePlateChange: false,
      isNewRequest: true,
      isRelocation: false,
      licensePlates: 'PR067L',
      locations: [
        {
          fiscalNumber: '121455487005',
          houseNumber: 233,
          street: 'Oudezijds Voorburgwal',
          type: 'Consul/Huisarts/Verloskundige woonadres',
          url: 'https://data.amsterdam.nl/data/parkeervakken/parkeervakken/121455487005/',
        },
        {
          fiscalNumber: '121455487006',
          houseNumber: 235,
          street: 'Oudezijds Voorburgwal',
          type: 'Consul/Huisarts/Verloskundige woonadres',
          url: 'https://data.amsterdam.nl/data/parkeervakken/parkeervakken/121455487005/',
        },
      ],
      previousLicensePlates: null,
      processed: false,
      requestTypes: ['Kentekenwijziging', 'Nieuwe aanvraag'],
      status: 'Ontvangen',
      title: 'Eigen parkeerplaats',
      link: {
        to: '/vergunningen/eigen-parkeerplaats/1817502388',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      caseType: 'Eigen parkeerplaats opheffen',
      dateDecision: null,
      dateEnd: null,
      dateRequest: '2023-10-13',
      dateWorkflowActive: null,
      decision: null,
      description:
        'Eigen parkeerplaats opheffen - consul T. Test - Weesperstraat 113',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABlKUT6uMKa-G_dqooy7qnHCSbOnX387SgvINkKASAAgFp8y5yArOKcgPvYJsDq-VXHOCGkl1DRONHdZDUaMMJDxgLXSt9VaVxFR9qquguf2LR-JPV5WLsLRvd0aGqQ_mMOxKFo',
      id: '1679261105',
      identifier: 'Z/23/2230376',
      isCarsharingpermit: false,
      processed: false,
      status: 'Ontvangen',
      title: 'Eigen parkeerplaats opheffen',
      link: {
        to: '/vergunningen/eigen-parkeerplaats-opheffen/1679261105',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
      location: {
        fiscalNumber: null,
        street: 'Weesperstraat',
        houseNumber: 113,
        type: null,
        url: null,
      },
    },
    {
      area: 'Laan van Vlaanderen',
      caseType: 'RVV Sloterweg',
      dateDecision: null,
      dateEnd: '2025-11-01',
      dateRequest: '2023-10-27',
      dateStart: '2023-11-01',
      dateWorkflowActive: null,
      dateWorkflowVerleend: '2023-10-27',
      decision: null,
      description: 'RVV-ontheffing Sloterweg',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABlO4uCdtmi0jKd4X-LlZBF7_CE04jAY-Rqhn1TAWDBcL_d4pUBPnKmQ3gFgAsVJSFXbLzFOUeVKagJP7S4E_YE1yd8OHFpSFhX6IbVzC2gqHX8EU6zTGeDrEzcU40NH_6WLUn2',
      id: '1600396405',
      identifier: 'Z/23/2230346',
      licensePlates: 'PR067L',
      previousLicensePlates: null,
      processed: true,
      requestType: 'Nieuw',
      status: 'Actief',
      title: 'RVV ontheffing Laan van Vlaanderen',
      link: {
        to: '/vergunningen/rvv-sloterweg/1600396405',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      area: 'Laan van Vlaanderen',
      caseType: 'RVV Sloterweg',
      dateDecision: null,
      dateEnd: '2025-11-01',
      dateRequest: '2023-10-27',
      dateStart: '2023-11-01',
      dateWorkflowActive: '2023-10-27',
      dateWorkflowVerleend: '2023-10-28',
      decision: null,
      description: 'RVV-ontheffing Sloterweg kenteken wijzigen',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABlO4uCHh8ARMzyGZBP1Vsan0c2N7iL2PoS27A2s3PeSk_W3Oc_hJ54wLT5o6KKrOTA4JMV8cjy9O54XjH4LzmWxytyAU4GuTKbNrnfcX_KuHEBifQ97-vBOyp0QNmbonK9S3ho',
      id: '3593173882',
      identifier: 'Z/23/2230349',
      licensePlates: 'TT148N',
      previousLicensePlates: 'PR067L',
      processed: false,
      requestType: 'Wijziging',
      status: 'Ontvangen',
      title: 'RVV ontheffing Sloterweg (Verleend)',
      link: {
        to: '/vergunningen/rvv-sloterweg/3593173882',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      area: 'Laan van Vlaanderen',
      caseType: 'RVV Sloterweg',
      dateDecision: null,
      dateEnd: '2025-11-01',
      dateRequest: '2023-10-27',
      dateStart: '2023-11-01',
      dateWorkflowActive: '2023-10-27',
      dateWorkflowVerleend: '2023-10-28',
      decision: null,
      description: 'RVV-ontheffing Sloterweg kenteken wijzigen',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABlO4uCHh8ARMzyGZBP1Vsan0c2N7iL2PoS27A2s3PeSk_W3Oc_hJ54wLT5o6KKrOTA4JMV8cjy9O54XjH4LzmWxytyAU4GuTKbNrnfcX_KuHEBifQ97-vBOyp0QNmbonK9S3ho',
      id: '3593173882',
      identifier: 'Z/23/999999999',
      licensePlates: 'AAYYAA',
      previousLicensePlates: 'PR067L',
      processed: false,
      requestType: 'Wijziging',
      status: 'Actief',
      title: 'RVV ontheffing Laan van Vlaanderen (AAYYAA) (Verleend)',
      link: {
        to: '/vergunningen/rvv-sloterweg/3593173882',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      caseType: 'Touringcar Jaarontheffing',
      dateDecision: null,
      dateEnd: '2024-11-16',
      dateRequest: '2023-11-14',
      dateStart: '2023-11-16',
      dateWorkflowActive: '2023-11-14',
      decision: null,
      description: 'Jaarontheffing 11-12-2023-11-12-2024',
      destination: 'Kunst of cultuur',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABlXNqVlR9g-ekMrh6MpOBfEFIHrNTr2tdvCr-SoMYPFBnD8MQkMkFN0kxWp4oRSu6n1btPv6LWeTLu9WKB3NFdu2L1AN2LHLNQ0gNj9ZB0io4VxEQb8ZYjgk4Nbbm9vOYnOEb8',
      id: '852482654',
      identifier: 'Z/23/2230478',
      licensePlates:
        'EE-123-C | DD-122-X | EE-123-C | DD-122-X | EE-123-C | DD-122-X | EE-123-C | DD-122-X | EE-123-C | DD-122-X | EE-123-C | DD-122-X',
      processed: false,
      routetest: false,
      status: 'Afhandelen',
      title: 'Touringcar jaarontheffing',
      link: {
        to: '/vergunningen/touringcar-jaarontheffing/852482654',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      caseType: 'Touringcar Dagontheffing',
      dateDecision: '2023-11-13',
      dateEnd: '2023-11-14',
      dateRequest: '2023-11-13',
      dateStart: '2023-11-13',
      dateWorkflowActive: '2023-11-13',
      decision: 'Niet verleend',
      description: 'Dagontheffing 16-11-2023-16-11-2023',
      destination: 'Kunst of cultuur',
      documentsUrl:
        'https://example.com/vergunningen-koppel-api/decosjoin/listdocuments/gAAAAABlXNqVnVGdoGqOFz21eRmDFSNN3k553dltbWJyQWn7uGIIzpwgG0ELy1wL9djx8L_kazU4vXurqSJzL6xoEwQIjhYFhPnLdnHCgVL1k64YDwuriYpPUkquArZLHH1wRbFBxqrS',
      id: '2260364373',
      identifier: 'Z/23/2230474',
      licensePlate: '123-23-SH',
      processed: true,
      status: 'Afgehandeld',
      timeEnd: null,
      timeStart: null,
      title: 'Touringcar dagontheffing',
      link: {
        to: '/vergunningen/touringcar-dagontheffing/2260364373',
        title: 'Bekijk hoe het met uw aanvraag staat',
      },
    },
    {
      caseType: 'Werk en vervoer op straat',
      dateDecision: null,
      dateStart: '2023-12-31',
      dateEnd: '2024-01-14',
      dateRequest: '2023-12-18',
      dateWorkflowActive: '2023-12-18',
      decision: null,
      documentsUrl: null,
      id: '2260364484',
      identifier: 'Z/23/2230585',
      processed: false,
      title: 'Werkzaamheden en vervoer op straat',
      location: 'Gustav Mahlerlaan 10 1082 PP Amsterdam',
      licensePlates: 'XX-123-Z, YY-456-A',
      block: true,
      eblock: true,
      bicycleRack: true,
      eParkingspace: true,
      filming: true,
      night: true,
      object: true,
      parkingspace: true,
      eRvv: true,
      rvv: true,
      vezip: true,
      movingLocations: true,
    },
    {
      caseType: 'Werk en vervoer op straat',
      dateDecision: '2023-12-18',
      dateStart: '2023-12-31',
      dateEnd: '2024-01-14',
      dateRequest: '2023-12-17',
      dateWorkflowActive: '2023-12-18',
      decision: 'Niet verleend',
      documentsUrl: null,
      id: '2260364595',
      identifier: 'Z/23/2230696',
      processed: true,
      title: 'Werkzaamheden en vervoer op straat',
      location: 'Gustav Mahlerlaan 10 1082 PP Amsterdam',
      licensePlates: 'XX-123-Z, YY-456-A',
      block: true,
      eblock: true,
      bicycleRack: true,
      eParkingspace: true,
      filming: true,
      night: false,
      object: false,
      parkingspace: false,
      eRvv: false,
      rvv: false,
      vezip: false,
      movingLocations: false,
    },
  ],
  status: 'OK',
};

const content = transformVergunningenData(vergunningenData as any);

const testState = {
  VERGUNNINGEN: {
    status: 'OK',
    content,
  },
  NOTIFICATIONS: {
    status: 'OK',
    content: [],
  },
};

function state(state: any) {
  function initializeState(snapshot: MutableSnapshot) {
    snapshot.set(appStateAtom, state);
  }

  return initializeState;
}

export function MockVergunningDetail({ identifier }: { identifier: string }) {
  const vergunning = content.find((v) => v.identifier === identifier);
  const routeEntry = generatePath(AppRoutes['VERGUNNINGEN/DETAIL'], {
    title: slug(vergunning?.caseType, {
      lower: true,
    }),
    id: vergunning?.id ?? '',
  });
  const routePath = AppRoutes['VERGUNNINGEN/DETAIL'];

  bffApi
    .get(/\/api\/v1\/services\/vergunningen\/documents\/list\/(.*)/)
    .reply(200, {
      content: [],
    });

  return (
    <MockApp
      routeEntry={routeEntry}
      routePath={routePath}
      component={VergunningDetail}
      initializeState={state(testState)}
    />
  );
}

describe('<VergunningDetail />', () => {
  describe('<EvenementMelding />', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/000/000003" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('<Flyeren />', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1597501" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('<AanbiedenDiensten />', () => {
    it('should match the full page snapshot for multi date variant', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1597602" />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match the full page snapshot for single date variant', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1597471" />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match the full page snapshot for the status received variant', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1597712" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('<GPP />', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/000/000009" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Nachtwerkontheffing', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1691001" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('BZP - In behandeling', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/19795392" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('BZP - Verleend', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/19795384" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('BZB - In behandeling', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1979538" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('BZB - Verleend', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1979539" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Zwaarverkeer', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1692013" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Splitsingsvergunning - In behandeling', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1697573" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('VormenVanWoonruimte - In behandeling', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1697574" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Onttrekkingsvergunning voor sloop - In behandeling', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1797585" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Samenvoegingsvergunning - In behandeling', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/22/1797696" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Ligplaatsvergunning (VOB) - In behandeling', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/23/1797715" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Ligplaatsvergunning (VOB) - Verleend', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/23/1797714" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('RVV hele stad - In behandeling', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/23/1809938" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Eigen parkeerplaats', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/23/2230352" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Eigen parkeerplaats opheffen', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/23/2230376" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Touringcar dagontheffing', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/23/2230474" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Touringcar jaarontheffing', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/23/2230478" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('WVOS', () => {
    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/23/2230585" />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match the full page snapshot', () => {
      const { asFragment } = render(
        <MockVergunningDetail identifier="Z/23/2230696" />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
