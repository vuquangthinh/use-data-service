import { useReducer } from "react";
const m = require("use-deep-compare-effect");

const useDeepCompareEffect = m.default;

// by pass warning of deep compare
const EMPTY_OBJECT = {};

export interface ServiceResult {
  success: boolean,
  data: any,
  error: any
}

export type ServiceParams = any;
export type ValueOrPromise<T> = PromiseLike<T> | T

export interface ServiceFn {
  (params: ServiceParams): ValueOrPromise<ServiceResult>
}

export type HookResult = [boolean, any, any];

function reducer(
  state : any, { payload, type } : any) {
  switch (type) {
    case 'replace_state':
      return { ...state, ...payload };
    default:
      return state;
  }
}
 
export default function useDataService(service: ServiceFn, params: ServiceParams) : HookResult {
  const [{ loading, data, error }, dispatch] = useReducer(reducer, {
    loading: false,
    data: {},
    error: null,
  });

  useDeepCompareEffect(
    () => {
      let isMounted = true;
      (async () => {
        if (!loading) {
          isMounted && dispatch({ type: 'replace_state', payload: { loading: true }});
        }

        const response = await service(params);

        if (response) {
          if (response.success) {
            isMounted && dispatch({ type: 'replace_state', payload: { loading: false, data: response.data, error: null }});
          } else {
            isMounted && dispatch({ type: 'replace_state', payload: { loading: false, error: response.error }});
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn('invalid error', service, params);
        }
      })();
      return () => {
        isMounted = false;
      }
    },
    [params, EMPTY_OBJECT]
  );

  return [loading, data, error];
}
