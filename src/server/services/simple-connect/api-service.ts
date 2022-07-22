import { Chapter } from '../../../universal/config';
import {
  ApiResponse,
  apiSuccessResult,
  omit,
} from '../../../universal/helpers';
import { MyNotification, MyTip } from '../../../universal/types';
import { DataRequestConfig } from '../../config';
import { requestData } from '../../helpers';

export interface ApiPatternResponseA {
  tips?: MyTip[];
  isKnown: boolean;
  notifications?: MyNotification[];
}

function transformApiResponseDefault(
  response: ApiResponse<ApiPatternResponseA> | ApiPatternResponseA
) {
  if (
    response !== null &&
    typeof response === 'object' &&
    'content' in response &&
    'status' in response
  ) {
    return response.content;
  }
  return response;
}

export async function fetchService<T extends ApiPatternResponseA>(
  requestID: requestID,
  apiConfig: DataRequestConfig = {},
  includeGenerated: boolean = false
): Promise<ApiResponse<T | null>> {
  const apiConfigMerged: DataRequestConfig = {
    ...apiConfig,
    transformResponse: [transformApiResponseDefault].concat(
      apiConfig.transformResponse || []
    ),
  };

  const response = await requestData<T>(apiConfigMerged, requestID);

  if (response.status === 'OK' && !includeGenerated) {
    return Object.assign({}, response, {
      content:
        response.content &&
        typeof response.content === 'object' &&
        ('notifications' in response.content || 'tips' in response.content)
          ? omit(response.content, ['notifications', 'tips'])
          : response.content,
    });
  }

  return response;
}

export function transformNotificationsDefault(
  notifications: MyNotification[],
  chapter: Chapter
) {
  const notificationsTransformed = Array.isArray(notifications)
    ? notifications.map((notification) => ({
        ...notification,
        chapter,
        link: {
          title:
            notification.link?.title || 'Meer informatie over deze melding',
          to: notification.link?.to || '',
        },
      }))
    : [];

  return notificationsTransformed;
}

export async function fetchGenerated(
  requestID: requestID,
  apiConfig: DataRequestConfig = {},
  chapter: Chapter
): Promise<
  ApiResponse<Pick<ApiPatternResponseA, 'notifications' | 'tips'> | null>
> {
  const response = await fetchService(requestID, apiConfig, true);

  if (response.status === 'OK') {
    const responseData: Pick<ApiPatternResponseA, 'notifications' | 'tips'> =
      {};

    if (response.content?.notifications) {
      responseData.notifications = transformNotificationsDefault(
        response.content.notifications,
        chapter
      );
    }

    if (response.content?.tips) {
      responseData.tips = response.content?.tips;
    }

    return apiSuccessResult(responseData);
  }

  return response;
}
