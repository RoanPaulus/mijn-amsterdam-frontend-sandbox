import { marked } from 'marked';
import memoize from 'memoizee';
import { apiSuccessResult } from '../../universal/helpers';
import { ApiResponse, getSettledResult } from '../../universal/helpers/api';
import { dateSort } from '../../universal/helpers/date';
import { MyNotification, MyTip } from '../../universal/types';
import { DEFAULT_API_CACHE_TTL_MS } from '../config';
import { AuthProfileAndToken } from '../helpers/app';
import {
  fetchBelastingNotifications,
  fetchSubsidieNotifications,
  fetchMilieuzoneNotifications,
  fetchErfpachtNotifications,
} from './simple-connect';
import { fetchBrpNotifications } from './brp';
import { sanitizeCmsContent } from './cms-content';
import { fetchMaintenanceNotificationsDashboard } from './cms-maintenance-notifications';
import { fetchKrefiaNotifications } from './krefia';
import { fetchToeristischeVerhuurNotifications } from './toeristische-verhuur';
import { fetchVergunningenNotifications } from './vergunningen/vergunningen';
import { fetchWiorNotifications } from './wior';
import { fetchWpiNotifications } from './wpi';
import { fetchKlachtenNotifications } from './klachten/klachten';
import { fetchHorecaNotifications } from './horeca';
import { fetchAVGNotifications } from './avg/avg';
import { fetchLoodMetingNotifications } from './bodem/loodmetingen';

export function getTipsAndNotificationsFromApiResults(
  responses: Array<ApiResponse<any>>
) {
  const notifications: MyNotification[] = [];
  const tips: MyTip[] = [];

  // Collect the success response data from the service results and send to the tips Api.
  for (const { content } of responses) {
    if (content === null || typeof content !== 'object') {
      continue;
    }
    // Collection of notifications
    if ('notifications' in content) {
      notifications.push(...content.notifications);
    }

    // Collection of tips
    if ('tips' in content) {
      tips.push(...content.tips);
    }
  }

  const notificationsResult = notifications
    .map((notification) => {
      if (notification.description) {
        notification.description = sanitizeCmsContent(
          marked(notification.description)
        );
      }
      if (notification.moreInformation) {
        notification.moreInformation = sanitizeCmsContent(
          marked(notification.moreInformation)
        );
      }
      return notification;
    })
    .sort(dateSort('datePublished', 'desc'))
    // Put the alerts on the top regardless of the publication date
    .sort((a, b) => (a.isAlert === b.isAlert ? 0 : a.isAlert ? -1 : 0));

  const tipsResult = tips.map((notification) => {
    if (notification.description) {
      notification.description = sanitizeCmsContent(notification.description);
    }
    return notification;
  });

  return {
    NOTIFICATIONS: apiSuccessResult(notificationsResult),
    TIPS: apiSuccessResult(tipsResult),
  };
}

async function fetchServicesNotifications(
  requestID: requestID,
  authProfileAndToken: AuthProfileAndToken,
  profileType: ProfileType
) {
  if (profileType === 'commercial') {
    const [
      milieuzoneNotificationsResult,
      vergunningenNotificationsResult,
      horecaNotificationsResult,
      erfpachtNotificationsResult,
      maintenanceNotifications,
      subsidieNotificationsResult,
      toeristischeVerhuurNotificationsResult,
      bodemNotificationResult,
    ] = await Promise.allSettled([
      fetchMilieuzoneNotifications(requestID, authProfileAndToken),
      fetchVergunningenNotifications(requestID, authProfileAndToken),
      fetchHorecaNotifications(requestID, authProfileAndToken),
      fetchErfpachtNotifications(requestID, authProfileAndToken),
      fetchSubsidieNotifications(requestID, authProfileAndToken),
      fetchMaintenanceNotificationsDashboard(requestID),
      fetchToeristischeVerhuurNotifications(
        requestID,
        authProfileAndToken,
        new Date(),
        'commercial'
      ),
      fetchLoodMetingNotifications(requestID, authProfileAndToken),
    ]);

    const milieuzoneNotifications = getSettledResult(
      milieuzoneNotificationsResult
    );
    const vergunningenNotifications = getSettledResult(
      vergunningenNotificationsResult
    );
    const erfpachtNotifications = getSettledResult(erfpachtNotificationsResult);
    const maintenanceNotificationsResult = getSettledResult(
      maintenanceNotifications
    );
    const subsidieNotifications = getSettledResult(subsidieNotificationsResult);
    const toeristischeVerhuurNotifications = getSettledResult(
      toeristischeVerhuurNotificationsResult
    );
    const horecaNotificaties = getSettledResult(horecaNotificationsResult);

    const bodemNotificaties = getSettledResult(bodemNotificationResult);

    return getTipsAndNotificationsFromApiResults([
      milieuzoneNotifications,
      vergunningenNotifications,
      horecaNotificaties,
      erfpachtNotifications,
      subsidieNotifications,
      maintenanceNotificationsResult,
      toeristischeVerhuurNotifications,
      bodemNotificaties,
    ]);
  }

  if (profileType === 'private' || profileType === 'private-commercial') {
    const [
      brpNotificationsResult,
      belastingNotificationsResult,
      milieuzoneNotificationsResult,
      vergunningenNotificationsResult,
      erfpachtNotificationsResult,
      subsidieNotificationsResult,
      maintenanceNotificationsResult,
      toeristischeVerhuurNotificationsResult,
      fetchKrefiaNotificationsResult,
      fetchWiorNotificationsResult,
      fetchWpiNotificationsResult,
      klachtenNotificationsResult,
      horecaNotificationsResult,
      avgNotificationsResult,
      bodemNotificationResult,
    ] = await Promise.allSettled([
      fetchBrpNotifications(requestID, authProfileAndToken),
      fetchBelastingNotifications(requestID, authProfileAndToken),
      fetchMilieuzoneNotifications(requestID, authProfileAndToken),
      fetchVergunningenNotifications(requestID, authProfileAndToken),
      fetchErfpachtNotifications(requestID, authProfileAndToken),
      fetchSubsidieNotifications(requestID, authProfileAndToken),
      fetchMaintenanceNotificationsDashboard(requestID),
      fetchToeristischeVerhuurNotifications(requestID, authProfileAndToken),
      fetchKrefiaNotifications(requestID, authProfileAndToken),
      fetchWiorNotifications(requestID, authProfileAndToken, profileType),
      fetchWpiNotifications(requestID, authProfileAndToken),
      fetchKlachtenNotifications(requestID, authProfileAndToken),
      fetchHorecaNotifications(requestID, authProfileAndToken),
      fetchAVGNotifications(requestID, authProfileAndToken),
      fetchLoodMetingNotifications(requestID, authProfileAndToken),
    ]);

    const brpNotifications = getSettledResult(brpNotificationsResult);
    const belastingNotifications = getSettledResult(
      belastingNotificationsResult
    );
    const milieuzoneNotifications = getSettledResult(
      milieuzoneNotificationsResult
    );
    const vergunningenNotifications = getSettledResult(
      vergunningenNotificationsResult
    );
    const erfpachtNotifications = getSettledResult(erfpachtNotificationsResult);
    const subsidieNotifications = getSettledResult(subsidieNotificationsResult);
    const maintenanceNotifications = getSettledResult(
      maintenanceNotificationsResult
    );
    const toeristischeVerhuurNotifications = getSettledResult(
      toeristischeVerhuurNotificationsResult
    );
    const krefiaNotifications = getSettledResult(
      fetchKrefiaNotificationsResult
    );
    const wiorNotifications = getSettledResult(fetchWiorNotificationsResult);
    const wpiNotifications = getSettledResult(fetchWpiNotificationsResult);
    const klachtenNotifications = getSettledResult(klachtenNotificationsResult);
    const horecaNotificaties = getSettledResult(horecaNotificationsResult);
    const avgNotificaties = getSettledResult(avgNotificationsResult);
    const bodemNotificaties = getSettledResult(bodemNotificationResult);

    return getTipsAndNotificationsFromApiResults([
      brpNotifications,
      belastingNotifications,
      milieuzoneNotifications,
      vergunningenNotifications,
      erfpachtNotifications,
      subsidieNotifications,
      maintenanceNotifications,
      toeristischeVerhuurNotifications,
      krefiaNotifications,
      wiorNotifications,
      wpiNotifications,
      klachtenNotifications,
      horecaNotificaties,
      avgNotificaties,
      bodemNotificaties,
    ]);
  }

  return {
    NOTIFICATIONS: apiSuccessResult([]),
    TIPS: apiSuccessResult([]),
  };
}

export const fetchTipsAndNotifications = memoize(fetchServicesNotifications, {
  maxAge: DEFAULT_API_CACHE_TTL_MS,
  normalizer: function (args) {
    // args is arguments object as accessible in memoized function
    return args[0] + JSON.stringify(args[1]);
  },
});
