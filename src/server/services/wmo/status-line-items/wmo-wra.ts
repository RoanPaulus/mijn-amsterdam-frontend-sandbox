import { ZorgnedStatusLineItemTransformerConfig } from '../../zorgned/zorgned-config-and-types';
import {
  AANVRAAG,
  EINDE_RECHT,
  getTransformerConfigBesluit,
  IN_BEHANDELING,
  isBeforeToday,
  isDecisionWithDeliveryActive,
  isServiceDeliveryActive,
  isServiceDeliveryStarted,
  MEER_INFORMATIE,
} from './wmo-generic';

export const WRA: ZorgnedStatusLineItemTransformerConfig[] = [
  AANVRAAG,
  IN_BEHANDELING,
  MEER_INFORMATIE,
  getTransformerConfigBesluit(isDecisionWithDeliveryActive, true),
  {
    status: 'Opdracht gegeven',
    datePublished: (aanvraag) => aanvraag.datumOpdrachtLevering ?? '',
    isVisible: (stepIndex, aanvraag, today, allAanvragen) => {
      return aanvraag.resultaat !== 'afgewezen';
    },
    isChecked: (stepIndex, aanvraag, today: Date) =>
      isBeforeToday(aanvraag.datumOpdrachtLevering, today),
    isActive: (stepIndex, aanvraag, today) =>
      aanvraag.isActueel &&
      isBeforeToday(aanvraag.datumOpdrachtLevering, today) &&
      !isServiceDeliveryStarted(aanvraag, today),
    description: (aanvraag) =>
      `<p>
       We hebben ${aanvraag.leverancier} gevraagd om de aanpassing(en) aan uw woning uit te voeren.
      </p>`,
  },
  {
    status: 'Aanpassing uitgevoerd',
    datePublished: (aanvraag) => aanvraag.datumBeginLevering ?? '',
    isChecked: (stepIndex, aanvraag, today) =>
      isServiceDeliveryStarted(aanvraag, today),
    isActive: (stepIndex, aanvraag, today) =>
      isServiceDeliveryActive(aanvraag, today),
    isVisible: (stepIndex, aanvraag, today, allAanvragen) => {
      return aanvraag.resultaat !== 'afgewezen';
    },
    description: (aanvraag) =>
      `<p>
        ${aanvraag.leverancier} heeft ons laten weten dat de aanpassing(en) aan uw woning klaar is/zijn.
      </p>`,
  },
  EINDE_RECHT,
];
