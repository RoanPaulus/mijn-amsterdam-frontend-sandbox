import {
  differenceInCalendarDays,
  differenceInYears,
  parseISO,
} from 'date-fns';

import type { TipsPredicateFN } from './tip-types';
import type { Identiteitsbewijs, Kind } from '../../../universal/types';
import { isAmsterdamAddress } from '../buurt/helpers';
import { HLIRegeling } from '../hli/hli-regelingen-types';
import { BBVergunning } from '../toeristische-verhuur/toeristische-verhuur-types';
import { WMOVoorzieningFrontend } from '../wmo/wmo-config-and-types';
import type { WpiRequestProcess } from '../wpi/wpi-types';

// rule 2
export const is18OrOlder: TipsPredicateFN = (
  appState,
  today: Date = new Date()
) => {
  const AGE_18 = 18;
  return (
    differenceInYears(
      today,
      appState.BRP?.content?.persoon.geboortedatum
        ? new Date(appState.BRP.content.persoon.geboortedatum)
        : today
    ) >= AGE_18
  );
};

export const hasValidId: TipsPredicateFN = (
  appState,
  today: Date = new Date()
) => {
  const ids = appState.BRP?.content?.identiteitsbewijzen ?? [];
  return ids.some((idBewijs: Identiteitsbewijs) => {
    return today <= new Date(idBewijs.datumAfloop);
  });
};

// To use an ID for voting it needs an expiration date with a maximum of five years ago.
export const hasValidIdForVoting: TipsPredicateFN = (appState) => {
  const DATE_OF_VOTE = new Date('2023-11-20'); // Minus 2 days for request processing.
  const YEARS = 5;
  const FIVE_YEARS_AGO = new Date(
    DATE_OF_VOTE.setFullYear(DATE_OF_VOTE.getFullYear() - YEARS)
  );
  return hasValidId(appState, FIVE_YEARS_AGO);
};

// rule 12
export const hasStadspasGroeneStip: TipsPredicateFN = (appState) => {
  if (appState.HLI?.status === 'OK') {
    const stadspassen = appState.HLI?.content?.stadspas ?? [];
    return !!stadspassen.length;
  }
  return false;
};

export const hasValidRecentStadspasRequest: TipsPredicateFN = (
  appState,
  today: Date = new Date()
) => {
  if (appState.HLI?.status === 'OK') {
    return !!appState.HLI?.content?.regelingen.some((aanvraag: HLIRegeling) => {
      return aanvraag.dateDecision
        ? differenceInYears(today, parseISO(aanvraag.dateDecision)) <= 1 &&
            aanvraag.decision === 'toegewezen'
        : false;
    });
  }
  return false;
};

export const previouslyLivingInAmsterdam: TipsPredicateFN = (appState) => {
  return !!(
    appState.BRP?.content?.adresHistorisch &&
    isAmsterdamAddress(
      appState.BRP?.content?.adresHistorisch[0]?.woonplaatsNaam
    )
  );
};

export const isLivingInAmsterdamLessThanNumberOfDays = (
  numberOfDays: number = 0
): TipsPredicateFN => {
  return (stateData, today: Date = new Date()) => {
    return (
      differenceInCalendarDays(
        today,
        new Date(stateData?.BRP?.content?.adres?.begindatumVerblijf ?? '')
      ) <= numberOfDays
    );
  };
};

export const hasTozo: TipsPredicateFN = (appState) => {
  return !!(
    appState.WPI_TOZO?.content && appState.WPI_TOZO?.content?.length > 0
  );
};

export const hasBijstandsuitkering: TipsPredicateFN = (
  appState,
  today: Date = new Date()
) => {
  return (
    appState.WPI_AANVRAGEN?.content?.some(
      (aanvraag: WpiRequestProcess) =>
        aanvraag.decision === 'toekenning' &&
        differenceInYears(today, new Date(aanvraag.datePublished)) <= 1
    ) || false
  );
};

export const hasAOV: TipsPredicateFN = (appState) => {
  return !!appState.WMO?.content?.some(
    (wmo: WMOVoorzieningFrontend) => wmo.isActual && wmo.itemTypeCode === 'AOV'
  );
};

export const hasKidsBetweenAges = (
  kinderen: Kind[] | undefined,
  ageFrom: number,
  ageTo: number,
  today: Date = new Date()
) => {
  return !!kinderen?.some(
    (kind: Kind) =>
      kind.geboortedatum &&
      !kind.overlijdensdatum &&
      differenceInYears(today, new Date(kind.geboortedatum)) >= ageFrom &&
      differenceInYears(today, new Date(kind.geboortedatum)) <= ageTo
  );
};

export const hasKidsBetweenAges2And18: TipsPredicateFN = (
  appState,
  today: Date = new Date()
) => {
  const AGE_FROM = 2;
  const AGE_TO = 18;
  return hasKidsBetweenAges(
    appState.BRP?.content?.kinderen,
    AGE_FROM,
    AGE_TO,
    today
  );
};

export const hasKidsBetweenAges4And11: TipsPredicateFN = (
  appState,
  today: Date = new Date()
) => {
  const AGE_FROM = 4;
  const AGE_TO = 11;
  return hasKidsBetweenAges(
    appState.BRP?.content?.kinderen,
    AGE_FROM,
    AGE_TO,
    today
  );
};

export const hasOldestKidBornFrom2016: TipsPredicateFN = (appState) => {
  const yearFrom = 2016;
  const yearTo = 2024;
  const oldestKid = appState.BRP?.content?.kinderen?.sort(
    (a: any, b: any) =>
      new Date(a.geboortedatum as string).getTime() -
      new Date(b.geboortedatum as string).getTime()
  )[0];

  if (!oldestKid?.geboortedatum) {
    return false;
  }

  const birthYear = new Date(oldestKid?.geboortedatum).getFullYear();
  return birthYear >= yearFrom && birthYear < yearTo;
};

// Rule 13
export const hasDutchNationality: TipsPredicateFN = (appState) => {
  return !!appState.BRP?.content?.persoon?.nationaliteiten.some(
    (n: { omschrijving: string }) => n.omschrijving === 'Nederlandse'
  );
};

export const isBetween17and18: TipsPredicateFN = (
  appState,
  today: Date = new Date()
) => {
  const geboortedatum = appState.BRP?.content?.persoon?.geboortedatum;

  if (!geboortedatum) {
    return false;
  }

  const ageFrom = 17;
  const ageTo = 18;
  return (
    differenceInYears(today, new Date(geboortedatum)) >= ageFrom &&
    differenceInYears(today, new Date(geboortedatum)) <= ageTo
  );
};

export const isBetween4and12: TipsPredicateFN = (
  appState,
  today: Date = new Date()
) => {
  const geboortedatum = appState.BRP?.content?.persoon?.geboortedatum;

  if (!geboortedatum) {
    return false;
  }

  const ageFrom = 4;
  const ageTo = 12;
  return (
    differenceInYears(today, new Date(geboortedatum)) >= ageFrom &&
    differenceInYears(today, new Date(geboortedatum)) <= ageTo
  );
};

export const hasToeristicheVerhuurVergunningen: TipsPredicateFN = (
  appState
) => {
  return !!appState.TOERISTISCHE_VERHUUR?.content?.vakantieverhuurVergunningen
    .length;
};

export const isMarriedOrLivingTogether: TipsPredicateFN = (appState) => {
  return !!appState.BRP?.content?.verbintenis?.soortVerbintenis;
};

export const hasBnBVergunning: TipsPredicateFN = (appState) => {
  return !!appState.TOERISTISCHE_VERHUUR?.content?.bbVergunningen.length;
};

export const hasBnBTransitionRight: TipsPredicateFN = (appState) => {
  return !!appState.TOERISTISCHE_VERHUUR?.content?.bbVergunningen.some(
    (vergunning: BBVergunning) => vergunning.heeftOvergangsRecht
  );
};

export const hasVerhuurRegistrations: TipsPredicateFN = (appState) => {
  return !!appState.TOERISTISCHE_VERHUUR?.content?.lvvRegistraties?.length;
};

export const isReceivingSubsidy: TipsPredicateFN = (
  appState,
  today: Date = new Date()
) => {
  const hasTozo = appState.WPI_TOZO?.content?.some(
    (r: WpiRequestProcess) =>
      r.decision === 'toekenning' &&
      differenceInYears(today, new Date(r.datePublished)) <= 1
  );
  const hasTonk = appState.WPI_TONK?.content?.some(
    (r: WpiRequestProcess) =>
      r.decision === 'toekenning' &&
      differenceInYears(today, new Date(r.datePublished)) <= 1
  );
  const hasWpi = appState.WPI_AANVRAGEN?.content?.some(
    (r: WpiRequestProcess) =>
      r.about === 'Bijstandsuitkering' &&
      r.decision === 'toekenning' &&
      differenceInYears(today, new Date(r.datePublished)) <= 1
  );

  return !!(hasTozo || hasTonk || hasWpi);
};

export const isMokum: TipsPredicateFN = (appState) => {
  return appState.BRP?.content?.persoon?.mokum || false;
};

export function or(predicates: TipsPredicateFN[]): TipsPredicateFN {
  return (stateData, today) => {
    return predicates
      .map((predicate) => predicate(stateData, today))
      .some((res) => res === true);
  };
}

export function not(predicate: TipsPredicateFN): TipsPredicateFN {
  return (stateData, today) => !predicate(stateData, today);
}
