import { subMonths } from 'date-fns';
import { LinkProps } from 'react-router-dom';
import { dateFormat } from '../../../universal/helpers';
import { NOTIFICATION_REMINDER_FROM_MONTHS_NEAR_END } from '../../../universal/helpers/vergunningen';
import { CaseType } from '../../../universal/types/vergunningen';
import { Vergunning, VergunningExpirable } from './vergunningen';

type NotificationStatusType =
  | 'almostExpired'
  | 'isExpired'
  | 'requested'
  | 'inProgress'
  | 'done';

type NotificationProperty = 'title' | 'description' | 'datePublished' | 'link';
type NotificationPropertyValue = (item: Vergunning) => string;
type NotificationLink = (item: Vergunning) => LinkProps;

type NotificationLinks = {
  [key in Vergunning['caseType']]?: string;
};

type NotificationLabelsBase = {
  [key in Exclude<NotificationProperty, 'link'>]: NotificationPropertyValue;
};

export interface NotificationLabels extends NotificationLabelsBase {
  link: NotificationLink;
}

export type NotificatonContentLabels = {
  [type in NotificationStatusType]?: NotificationLabels;
};

type NotificationContent = {
  [key in CaseType]?: NotificatonContentLabels;
};

const notificationLinks: NotificationLinks = {
  [CaseType.BZB]:
    'https://www.amsterdam.nl/veelgevraagd/?productid=%7B1153113D-FA40-4EB0-8132-84E99746D7B0%7D',
  [CaseType.BZP]:
    'https://www.amsterdam.nl/veelgevraagd/?productid=%7B1153113D-FA40-4EB0-8132-84E99746D7B0%7D', // Not yet available in RD
  [CaseType.GPK]:
    'https://formulieren.amsterdam.nl/TripleForms/DirectRegelen/formulier/nl-NL/evAmsterdam/GehandicaptenParkeerKaartAanvraag.aspx',
};

const almostExpired: NotificationLabels = {
  title: (item) => `Uw ${item.caseType} loopt af`,
  description: (item) => `Uw ${item.title} loopt binnenkort af.`,
  datePublished: (item: VergunningExpirable) =>
    dateFormat(
      subMonths(
        new Date(item.dateEnd ?? item.dateRequest),
        NOTIFICATION_REMINDER_FROM_MONTHS_NEAR_END
      ),
      'yyyy-MM-dd'
    ),
  link: (item) => ({
    title: `Vraag tijdig een nieuwe vergunning aan`,
    to: notificationLinks[item.caseType] || item.link.to,
  }),
};

const isExpired: NotificationLabels = {
  title: (item) => `Uw ${item.caseType} is verlopen`,
  description: (item) => `Uw ${item.title} is verlopen.`,
  datePublished: (item: VergunningExpirable) =>
    item.dateEnd ?? item.dateRequest,
  link: (item) => ({
    title: `Vraag zonodig een nieuwe vergunning aan`,
    to: notificationLinks[item.caseType] || item.link.to,
  }),
};

const requested: NotificationLabels = {
  title: (item) => `${item.caseType} ontvangen`,
  description: (item) => `Uw vergunningsaanvraag ${item.title} is ontvangen.`,
  datePublished: (item) => item.dateRequest,
  link: (item) => ({
    title: 'Bekijk details',
    to: item.link.to,
  }),
};

const inProgress: NotificationLabels = {
  title: (item) => `Uw ${item.caseType} is in behandeling`,
  description: (item) =>
    `Uw vergunningsaanvraag voor ${item.title} is in behandeling genomen.`,
  datePublished: (item) => item.dateRequest,
  link: (item) => ({
    title: 'Bekijk details',
    to: item.link.to,
  }),
};

const done: NotificationLabels = {
  title: (item) => `${item.caseType} afgehandeld`,
  description: (item) =>
    `Uw vergunningsaanvraag voor een ${item.title} is afgehandeld.`,
  datePublished: (item) => item.dateDecision ?? item.dateRequest,
  link: (item) => ({
    title: 'Bekijk details',
    to: item.link.to,
  }),
};

export const notificationContent: NotificationContent = {
  [CaseType.BZB]: {
    almostExpired,
    isExpired,
    inProgress,
    done,
  },
  [CaseType.BZP]: {
    almostExpired,
    isExpired,
    inProgress,
    done,
  },
  [CaseType.GPK]: {
    almostExpired,
    isExpired,
    inProgress,
    done,
  },
  [CaseType.GPP]: {
    inProgress,
    done,
  },
  [CaseType.ERVV]: {
    inProgress: {
      ...inProgress,
      title: (item) => `Uw ${item.title} is in behandeling`,
    },
    done: {
      ...done,
      title: (item) => `Uw ${item.title} is afgehandeld`,
    },
  },
  [CaseType.TVMRVVObject]: {
    inProgress: {
      ...inProgress,
      title: (item) => `Uw ${item.title} is in behandeling`,
    },
    done: {
      ...done,
      title: (item) => `Uw ${item.title} is afgehandeld`,
    },
  },
  [CaseType.EvenementVergunning]: {
    inProgress: {
      ...inProgress,
      title: (item) => `${item.title} ontvangen`,
      description: (item) =>
        `Uw vergunningsaanvraag ${item.title} is ontvangen.`,
    },
    done: {
      ...done,
      title: (item) => `${item.title} afgehandeld`,
      description: (item) =>
        `Uw vergunningsaanvraag ${item.title} is afgehandeld.`,
    },
  },
  [CaseType.EvenementMelding]: {
    inProgress: {
      ...inProgress,
      title: (item) => `${item.title} in behandeling`,
      description: (item) => `Uw ${item.title} is in behandeling genomen.`,
    },
    done: {
      ...done,
      title: (item) => `${item.title} afgehandeld`,
      description: (item) => `Uw ${item.title} is afgehandeld.`,
    },
  },
  [CaseType.Omzettingsvergunning]: {
    requested: {
      ...requested,
      title: (item) => `Aanvraag ${item.title.toLocaleLowerCase()} ontvangen`,
      description: (item) =>
        `Uw vergunningsaanvraag ${item.title} is geregistreerd.`,
    },
    inProgress: {
      ...inProgress,
      title: (item) =>
        `Aanvraag ${item.title.toLocaleLowerCase()} in behandeling`,
      description: (item) =>
        `Uw vergunningsaanvraag ${item.title} is in behandeling genomen.`,
      datePublished: (item) => item.dateWorkflowActive ?? item.dateRequest,
    },
    done: {
      ...done,
      title: (item) => `Aanvraag ${item.title.toLocaleLowerCase()} afgehandeld`,
      description: (item) =>
        `Uw vergunningsaanvraag ${item.title} is afgehandeld`,
    },
  },
  //TODO: Add those eventually later
  // [CaseType.VakantieVerhuur]: {},
  // [CaseType.BBVergunning]: {},
  // [CaseType.VakantieverhuurVergunningaanvraag]: {},
};
