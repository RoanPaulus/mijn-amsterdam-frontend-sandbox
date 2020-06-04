import {
  formatWmoApiResponse,
  WmoApiResponse,
  WmoItem,
} from 'data-formatting/wmo';
import { getApiConfigValue, getApiUrl } from 'helpers/App';
import { useDataApi } from './api.hook';
import { ApiState } from './api.types';

export type WmoApiState = ApiState<WmoItem[]> & { rawData: WmoApiResponse };

export default function useWmo(): WmoApiState {
  const [api] = useDataApi<WmoApiResponse>(
    {
      url: getApiUrl('WMO'),
      postpone: getApiConfigValue('WMO', 'postponeFetch', false),
    },
    []
  );
  const { data, ...rest } = api;

  return {
    ...rest,
    rawData: data,
    data: formatWmoApiResponse(Array.isArray(data) ? data : [], new Date()),
  };
}
