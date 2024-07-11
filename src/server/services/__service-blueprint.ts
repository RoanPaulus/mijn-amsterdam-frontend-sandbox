import { getApiConfig } from '../config';
import { GenericDocument } from '../../universal/types/App.types';
import { AuthProfileAndToken } from '../helpers/app';
import { requestData } from '../helpers/source-api-request';

/**
 * This is a blueprint of a service. Change `ServiceName and SERVICE_NAME` to your specific needs.
 */

// The items you get from the api source
export interface ServiceNameSource {
  title: string;
  documents: GenericDocument[];
}

// The root type of the api source
export type ServiceNameSourceData = ServiceNameSource[];

// The items you want to output in this api
export interface Service extends ServiceNameSource {}

// The root type of the items you want to output in this api
export type ServiceNameData = Service[];

// The function you can use to transform the api source data
export function transformServiceNameData(
  responseData: ServiceNameSourceData
): ServiceNameData {
  return responseData;
}

const SERVICE_NAME = 'BRP'; // Change to your service name

export function fetchServiceName(
  requestID: requestID,
  authProfileAndToken: AuthProfileAndToken
) {
  return requestData<ServiceNameData>(
    getApiConfig(SERVICE_NAME, {
      transformResponse: transformServiceNameData,
    }),
    requestID,
    authProfileAndToken
  );
}
