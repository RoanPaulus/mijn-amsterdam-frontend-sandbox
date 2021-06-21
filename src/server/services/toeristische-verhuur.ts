import { format } from 'date-fns';
import memoize from 'memoizee';
import { generatePath } from 'react-router-dom';
import { Chapters, FeatureToggle } from '../../universal/config';
import { MAXIMUM_DAYS_RENT_ALLOWED } from '../../universal/config/app';
import { AppRoutes } from '../../universal/config/routes';
import {
  apiDependencyError,
  apiSuccesResult,
  getFailedDependencies,
  getSettledResult,
} from '../../universal/helpers/api';
import {
  defaultDateFormat,
  formatDurationBetweenDates,
  isCurrentYear,
  isDateInPast,
} from '../../universal/helpers/date';
import { MyCase, MyNotification } from '../../universal/types';
import { DEFAULT_API_CACHE_TTL_MS, getApiConfig } from '../config';
import { requestData } from '../helpers';
import { dateSort } from '../../universal/helpers/date';
import {
  BBVergunning,
  fetchVergunningen,
  isActualNotification,
  isExpired,
  isNearEndDate,
  toeristischeVerhuurVergunningTypes,
  Vakantieverhuur,
  hasOtherValidVergunningOfSameType,
  VakantieverhuurVergunningaanvraag,
  Vergunning,
} from './vergunningen';
import { isRecentCase } from '../../universal/helpers';

export interface ToeristischeVerhuurRegistratie {
  city: string;
  houseLetter: string | null;
  houseNumber: string | null;
  houseNumberExtension: string | null;
  postalCode: string | null;
  registrationNumber: string | null;
  shortName: string | null;
  street: string | null;
  agreementDate: string | null;
}

export interface ToeristischeVerhuurRegistratiesSourceData {
  content: ToeristischeVerhuurRegistratie[];
}

export function transformToeristischeVerhuurRegistraties(
  responseData: ToeristischeVerhuurRegistratiesSourceData
): ToeristischeVerhuurRegistratie[] | null {
  return responseData.content || [];
}

function fetchRegistraties(
  sessionID: SessionID,
  passthroughRequestHeaders: Record<string, string>
) {
  return requestData<ToeristischeVerhuurRegistratie[]>(
    getApiConfig('TOERISTISCHE_VERHUUR_REGISTRATIES', {
      transformResponse: transformToeristischeVerhuurRegistraties,
    }),
    sessionID,
    passthroughRequestHeaders
  );
}

/** Code to transform and type Decos vergunningen to Toeristische verhuur */

interface ToeristischeVerhuurVergunningProps {
  isActual: boolean;
  duration: number;
}

// A union of the the source types that are retrieved from the Decos api
export type VakantieverhuurVergunning =
  | Vakantieverhuur
  | BBVergunning
  | VakantieverhuurVergunningaanvraag;

export type ToeristischeVerhuur = ToeristischeVerhuurVergunningProps &
  Vakantieverhuur;

export type ToeristischeVerhuurVergunningaanvraag =
  VakantieverhuurVergunningaanvraag & ToeristischeVerhuurVergunningProps;

export type ToeristischeVerhuurBBVergunning = BBVergunning &
  ToeristischeVerhuurVergunningProps;

export type ToeristischeVerhuurVergunning =
  | ToeristischeVerhuur
  | ToeristischeVerhuurBBVergunning
  | ToeristischeVerhuurVergunningaanvraag;

export function transformToeristischeVerhuurVergunningTitle(
  vergunning: VakantieverhuurVergunning,
  isActual: boolean
): string {
  switch (vergunning.caseType) {
    case 'Vakantieverhuur':
      return `${
        vergunning.cancelled
          ? 'Geannuleerde'
          : !isActual
          ? 'Afgelopen'
          : 'Geplande'
      } vakantieverhuur`;
    case 'Vakantieverhuur vergunningsaanvraag':
      return `Vergunning vakantieverhuur`;
    case 'B&B - vergunning':
      return `Vergunning bed & breakfast`;
  }
}

export function daysRentLeftInCalendarYear(
  verhuurItems: ToeristischeVerhuur[]
): number {
  return verhuurItems
    .filter(
      (verhuur) => !!(verhuur.dateStart && isCurrentYear(verhuur.dateStart))
    )
    .map((verhuur) => {
      if (verhuur.dateEnd ? isCurrentYear(verhuur.dateEnd) : undefined) {
        return verhuur.duration;
      } else {
        return verhuur.dateEnd && verhuur.dateStart
          ? formatDurationBetweenDates(verhuur.dateEnd, verhuur.dateStart)
          : 0;
      }
    })
    .reduce(
      (total: number, duration: number) => total - duration,
      MAXIMUM_DAYS_RENT_ALLOWED
    );
}

export function transformVergunningenToVerhuur(
  vergunningen: VakantieverhuurVergunning[]
): ToeristischeVerhuurVergunning[] {
  if (!Array.isArray(vergunningen)) {
    return [];
  }
  return vergunningen
    .map((vergunning) => {
      const isActual = vergunning.dateEnd
        ? !isDateInPast(vergunning.dateEnd)
        : false;
      const title = transformToeristischeVerhuurVergunningTitle(
        vergunning,
        isActual
      );
      return {
        ...vergunning,
        title,
        isActual,
        duration:
          vergunning.dateEnd && vergunning.dateStart
            ? formatDurationBetweenDates(
                vergunning.dateEnd,
                vergunning.dateStart
              )
            : 0,
      };
    })
    .sort(dateSort('dateStart', 'asc'));
}

async function fetchAndTransformToeristischeVerhuur(
  sessionID: SessionID,
  passthroughRequestHeaders: Record<string, string>
) {
  if (!FeatureToggle.toeristischeVerhuurActive) {
    return apiSuccesResult({
      vergunningen: [],
      registraties: [],
      daysLeft: MAXIMUM_DAYS_RENT_ALLOWED,
    });
  }
  const registratiesRequest = fetchRegistraties(
    sessionID,
    passthroughRequestHeaders
  );

  const vergunningenRequest = fetchVergunningen(
    sessionID,
    passthroughRequestHeaders,
    {
      appRoute: (vergunning: Vergunning) => {
        if (
          ['Vakantieverhuur vergunningsaanvraag', 'B&B - vergunning'].includes(
            vergunning.caseType
          )
        ) {
          return AppRoutes['TOERISTISCHE_VERHUUR/VERGUNNING'];
        }
        return AppRoutes['TOERISTISCHE_VERHUUR/VAKANTIEVERHUUR'];
      },
      filter: (vergunning): vergunning is VakantieverhuurVergunning =>
        toeristischeVerhuurVergunningTypes.includes(vergunning.caseType),
    }
  );

  const [registratiesResponse, vergunningenResponse] = await Promise.allSettled(
    [registratiesRequest, vergunningenRequest]
  );

  const registraties = getSettledResult(registratiesResponse);
  const vergunningen = getSettledResult(vergunningenResponse);

  const toeristischeVerhuurVergunningen = transformVergunningenToVerhuur(
    vergunningen.content as VakantieverhuurVergunning[]
  );

  const verhuurVergunningen = toeristischeVerhuurVergunningen.filter(
    (verhuur): verhuur is ToeristischeVerhuur =>
      verhuur.title === 'Geplande vakantieverhuur' ||
      verhuur.title === 'Afgelopen vakantieverhuur'
  );
  const daysLeft = daysRentLeftInCalendarYear(verhuurVergunningen);

  const failedDependencies = getFailedDependencies({
    registraties,
    vergunningen,
  });

  return apiSuccesResult(
    {
      registraties: registraties.content || [],
      vergunningen: toeristischeVerhuurVergunningen,
      daysLeft,
    },
    failedDependencies
  );
}

export const fetchToeristischeVerhuur = memoize(
  fetchAndTransformToeristischeVerhuur,
  {
    maxAge: DEFAULT_API_CACHE_TTL_MS,
    normalizer: function (args) {
      return args[0] + JSON.stringify(args[1]);
    },
  }
);

export function createToeristischeVerhuurNotification(
  item: ToeristischeVerhuurVergunning,
  items: ToeristischeVerhuurVergunning[]
): MyNotification {
  let title = 'Toeristische verhuur';
  let description = 'Er is een update in uw toeristische verhuur overzicht.';
  let datePublished = item.dateRequest;
  let cta = 'Bekijk uw aanvraag';
  let linkTo = AppRoutes.TOERISTISCHE_VERHUUR;

  const vergunningTitleLower = item.title.toLowerCase();

  if (
    item.title === 'Vergunning bed & breakfast' ||
    item.title === 'Vergunning vakantieverhuur'
  ) {
    const ctaLinkToDetail = generatePath(
      AppRoutes['TOERISTISCHE_VERHUUR/VERGUNNING'],
      {
        id: item.id,
      }
    );
    const ctaLinkToAanvragen =
      item.title === 'Vergunning bed & breakfast'
        ? 'https://www.amsterdam.nl/wonen-leefomgeving/wonen/bedandbreakfast/vergunning/'
        : 'https://www.amsterdam.nl/wonen-leefomgeving/wonen/vakantieverhuur/vergunning/';
    switch (true) {
      case item.decision === 'Verleend' &&
        isNearEndDate(item) &&
        !hasOtherValidVergunningOfSameType(items, item):
        title = `Uw ${vergunningTitleLower} loopt af`;
        description = `Uw ${vergunningTitleLower} met gemeentelijk zaaknummer ${item.identifier} loopt binnenkort af. Vraag op tijd een nieuwe vergunning aan.`;
        cta = `Vergunning aanvragen`;
        linkTo = ctaLinkToAanvragen;
        datePublished = format(new Date(), 'yyyy-MM-dd');
        break;
      case item.decision === 'Verleend' &&
        isExpired(item) &&
        !hasOtherValidVergunningOfSameType(items, item):
        title = `Uw ${vergunningTitleLower} is verlopen`;
        description = `Uw ${vergunningTitleLower} met gemeentelijk zaaknummer ${item.identifier} is verlopen. U kunt een nieuwe vergunning aanvragen.`;
        cta = 'Vergunning aanvragen';
        linkTo = ctaLinkToAanvragen;
        datePublished = format(new Date(), 'yyyy-MM-dd');
        break;
      case item.status === 'Ontvangen':
        title = `Aanvraag ${vergunningTitleLower} ontvangen`;
        description = `Wij hebben uw aanvraag voor een ${vergunningTitleLower} met gemeentelijk zaaknummer ${item.identifier} ontvangen.`;
        cta = 'Bekijk uw aanvraag';
        linkTo = ctaLinkToDetail;
        datePublished = item.dateRequest;
        break;
      case item.status === 'Afgehandeld':
        const decision = item.decision?.toLowerCase() || 'afgehandeld';
        title = `Aanvraag ${vergunningTitleLower} ${decision}`;
        description = `Wij hebben uw aanvraag voor een ${vergunningTitleLower} met gemeentelijk zaaknummer ${item.identifier} ${decision}.`;
        cta = 'Bekijk uw aanvraag';
        linkTo = ctaLinkToDetail;
        datePublished = item.dateDecision || item.dateRequest;
        break;
      default:
        title = `Aanvraag ${vergunningTitleLower} in behandeling`;
        description = `Wij hebben uw aanvraag voor een ${vergunningTitleLower} met gemeentelijk zaaknummer ${item.identifier} in behandeling.`;
        cta = `Bekijk uw aanvraag`;
        linkTo = ctaLinkToDetail;
        datePublished = item.dateRequest;
        break;
    }
  } else {
    const ctaLinkToDetail = generatePath(
      AppRoutes['TOERISTISCHE_VERHUUR/VERHUUR'],
      {
        id: item.id,
      }
    );

    const period = !!(item.dateStart && item.dateEnd)
      ? `van ${defaultDateFormat(item.dateStart)} tot ${defaultDateFormat(
          item.dateEnd
        )} `
      : '';

    switch (true) {
      case item.title === 'Geannuleerde vakantieverhuur':
        title = `Vakantieverhuur geannuleerd`;
        description = `Wij hebben uw annulering voor vakantieverhuur ${period}ontvangen.`;
        cta = 'Bekijk uw geannuleerde verhuur';
        linkTo = ctaLinkToDetail;
        datePublished = item.dateRequest;
        break;
      case item.title === 'Geplande vakantieverhuur':
        title = `Vakantieverhuur gepland`;
        description = `Wij hebben uw melding voor vakantieverhuur ${period}ontvangen.`;
        cta = 'Bekijk uw geplande verhuur';
        linkTo = ctaLinkToDetail;
        datePublished = item.dateRequest;
        break;
    }
  }

  return {
    id: `vergunning-${item.id}-notification`,
    datePublished,
    chapter: Chapters.TOERISTISCHE_VERHUUR,
    title,
    description: description,
    link: {
      to: linkTo,
      title: cta,
    },
  };
}

function createRegistratieNotification(
  item: ToeristischeVerhuurRegistratie
): MyNotification {
  const title = 'Aanvraag landelijk registratienummer toeristische verhuur';
  const description = `Wij hebben uw landelijke registratienummer voor toeristische verhuur toegekend. Het nummer is ${item.registrationNumber}.`;
  const datePublished = !!item.agreementDate ? item.agreementDate : '';
  const cta = 'Bekijk het overzicht toeristische verhuur';
  const linkTo = AppRoutes.TOERISTISCHE_VERHUUR;

  return {
    id: `toeristiche-verhuur-registratie-${item.registrationNumber}-notification`,
    datePublished,
    chapter: Chapters.TOERISTISCHE_VERHUUR,
    title,
    description,
    link: {
      to: linkTo,
      title: cta,
    },
  };
}

function createToeristischeVerhuurRecentCase(
  vergunning: ToeristischeVerhuurVergunning
): MyCase {
  return {
    id: `vergunning-${vergunning.id}-case`,
    title: vergunning.title,
    link: vergunning.link,
    chapter: Chapters.TOERISTISCHE_VERHUUR,
    datePublished: vergunning.dateRequest,
  };
}

export async function fetchToeristischeVerhuurGenerated(
  sessionID: SessionID,
  passthroughRequestHeaders: Record<string, string>,
  compareDate?: Date
) {
  const TOERISTISCHE_VERHUUR = await fetchToeristischeVerhuur(
    sessionID,
    passthroughRequestHeaders
  );

  if (TOERISTISCHE_VERHUUR.status === 'OK') {
    const compareToDate = compareDate || new Date();

    const vergunningen = TOERISTISCHE_VERHUUR.content.vergunningen.filter(
      (vergunning) => vergunning.title !== 'Afgelopen vakantieverhuur'
    );
    const vergunningNotifications = vergunningen.map((vergunning) =>
      createToeristischeVerhuurNotification(vergunning, vergunningen)
    );

    const registrationsNotifications =
      TOERISTISCHE_VERHUUR.content.registraties.map(
        createRegistratieNotification
      );

    const notifications = [
      ...vergunningNotifications,
      ...registrationsNotifications,
    ];

    const actualNotifications = notifications.filter(
      (notification) =>
        !!notification.datePublished &&
        isActualNotification(notification.datePublished, compareToDate)
    );

    const cases: MyCase[] = Array.isArray(vergunningen)
      ? vergunningen
          .filter(
            (vergunning) =>
              ([
                'Vergunning bed & breakfast',
                'Vergunning vakantieverhuur',
              ].includes(vergunning.title) &&
                vergunning.status !== 'Afgehandeld') ||
              (vergunning.dateDecision &&
                isRecentCase(vergunning.dateDecision, compareToDate))
          )
          .map(createToeristischeVerhuurRecentCase)
      : [];

    return apiSuccesResult({
      notifications: actualNotifications,
      cases,
    });
  }

  return apiDependencyError({ TOERISTISCHE_VERHUUR });
}
