import marked from 'marked';
import { apiSuccesResult } from '../../universal/helpers';
import { getSettledResult, ApiResponse } from '../../universal/helpers/api';
import { dateSort } from '../../universal/helpers/date';
import { MyCase, MyNotification } from '../../universal/types';
import { fetchBELASTINGGenerated } from './belasting';
import { fetchBRPGenerated } from './brp';
import { fetchMaintenanceNotificationsDashboard } from './cms-maintenance-notifications';
import { fetchERFPACHTGenerated } from './erfpacht';
import { fetchFinancieleHulpGenerated } from './financiele-hulp';
import { fetchFOCUSAanvragenGenerated } from './focus/focus-aanvragen';
import { fetchFOCUSSpecificationsGenerated } from './focus/focus-specificaties';
import { fetchFOCUSTonkGenerated } from './focus/focus-tonk';
import { fetchFOCUSTozoGenerated } from './focus/focus-tozo';
import { fetchMILIEUZONEGenerated } from './milieuzone';
import { fetchToeristischeVerhuurGenerated } from './toeristische-verhuur';
import { fetchVergunningenGenerated } from './vergunningen';
import { sanitizeCmsContent } from './cms-content';
import { fetchStadspasSaldoGenerated } from './focus/focus-stadspas';
import { DEFAULT_API_CACHE_TTL_MS } from '../config';
import memoize from 'memoizee';

export function getGeneratedItemsFromApiResults(
  responses: Array<ApiResponse<any>>
) {
  const notifications: MyNotification[] = [];
  const cases: MyCase[] = [];

  // Collect the success response data from the service results and send to the tips Api.
  for (const { content } of responses) {
    if (content === null || typeof content !== 'object') {
      continue;
    }
    // Collection notifications and cases
    if ('notifications' in content) {
      notifications.push(...content.notifications);
    }

    if ('cases' in content) {
      // NOTE: using bracket notation here to satisfy the compiler
      cases.push(...(content['cases'] as MyCase[]));
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
  return {
    CASES: apiSuccesResult(cases.sort(dateSort('datePublished', 'desc'))),
    NOTIFICATIONS: apiSuccesResult(notificationsResult),
  };
}

async function fetchServicesGenerated(
  sessionID: SessionID,
  passthroughRequestHeaders: Record<string, string>,
  profileType: ProfileType
) {
  if (profileType === 'commercial') {
    const [
      milieuzoneGeneratedResult,
      vergunningenGeneratedResult,
      erfpachtGeneratedResult,
      maintenanceNotifications,
      toeristischeVerhuurGeneratedResult,
    ] = await Promise.allSettled([
      fetchMILIEUZONEGenerated(sessionID, passthroughRequestHeaders),
      fetchVergunningenGenerated(sessionID, passthroughRequestHeaders),
      fetchERFPACHTGenerated(sessionID, passthroughRequestHeaders),
      fetchMaintenanceNotificationsDashboard(sessionID),
      fetchToeristischeVerhuurGenerated(
        sessionID,
        passthroughRequestHeaders,
        new Date(),
        'commercial'
      ),
    ]);

    const milieuzoneGenerated = getSettledResult(milieuzoneGeneratedResult);
    const vergunningenGenerated = getSettledResult(vergunningenGeneratedResult);
    const erfpachtGenerated = getSettledResult(erfpachtGeneratedResult);
    const maintenanceNotificationsResult = getSettledResult(
      maintenanceNotifications
    );
    const toeristischeVerhuurNotificationsResult = getSettledResult(
      toeristischeVerhuurGeneratedResult
    );

    return getGeneratedItemsFromApiResults([
      milieuzoneGenerated,
      vergunningenGenerated,
      erfpachtGenerated,
      maintenanceNotificationsResult,
      toeristischeVerhuurNotificationsResult,
    ]);
  }

  const [
    brpGeneratedResult,
    focusAanvragenGeneratedResult,
    focusSpecificatiesGeneratedResult,
    focusTozoGeneratedResult,
    focusTonkGeneratedResult,
    belastingGeneratedResult,
    milieuzoneGeneratedResult,
    vergunningenGeneratedResult,
    erfpachtGeneratedResult,
    maintenanceNotifications,
    stadspasSaldoGeneratedResult,
    toeristischeVerhuurGeneratedResult,
    fetchFinancieleHulpGeneratedResult,
  ] = await Promise.allSettled([
    fetchBRPGenerated(sessionID, passthroughRequestHeaders),
    fetchFOCUSAanvragenGenerated(sessionID, passthroughRequestHeaders),
    fetchFOCUSSpecificationsGenerated(sessionID, passthroughRequestHeaders),
    fetchFOCUSTozoGenerated(sessionID, passthroughRequestHeaders),
    fetchFOCUSTonkGenerated(sessionID, passthroughRequestHeaders),
    fetchBELASTINGGenerated(sessionID, passthroughRequestHeaders),
    fetchMILIEUZONEGenerated(sessionID, passthroughRequestHeaders),
    fetchVergunningenGenerated(sessionID, passthroughRequestHeaders),
    fetchERFPACHTGenerated(sessionID, passthroughRequestHeaders),
    fetchMaintenanceNotificationsDashboard(sessionID),
    fetchStadspasSaldoGenerated(sessionID, passthroughRequestHeaders),
    fetchToeristischeVerhuurGenerated(sessionID, passthroughRequestHeaders),
    fetchFinancieleHulpGenerated(sessionID, passthroughRequestHeaders),
  ]);

  const brpGenerated = getSettledResult(brpGeneratedResult);
  const focusAanvragenGenerated = getSettledResult(
    focusAanvragenGeneratedResult
  );
  const focusSpecificatiesGenerated = getSettledResult(
    focusSpecificatiesGeneratedResult
  );
  const focusTozoGenerated = getSettledResult(focusTozoGeneratedResult);
  const focusTonkGenerated = getSettledResult(focusTonkGeneratedResult);
  const belastingGenerated = getSettledResult(belastingGeneratedResult);
  const milieuzoneGenerated = getSettledResult(milieuzoneGeneratedResult);
  const vergunningenGenerated = getSettledResult(vergunningenGeneratedResult);
  const erfpachtGenerated = getSettledResult(erfpachtGeneratedResult);
  const maintenanceNotificationsResult = getSettledResult(
    maintenanceNotifications
  );
  const toeristischeVerhuurGenerated = getSettledResult(
    toeristischeVerhuurGeneratedResult
  );
  const stadspasGenerated = getSettledResult(stadspasSaldoGeneratedResult);
  const financieleHulpGenerated = getSettledResult(
    fetchFinancieleHulpGeneratedResult
  );

  return getGeneratedItemsFromApiResults([
    brpGenerated,
    focusAanvragenGenerated,
    focusSpecificatiesGenerated,
    focusTozoGenerated,
    focusTonkGenerated,
    belastingGenerated,
    milieuzoneGenerated,
    vergunningenGenerated,
    erfpachtGenerated,
    maintenanceNotificationsResult,
    toeristischeVerhuurGenerated,
    stadspasGenerated,
    financieleHulpGenerated,
  ]);
}

export const fetchGenerated = memoize(fetchServicesGenerated, {
  maxAge: DEFAULT_API_CACHE_TTL_MS,
  normalizer: function (args) {
    // args is arguments object as accessible in memoized function
    return args[0] + JSON.stringify(args[1]);
  },
});
