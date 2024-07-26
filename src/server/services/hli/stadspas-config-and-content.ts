import { generatePath } from 'react-router-dom';
import { AppRoutes } from '../../../universal/config/routes';
import { Themas } from '../../../universal/config/thema';
import { dateFormat, defaultDateFormat } from '../../../universal/helpers/date';
import { MyNotification } from '../../../universal/types';
import { StadspasFrontend } from './stadspas-types';

export const GPASS_API_TOKEN = process.env.BFF_GPASS_API_TOKEN;
export const GPASS_BUDGET_ONLY_FOR_CHILDREN = true;

const BUDGET_NOTIFICATION_DATE_START = `${new Date().getFullYear()}-05-01`;
const BUDGET_NOTIFICATION_DATE_END = `${new Date().getFullYear()}-07-31`;
const BUDGET_NOTIFICATION_BALANCE_THRESHOLD = 10;
const BUDGET_NOTIFICATION_PARENT = `
  Uw kind heeft nog een saldo van €${BUDGET_NOTIFICATION_BALANCE_THRESHOLD} of meer voor het kindtegoed.
  Het saldo vervalt op ${defaultDateFormat(BUDGET_NOTIFICATION_DATE_END)}.
  `;
const BUDGET_NOTIFICATION_CHILD = `
  Je hebt nog een saldo van €${BUDGET_NOTIFICATION_BALANCE_THRESHOLD} of meer voor het kindtegoed.
  Het saldo vervalt op ${defaultDateFormat(BUDGET_NOTIFICATION_DATE_END)}.
  `;

export function getBudgetNotifications(stadspassen: StadspasFrontend[]) {
  const notifications: MyNotification[] = [];

  const createNotificationBudget = (
    description: string,
    stadspasId?: string
  ) => ({
    id: `stadspas-budget-notification`,
    datePublished: dateFormat(new Date(), 'yyyy-MM-dd'),
    thema: Themas.HLI,
    title: `Stadspas kindtegoed: Maak je tegoed op voor ${defaultDateFormat(
      BUDGET_NOTIFICATION_DATE_END
    )}!`,
    description,
    link: {
      to: stadspasId
        ? generatePath(AppRoutes['HLI/STADSPAS'], { id: stadspasId })
        : AppRoutes.HLI,
      title: 'Check het saldo',
    },
  });

  const stadspas = stadspassen.find((stadspas) =>
    stadspas.budgets.some(
      (budget) => budget.budgetBalance >= BUDGET_NOTIFICATION_BALANCE_THRESHOLD
    )
  );

  const needsNotification = !!stadspas;
  const isParent = stadspassen.some(
    (pas) =>
      pas.owner.initials !== stadspassen[0].owner.initials ||
      pas.owner.firstname !== stadspassen[0].owner.firstname
  );
  const now = new Date();

  if (
    needsNotification &&
    now >= new Date(BUDGET_NOTIFICATION_DATE_START) &&
    now <= new Date(BUDGET_NOTIFICATION_DATE_END)
  ) {
    const notification = isParent
      ? createNotificationBudget(BUDGET_NOTIFICATION_PARENT)
      : createNotificationBudget(BUDGET_NOTIFICATION_CHILD, stadspas?.id);
    notifications.push(notification);
  }

  return notifications;
}
