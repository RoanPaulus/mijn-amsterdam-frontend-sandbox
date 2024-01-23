import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import { omit } from '../../universal/helpers';
import {
  apiErrorResult,
  apiSuccessResult,
  getSettledResult,
} from '../../universal/helpers/api';
import { MyNotification } from '../../universal/types';
import {
  addServiceResultHandler,
  getAuth,
  getProfileType,
  queryParams,
  sendMessage,
} from '../helpers/app';
import { fetchAfval, fetchAfvalPunten } from './afval/afval';
import { fetchAVG } from './avg/avg';
import { fetchBezwaren } from './bezwaren/bezwaren';
import { fetchLoodmetingen } from './bodem/loodmetingen';
import { fetchBRP } from './brp';
import { fetchCMSCONTENT } from './cms-content';
import { fetchMaintenanceNotificationsActual } from './cms-maintenance-notifications';
import { fetchMyLocation } from './home';
import { fetchHorecaVergunningen } from './horeca';
import { fetchAllKlachten } from './klachten/klachten';
import { fetchKrefia } from './krefia';
import { fetchKVK } from './kvk';
import { fetchProfile } from './profile';
import { fetchSignals } from './sia';
import {
  fetchBelasting,
  fetchMilieuzone,
  fetchOvertredingen,
  fetchSubsidie,
} from './simple-connect';
import { fetchErfpacht, fetchErfpachtV2 } from './simple-connect/erfpacht';
import {
  fetchTipsAndNotifications,
  sortNotifications,
} from './tips-and-notifications';
import {
  convertTipToNotication,
  createTipsFromServiceResults,
} from './tips/tips-service';
import { fetchToeristischeVerhuur } from './toeristische-verhuur';
import { fetchVergunningen } from './vergunningen/vergunningen';
import { fetchWmo } from './wmo';
import {
  fetchBbz,
  fetchBijstandsuitkering,
  fetchSpecificaties,
  fetchStadspas,
  fetchTonk,
  fetchTozo,
} from './wpi';

// Default service call just passing requestID and request headers as arguments
function callService<T>(fetchService: (...args: any) => Promise<T>) {
  return async (requestID: requestID, req: Request) =>
    fetchService(requestID, await getAuth(req), queryParams(req));
}

function callPublicService<T>(fetchService: (...args: any) => Promise<T>) {
  return (requestID: requestID, req: Request) =>
    fetchService(requestID, queryParams(req));
}

function getServiceMap(profileType: ProfileType) {
  return servicesByProfileType[profileType];
}

function getServiceTipsMap(profileType: ProfileType) {
  return servicesTipsByProfileType[profileType] ?? {};
}

/**
 * The service methods
 */
// Public services
const CMS_CONTENT = callPublicService(fetchCMSCONTENT);
const CMS_MAINTENANCE_NOTIFICATIONS = callPublicService(
  fetchMaintenanceNotificationsActual
);

// Protected services
const BRP = callService(fetchBRP);
const KVK = callService(fetchKVK);
const KREFIA = callService(fetchKrefia);
const WPI_AANVRAGEN = callService(fetchBijstandsuitkering);
const WPI_SPECIFICATIES = callService(fetchSpecificaties);
const WPI_TOZO = callService(fetchTozo);
const WPI_TONK = callService(fetchTonk);
const WPI_BBZ = callService(fetchBbz);
const WPI_STADSPAS = callService(fetchStadspas);

const WMO = callService(fetchWmo);

const TOERISTISCHE_VERHUUR = async (requestID: requestID, req: Request) =>
  fetchToeristischeVerhuur(
    requestID,
    await getAuth(req),
    await getProfileType(req)
  );

const VERGUNNINGEN = async (requestID: requestID, req: Request) =>
  fetchVergunningen(requestID, await getAuth(req));

const HORECA = async (requestID: requestID, req: Request) =>
  fetchHorecaVergunningen(
    requestID,
    await getAuth(req),
    await getProfileType(req)
  );

// Location, address, based services
const MY_LOCATION = async (requestID: requestID, req: Request) =>
  fetchMyLocation(requestID, await getAuth(req), await getProfileType(req));

const AFVAL = async (requestID: requestID, req: Request) =>
  fetchAfval(requestID, await getAuth(req), await getProfileType(req));

const AFVALPUNTEN = async (requestID: requestID, req: Request) =>
  fetchAfvalPunten(requestID, await getAuth(req), await getProfileType(req));

// Architectural pattern C. TODO: Make generic services for pattern C.
const BELASTINGEN = callService(fetchBelasting);
const MILIEUZONE = callService(fetchMilieuzone);
const OVERTREDINGEN = callService(fetchOvertredingen);
const ERFPACHT = callService(fetchErfpacht);
const ERFPACHTv2 = callService(fetchErfpachtV2);
const SUBSIDIE = callService(fetchSubsidie);
const KLACHTEN = callService(fetchAllKlachten);
const BEZWAREN = callService(fetchBezwaren);
const SIA = callService(fetchSignals);
const PROFILE = callService(fetchProfile);
const AVG = callService(fetchAVG);
const BODEM = callService(fetchLoodmetingen); // For now bodem only consists of loodmetingen.

// Special services that aggregates NOTIFICATIONS from various services
const NOTIFICATIONS = async (requestID: requestID, req: Request) => {
  const profileType = await getProfileType(req);

  // No notifications for this profile type
  if (profileType === 'private-attributes') {
    return apiSuccessResult([]);
  }

  const [tipNotifications, chapterAndTipNotifications] = await Promise.all([
    getTipNotifications(requestID, req),
    fetchTipsAndNotifications(requestID, await getAuth(req)),
  ]);

  const notifications: Array<MyNotification> = [
    ...tipNotifications,
    ...chapterAndTipNotifications,
  ];

  const notificationsWithTipsInserted = sortNotifications(notifications);

  return apiSuccessResult(notificationsWithTipsInserted);
};

// Store all services for type derivation
const SERVICES_INDEX = {
  BRP,
  CMS_CONTENT,
  CMS_MAINTENANCE_NOTIFICATIONS,
  KVK,
  KREFIA,
  WPI_AANVRAGEN,
  WPI_SPECIFICATIES,
  WPI_TOZO,
  WPI_TONK,
  WPI_BBZ,
  WPI_STADSPAS,
  WMO,
  VERGUNNINGEN,
  MY_LOCATION,
  AFVAL,
  AFVALPUNTEN,
  BELASTINGEN,
  MILIEUZONE,
  OVERTREDINGEN,
  TOERISTISCHE_VERHUUR,
  ERFPACHT,
  ERFPACHTv2,
  SUBSIDIE,
  KLACHTEN,
  BEZWAREN,
  NOTIFICATIONS,
  PROFILE,
  HORECA,
  SIA,
  AVG,
  BODEM,
};

export type ServicesType = typeof SERVICES_INDEX;
export type ServiceID = keyof ServicesType;
export type ServiceMap = { [key in ServiceID]: ServicesType[ServiceID] };

type PrivateServices = Omit<ServicesType, 'PROFILE' | 'SIA'>;

type PrivateServicesAttributeBased = Pick<
  ServiceMap,
  | 'CMS_CONTENT'
  | 'CMS_MAINTENANCE_NOTIFICATIONS'
  | 'NOTIFICATIONS'
  | 'PROFILE'
  | 'SIA'
>;

type CommercialServices = Pick<
  ServiceMap,
  | 'AFVAL'
  | 'AFVALPUNTEN'
  | 'CMS_CONTENT'
  | 'CMS_MAINTENANCE_NOTIFICATIONS'
  | 'ERFPACHT'
  | 'ERFPACHTv2'
  | 'SUBSIDIE'
  | 'NOTIFICATIONS'
  | 'MY_LOCATION'
  | 'KVK'
  | 'MILIEUZONE'
  | 'OVERTREDINGEN'
  | 'VERGUNNINGEN'
  | 'TOERISTISCHE_VERHUUR'
  | 'HORECA'
  | 'BODEM'
  | 'BEZWAREN'
>;

type ServicesByProfileType = {
  private: PrivateServices;
  'private-attributes': PrivateServicesAttributeBased;
  commercial: CommercialServices;
};

export const servicesByProfileType: ServicesByProfileType = {
  private: {
    AFVAL,
    AFVALPUNTEN,
    BRP,
    CMS_CONTENT,
    CMS_MAINTENANCE_NOTIFICATIONS,
    ERFPACHT,
    ERFPACHTv2,
    KREFIA,
    WPI_AANVRAGEN,
    WPI_SPECIFICATIES,
    WPI_TOZO,
    WPI_BBZ,
    WPI_TONK,
    WPI_STADSPAS,
    NOTIFICATIONS,
    MY_LOCATION,
    KVK,
    MILIEUZONE,
    OVERTREDINGEN,
    TOERISTISCHE_VERHUUR,
    SUBSIDIE,
    VERGUNNINGEN,
    WMO,
    KLACHTEN,
    BEZWAREN,
    BELASTINGEN,
    HORECA,
    AVG,
    BODEM,
  },
  'private-attributes': {
    CMS_CONTENT,
    CMS_MAINTENANCE_NOTIFICATIONS,
    NOTIFICATIONS,
    PROFILE,
    SIA,
  },
  commercial: {
    AFVAL,
    AFVALPUNTEN,
    CMS_CONTENT,
    CMS_MAINTENANCE_NOTIFICATIONS,
    ERFPACHT,
    ERFPACHTv2,
    NOTIFICATIONS,
    MY_LOCATION,
    KVK,
    MILIEUZONE,
    OVERTREDINGEN,
    TOERISTISCHE_VERHUUR,
    SUBSIDIE,
    VERGUNNINGEN,
    HORECA,
    BODEM,
    BEZWAREN,
  },
};

const tipsOmit = ['AFVAL', 'AFVALPUNTEN', 'CMS_CONTENT', 'NOTIFICATIONS'];

export const servicesTipsByProfileType = {
  private: omit(
    servicesByProfileType.private,
    tipsOmit as Array<keyof PrivateServices>
  ),
  'private-attributes': {},
  commercial: omit(
    servicesByProfileType.commercial,
    tipsOmit as Array<keyof CommercialServices>
  ),
};

export function loadServices(
  requestID: requestID,
  req: Request,
  serviceMap:
    | PrivateServices
    | CommercialServices
    | PrivateServicesAttributeBased
) {
  return Object.entries(serviceMap).map(([serviceID, fetchService]) => {
    // Return service result as Object like { SERVICE_ID: result }
    return (fetchService(requestID, req) as Promise<any>)
      .then((result) => ({
        [serviceID]: result,
      }))
      .catch((error: Error) => {
        Sentry.captureException(error);
        return {
          [serviceID]: apiErrorResult(
            `Could not load ${serviceID}, error: ${error.message}`,
            null
          ),
        };
      });
  });
}

export async function loadServicesSSE(req: Request, res: Response) {
  const requestID = res.locals.requestID;
  const profileType = await getProfileType(req);

  // Determine the services to be loaded for certain profile types
  const serviceMap = getServiceMap(profileType);
  const serviceIds = Object.keys(serviceMap);
  const servicePromises = loadServices(requestID, req, serviceMap);

  // Add result handler that sends the service result via the EventSource stream
  servicePromises.forEach((servicePromise, index) =>
    addServiceResultHandler(res, servicePromise, serviceIds[index])
  );

  // Close the connection when all services responded
  return Promise.allSettled(servicePromises).then(() => {
    sendMessage(res, 'close', 'message', 'close');
    return res.end();
  });
}

export async function loadServicesAll(req: Request, res: Response) {
  const requestID = res.locals.requestID;
  const profileType = await getProfileType(req);
  const serviceMap = getServiceMap(profileType);
  const servicePromises = loadServices(requestID, req, serviceMap);

  // Combine all results into 1 object
  const serviceResults = (await Promise.all(servicePromises)).reduce(
    (acc, result, index) => Object.assign(acc, result),
    {}
  );

  return serviceResults;
}

/**
 * TIPS specific services
 */
export async function getServiceResultsForTips(
  requestID: requestID,
  req: Request
) {
  let requestData = null;
  const auth = await getAuth(req);
  const servicePromises = loadServices(
    requestID,
    req,
    getServiceTipsMap(auth.profile.profileType) as any
  );
  requestData = (await Promise.allSettled(servicePromises)).reduce(
    (acc, result, index) => Object.assign(acc, getSettledResult(result)),
    {}
  );

  return requestData;
}

export async function getTipNotifications(
  requestID: requestID,
  req: Request
): Promise<MyNotification[]> {
  const serviceResults = await getServiceResultsForTips(requestID, req);
  const {
    profile: { profileType },
  } = await getAuth(req);

  const { content: tipNotifications } = await createTipsFromServiceResults(
    profileType,
    {
      serviceResults,
      tipsDirectlyFromServices: [],
    }
  );

  return tipNotifications.map(convertTipToNotication);
}
