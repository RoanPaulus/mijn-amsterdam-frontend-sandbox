import { Chapters } from '../../universal/config';
import { ApiUrls, getApiConfigValue } from '../config';
import { MyNotification, MyTip } from '../../universal/types';
import { requestData } from '../helpers';

export interface MILIEUZONEData {
  isKnown: boolean;
}

interface MILIEUZONESourceDataContent {
  isKnown: boolean;
  meldingen: MyNotification[];
  tips: MyTip[];
}

interface MILIEUZONESourceData {
  status: 'OK' | 'ERROR';
  content?: MILIEUZONESourceDataContent;
  message?: string;
}

function transformMILIEUZONENotifications(notifications?: MyNotification[]) {
  const notificationsTransformed = Array.isArray(notifications)
    ? notifications.map(notification => ({
        ...notification,
        chapter: Chapters.MILIEUZONE,
      }))
    : [];

  return notificationsTransformed;
}

function transformMILIEUZONEData(
  responseData: MILIEUZONESourceData
): MILIEUZONEData {
  const { isKnown } = responseData?.content || {
    isKnown: false,
  };

  return {
    isKnown,
  };
}

export function fetchMILIEUZONE(
  sessionID: SessionID,
  samlToken: string,
  raw: boolean = false
) {
  return requestData<MILIEUZONEData>(
    {
      url: ApiUrls.MILIEUZONE,
      transformResponse: responseData =>
        raw ? responseData : transformMILIEUZONEData(responseData),
    },
    sessionID,
    samlToken,
    getApiConfigValue('MILIEUZONE', 'postponeFetch', false)
  );
}

function transformMILIEUZONEGenerated(responseData: MILIEUZONESourceData) {
  let notifications: MyNotification[] = [];

  if (responseData.status === 'OK') {
    if (responseData.content?.meldingen?.length) {
      notifications = transformMILIEUZONENotifications(
        responseData.content.meldingen
      );
    }
  }

  return {
    notifications,
  };
}

export async function fetchMILIEUZONEGenerated(
  sessionID: SessionID,
  samlToken: string
) {
  const response = await requestData<
    ReturnType<typeof transformMILIEUZONEGenerated>
  >(
    {
      url: ApiUrls.MILIEUZONE,
      transformResponse: transformMILIEUZONEGenerated,
    },
    sessionID,
    samlToken,
    getApiConfigValue('MILIEUZONE_GENERATED', 'postponeFetch', false)
  );

  const notifications: MyNotification[] = [];

  return (
    response.content || {
      notifications,
    }
  );
}
