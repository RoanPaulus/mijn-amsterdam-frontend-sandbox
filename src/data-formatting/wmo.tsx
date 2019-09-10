import { AppRoutes } from 'App.constants';
import { StatusLineItem } from 'components/StatusLine/StatusLine';
import slug from 'slug';
import { LinkProps } from '../App.types';
import {
  defaultDateFormat,
  isDateInPast,
  capitalizeFirstLetter,
  dateSort,
} from '../helpers/App';
import React from 'react';
import { StepType } from '../components/StatusLine/StatusLine';

// Example data
// [
//   {
//     Omschrijving: 'ambulante ondersteuning',
//     Wet: 1,
//     Actueel: true,
//     Volume: 1,
//     Eenheid: '82',
//     Frequentie: 3,
//     Leveringsvorm: 'ZIN',
//     Omvang: '1 stuks per vier weken',
//     Leverancier: 'Leger des Heils',
//     Checkdatum: '2019-10-09T00:00:00',
//     Voorzieningsoortcode: 'AO5',
//     Voorzieningcode: '021',
//     Aanvraagdatum: '2018-11-20T00:00:00',
//     Beschikkingsdatum: '2018-11-22T00:00:00',
//     VoorzieningIngangsdatum: '2018-11-20T00:00:00',
//     VoorzieningEinddatum: '2019-11-20T00:00:00',
//     Levering: {
//       Opdrachtdatum: '2018-11-22T00:00:00',
//       Leverancier: 'Z00118',
//       IngangsdatumGeldigheid: '2018-11-20T00:00:00',
//       EinddatumGeldigheid: '2019-11-20T00:00:00',
//       StartdatumLeverancier: '2018-11-20T00:00:00',
//       EinddatumLeverancier: null,
//     },
//   },
// ];

export interface WmoProcessItem extends StatusLineItem {
  id: string;
  status: string;
  description: JSX.Element | string;
  datePublished: string;
}

export interface WmoItem {
  id: string;
  title: string; // Omschrijving
  supplier: string; // Leverancier
  supplierUrl: string; // Leverancier url
  isActual: boolean; // Actueel
  link: LinkProps;
  process: WmoProcessItem[];
}

type TextPartContent = string | JSX.Element;
type TextPartContentFormatter = (data: WmoSourceData) => TextPartContent;
type TextPartContents = TextPartContent | TextPartContentFormatter;

const Labels: {
  [group: string]: {
    deliveryType: {
      PGB?: string[];
      ZIN?: string[];
      ''?: string[];
    };
    statusItems: Array<{
      status: string;
      datePublished: TextPartContents;
      description: TextPartContents;
    }>;
  };
} = {
  AOV: {
    deliveryType: {
      ZIN: ['AOV'],
      PGB: ['AOV'],
      '': ['AOV'],
    },
    statusItems: [
      {
        status: 'Besluit',
        datePublished: data => data.dateDecision,
        description: data => (
          <p>
            U hebt recht op een {data.title} per{' '}
            {defaultDateFormat(data.dateStart)}. De vervoerspas ontvangt u per
            post.
          </p>
        ),
      },
      {
        status: 'Einde recht',
        datePublished: data => data.dateFinish,
        description: data => (
          <p>
            {data.dateFinish
              ? 'Op deze datum vervalt uw recht op deze voorziening.'
              : 'Er is een lopend recht zonder einddatum.'}
          </p>
        ),
      },
    ],
  },
  Compensation: {
    deliveryType: {
      ZIN: ['FIN', 'MVV', 'MVW', 'VHK', 'VVD', 'VVK'],
      PGB: [
        'AAN',
        'FIE',
        'FIN',
        'MVV',
        'MVW',
        'OVE',
        'PER',
        'ROL',
        'RWD',
        'RWT',
        'SCO',
        'VHK',
        'VVD',
        'VVK',
        'WRA',
      ],
      '': ['FIE', 'FIN', 'MVV', 'MVW', 'VHK', 'VVK'],
    },
    statusItems: [
      {
        status: 'Besluit',
        datePublished: data => data.dateDecision,
        description: data => (
          <p>
            U hebt recht op een {data.title} per{' '}
            {defaultDateFormat(data.dateStart)}.
          </p>
        ),
      },
      {
        status: 'Einde recht',
        datePublished: data => data.dateFinish,
        description: data => (
          <p>
            {data.dateFinish
              ? 'Op deze datum vervalt uw recht op deze voorziening.'
              : 'Er is een lopend recht zonder einddatum.'}
          </p>
        ),
      },
    ],
  },
  PGB: {
    deliveryType: {
      PGB: [
        'AO2',
        'AO3',
        'AO4',
        'AO5',
        'BSW',
        'DBA',
        'DBH',
        'DBS',
        'KVB',
        'WMH',
      ],
    },
    statusItems: [
      {
        status: 'Besluit',
        datePublished: data => data.dateDecision,
        description: data => (
          <p>
            U hebt recht op {data.title} per {defaultDateFormat(data.dateStart)}
            .
          </p>
        ),
      },
      {
        status: 'Einde recht',
        datePublished: data => data.dateFinish,
        description: data => (
          <p>
            {data.dateFinish
              ? 'Op deze datum vervalt uw recht op deze voorziening.'
              : 'Er is een lopend recht zonder einddatum.'}
          </p>
        ),
      },
    ],
  },
  Services: {
    deliveryType: {
      ZIN: [
        'AO1',
        'AO2',
        'AO3',
        'AO4',
        'AO5',
        'AO6',
        'AO7',
        'AO8',
        'BSW',
        'DBA',
        'DBH',
        'DBL',
        'DBS',
        'KVB',
        'MAO',
        'WMH',
      ],
      '': ['AO2', 'AO5', 'DBS', 'KVB', 'WMH'],
    },
    statusItems: [
      {
        status: 'Besluit',
        datePublished: data => data.dateDecision,
        description: data => (
          <p>
            U hebt recht op {data.title} per {defaultDateFormat(data.dateStart)}
            .
          </p>
        ),
      },
      {
        status: 'Levering gestart',
        datePublished: data => data.dateStartServiceDelivery,
        description: data => (
          <p>
            {data.supplier} is gestart met het leveren van {data.title}.
          </p>
        ),
      },
      {
        status: 'Levering gestopt',
        datePublished: data => data.dateFinishServiceDelivery,
        description: data => (
          <p>
            {data.supplier} heeft aan ons doorgegeven dat u geen {data.title}{' '}
            meer krijgt.
          </p>
        ),
      },
      {
        status: 'Einde recht',
        datePublished: data => data.dateFinish,
        description: data => (
          <p>
            {data.dateFinish
              ? 'Op deze datum vervalt uw recht op deze voorziening.'
              : 'Er is een lopend recht zonder einddatum.'}
          </p>
        ),
      },
    ],
  },
  SupportProducts: {
    deliveryType: {
      ZIN: ['AAN', 'AUT', 'FIE', 'GBW', 'OVE', 'ROL', 'RWD', 'RWT', 'SCO'],
      '': ['AAN', 'FIE'],
    },
    statusItems: [
      {
        status: 'Besluit',
        datePublished: data => data.dateDecision,
        description: data => (
          <p>
            U hebt recht op een {data.title} per{' '}
            {defaultDateFormat(data.dateStart)}.
          </p>
        ),
      },
      {
        status: 'Opdracht gegeven',
        datePublished: data => data.dateStartServiceDelivery,
        description: data => (
          <p>
            De gemeente heeft opdracht gegeven aan{' '}
            {data.serviceDeliverySupplier} om een {data.title} aan u te leveren.
          </p>
        ),
      },
      {
        status: 'Product geleverd',
        datePublished: data => data.dateFinishServiceDelivery,
        description: data => (
          <p>
            {data.serviceDeliverySupplier} heeft aan ons doorgegeven dat een{' '}
            {data.title} bij u is afgeleverd.
          </p>
        ),
      },
      {
        status: 'Einde recht',
        datePublished: data => data.dateFinish,
        description: data => (
          <p>
            {data.dateFinish
              ? 'Op deze datum vervalt uw recht op deze voorziening.'
              : 'Er is een lopend recht zonder einddatum.'}
          </p>
        ),
      },
    ],
  },
  WRA: {
    deliveryType: {
      ZIN: ['ZIN', 'WRA'],
    },
    statusItems: [
      {
        status: 'Besluit',
        datePublished: data => data.dateDecision,
        description: data => (
          <p>
            U hebt recht op een {data.title} per{' '}
            {defaultDateFormat(data.dateStart)}.
          </p>
        ),
      },
      {
        status: 'Opdracht gegeven',
        datePublished: data => data.dateStartServiceDelivery,
        description: data => (
          <p>
            De gemeente heeft opdracht gegeven aan{' '}
            {data.serviceDeliverySupplier} om de aanpassingen aan uw woning uit
            te voeren.
          </p>
        ),
      },
      {
        status: 'Aanpassing uitgevoerd',
        datePublished: data => data.dateFinishServiceDelivery,
        description: data => (
          <p>
            {data.serviceDeliverySupplier} heeft aan ons doorgegeven dat de
            aanpassing aan uw woning is uitgevoerd.
          </p>
        ),
      },
      {
        status: 'Einde recht',
        datePublished: data => data.dateFinish,
        description: data => (
          <p>
            {data.dateFinish
              ? 'Op deze datum vervalt uw recht op deze voorziening.'
              : 'Er is een lopend recht zonder einddatum.'}
          </p>
        ),
      },
    ],
  },
};

export function parseLabelContent(
  text: TextPartContents,
  data: WmoSourceData
): string | JSX.Element {
  let rText = text || '';

  if (typeof rText === 'function') {
    return rText(data);
  }

  return rText;
}

function formatWmoProcessItems(data: WmoSourceData): WmoProcessItem[] {
  const labelData = Object.values(Labels).find(labelData => {
    const type = data.deliveryType || '';
    return (
      labelData.deliveryType[type] &&
      labelData.deliveryType[type]!.includes(data.itemTypeCode)
    );
  });

  if (labelData) {
    const items: WmoProcessItem[] = labelData.statusItems.map(
      (statusItem, index) => {
        const datePublished = parseLabelContent(
          statusItem.datePublished,
          data
        ) as string;

        const supplierChangePossible =
          labelData.statusItems.length === 4 &&
          labelData.statusItems[2].status === 'Levering gestopt';

        const docDescription =
          index === 0 ? (
            <p>
              {supplierChangePossible
                ? `In de brief leest u ook hoe u bezwaar kunt maken, een klacht kan
              indienen of hoe u van aanbieder kunt wisselen.`
                : `In de brief leest u ook hoe u bezwaar kunt maken of hoe u een klacht kan
              indienen.`}
            </p>
          ) : (
            ''
          );
        return {
          id: `status-step-${index}`,
          status: statusItem.status,
          description: (
            <>
              {parseLabelContent(statusItem.description, data)}
              {docDescription}
            </>
          ),
          datePublished,
          isActual: false,
          stepType: 'intermediate-step',
          documents: [], // NOTE: To be implemented in 2020
          isHistorical: false,
        };
      }
    );

    if (items.length) {
      const nItems = [];
      let hasActualStep = false;
      let l = items.length;
      const len = l;

      while (l--) {
        const item = items[l];
        const inPast = isDateInPast(item.datePublished);
        const isActual: boolean = inPast && !hasActualStep;
        let stepType: StepType = 'intermediate-step';

        if (l === 0) {
          stepType = 'first-step';
        } else if (l === items.length - 1) {
          stepType = 'last-step';
        }

        nItems.unshift({
          ...item,
          // Don't show the date for the intermediate steps
          datePublished: l !== 1 && l !== len ? item.datePublished : '',
          isActual,
          stepType,
          isHistorical: inPast && !isActual,
        });

        if (isActual && !hasActualStep) {
          hasActualStep = isActual;
        }
      }

      return nItems;
    }
  }

  return [];
}

interface WmoSourceData {
  title: string;
  dateStart: string;
  dateFinish: string;
  supplier: string;
  isActual: boolean;
  dateDecision: string;
  dateStartServiceDelivery: string;
  dateFinishServiceDelivery: string;
  dateRequestOrderStart: string;
  serviceDeliverySupplier: string;
  itemTypeCode: string;
  deliveryType: 'PGB' | 'ZIN' | '';
}

interface WmoApiLevering {
  Opdrachtdatum: string;
  Leverancier: string;
  IngangsdatumGeldigheid: string;
  EinddatumGeldigheid: string | null;
  StartdatumLeverancier: string;
  EinddatumLeverancier: string | null;
}

export interface WmoApiItem {
  Omschrijving: string;
  Wet: number;
  Actueel: boolean;
  Volume: number;
  Eenheid: string;
  Frequentie: number;
  Leveringsvorm: 'ZIN' | 'PGB' | '';
  Omvang: string;
  Leverancier: string;
  Checkdatum: string | null;
  Voorzieningsoortcode: string;
  Voorzieningcode: string;
  Aanvraagdatum: string;
  Beschikkingsdatum: string;
  VoorzieningIngangsdatum: string;
  VoorzieningEinddatum: string | null;
  Levering: WmoApiLevering | null;
}

export type WmoApiResponse = WmoApiItem[];

export function formatWmoApiResponse(
  wmoApiResponseData: WmoApiResponse
): WmoItem[] {
  const items = wmoApiResponseData
    .sort(dateSort('VoorzieningIngangsdatum', 'desc'))
    .map((item, index) => {
      const {
        Omschrijving: title,
        VoorzieningIngangsdatum: dateStart,
        VoorzieningEinddatum: dateFinish,
        Leverancier: supplier,
        Actueel: isActual,
        Beschikkingsdatum: dateDecision,
        Voorzieningsoortcode: itemTypeCode,
        Leveringsvorm: deliveryType,
      } = item;

      const {
        StartdatumLeverancier: dateStartServiceDelivery,
        EinddatumLeverancier: dateFinishServiceDelivery,
        Opdrachtdatum: dateRequestOrderStart,
        Leverancier: serviceDeliverySupplier, // TODO: seems to be only filled with a code in the api response data
      } = (item.Levering || {}) as WmoApiLevering;

      const id = slug(`${title}-${index}`).toLowerCase();

      const process: WmoItem['process'] = formatWmoProcessItems({
        title,
        dateStart,
        dateFinish: dateFinish || '',
        supplier,
        isActual,
        dateDecision,
        dateStartServiceDelivery,
        dateFinishServiceDelivery: dateFinishServiceDelivery || '',
        dateRequestOrderStart,
        serviceDeliverySupplier: supplier || 'Onbekend',
        itemTypeCode,
        deliveryType,
      });

      return {
        id,
        title: capitalizeFirstLetter(title),
        dateStart: defaultDateFormat(dateStart),
        dateFinish: defaultDateFormat(dateFinish),
        supplier,
        // TODO: See if we can get a url to the suppliers websites
        supplierUrl: '',
        isActual,
        link: {
          title: 'Meer informatie',
          to: `${AppRoutes.ZORG_VOORZIENINGEN}/${id}`,
        },
        process,
      };
    });

  return items;
}
