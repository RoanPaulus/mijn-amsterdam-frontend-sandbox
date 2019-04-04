import { useState, useEffect, useReducer } from 'react';
import axios from 'axios';

/**
 * Concepts in this hook are described in the following article:
 * https://www.robinwieruch.de/react-hooks-fetch-data/
 */

const ActionTypes = {
  FETCH_INIT: 'FETCH_INIT',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
};

const createApiDataReducer = (initialData = null) => (state, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_INIT:
      return { ...state, isLoading: true, isError: false };
    case ActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case ActionTypes.FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        data: initialData,
      };
    default:
      throw new Error();
  }
};

// The data api request options object
const DEFAULT_REQUEST_OPTIONS = {
  // Url to data api
  url: '',
  // Request query params
  params: {},
  // Postpone fetch when hook is called initially
  postpone: false,
};

export const useDataApi = (
  options = DEFAULT_REQUEST_OPTIONS,
  initialData = {}
) => {
  const [requestOptions, setRequestOptions] = useState(options);
  const apiDataReducer = createApiDataReducer(initialData);

  const [state, dispatch] = useReducer(apiDataReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  const isDirty = state.data !== initialData;
  const isPristine = !isDirty;

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({
        type: ActionTypes.FETCH_INIT,
      });

      try {
        const result = await axios(requestOptions);

        if (!didCancel) {
          dispatch({
            type: ActionTypes.FETCH_SUCCESS,
            payload: result.data,
          });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({
            type: ActionTypes.FETCH_FAILURE,
          });
        }
      }
    };

    if (requestOptions.postpone !== true) {
      fetchData();
    }
    // When component is destroyed this callback is executed.
    return () => {
      didCancel = true;
    };
    // data passed here is used to compare if the effect should re-run.
    // See: https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects
  }, [requestOptions]);

  const refetch = options => {
    setRequestOptions({ ...options, postpone: false });
  };

  return { ...state, isDirty, isPristine, refetch };
};
