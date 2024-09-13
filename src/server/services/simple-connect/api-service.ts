import { AxiosResponseTransformer } from 'axios';
import { Thema } from '../../../universal/config/thema';
import { ApiResponse, apiSuccessResult } from '../../../universal/helpers/api';
import { omit } from '../../../universal/helpers/utils';
import { MyNotification, MyTip } from '../../../universal/types';
import { DataRequestConfig } from '../../config/source-api';
import { AuthProfileAndToken } from '../../auth/auth-types';
import { requestData } from '../../helpers/source-api-request';

export interface ApiPatternResponseA {
  tips?: MyTip[];
  isKnown: boolean;
  notifications?: MyNotification[];
}

const transformApiResponseDefault: AxiosResponseTransformer = (
  response: ApiResponse<ApiPatternResponseA> | ApiPatternResponseA
) => {
  if (
    response !== null &&
    typeof response === 'object' &&
    'content' in response &&
    'status' in response
  ) {
    return response.content;
  }
  return response;
};

export async function fetchService<T extends ApiPatternResponseA>(
  requestID: RequestID,
  apiConfig: DataRequestConfig = {},
  includeTipsAndNotifications: boolean = false,
  authProfileAndToken?: AuthProfileAndToken
): Promise<ApiResponse<T | null>> {
  const transformResponse = [transformApiResponseDefault].concat(
    apiConfig.transformResponse ?? []
  );
  const apiConfigMerged: DataRequestConfig = {
    ...apiConfig,
    transformResponse,
  };

  const response = await requestData<T>(
    apiConfigMerged,
    requestID,
    authProfileAndToken
  );

  if (response.status === 'OK' && !includeTipsAndNotifications) {
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
  thema: Thema
) {
  const notificationsTransformed = Array.isArray(notifications)
    ? notifications.map((notification) => ({
        ...notification,
        thema,
        link: {
          title:
            notification.link?.title || 'Meer informatie over deze melding',
          to: notification.link?.to || '',
        },
      }))
    : [];

  return notificationsTransformed;
}

export async function fetchTipsAndNotifications(
  requestID: RequestID,
  apiConfig: DataRequestConfig = {},
  thema: Thema,
  authProfileAndToken?: AuthProfileAndToken
): Promise<
  ApiResponse<Pick<ApiPatternResponseA, 'notifications' | 'tips'> | null>
> {
  const response = await fetchService(
    requestID,
    apiConfig,
    true,
    authProfileAndToken
  );

  if (response.status === 'OK') {
    const responseData: Pick<ApiPatternResponseA, 'notifications' | 'tips'> =
      {};

    if (response.content?.notifications) {
      responseData.notifications = transformNotificationsDefault(
        response.content.notifications,
        thema
      );
    }

    if (response.content?.tips) {
      responseData.tips = response.content?.tips;
    }

    return apiSuccessResult(responseData);
  }

  return response;
}
