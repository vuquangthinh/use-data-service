import { useState } from "react";
const m = require("use-deep-compare-effect");

const useDeepCompareEffect = m.default;

// by pass warning of deep compare
const EMPTY_OBJECT = {};

export interface ServiceResult {
  success: boolean,
  data: any
}

export type ServiceParams = any;
export type ValueOrPromise<T> = PromiseLike<T> | T

export interface ServiceFn {
  (params: ServiceParams): ValueOrPromise<ServiceResult>
}

export type HookResult = [boolean, any, any];

export default function useDataService(service: ServiceFn, params: ServiceParams) : HookResult {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useDeepCompareEffect(
    () => {
      (async () => {
        if (!loading) {
          setLoading(true);
        }

        const response = await service(params);

        if (response) {
          if (response.success) {
            setData(response.data);
          } else {
            setError(response.data);
          }
          setLoading(false);
        } else {
          // eslint-disable-next-line no-console
          console.warn('invalid error', service, params);
        }
      })();
    },
    [params, EMPTY_OBJECT]
  );

  return [loading, data, error];
}
