import React from 'react';
import _uniq from 'lodash/uniq';

import * as searchParamsUtils from './searchParamsUtils';
import useSearchParamsValues from './useSearchParamsValues';
import SearchParamsItem from './SearchParamsItem';
import type {
  GenericSearchParamsOptionsType,
  SearchParamsOptionsType,
  SearchParamsItemOptionsType,
  SetParamOptionsType,
} from './searchParamsTypes';

export { default as searchParamsService } from './searchParamsService';
export * from './searchParamsTypes';
export { default as useSearchParamsValues } from './useSearchParamsValues';
export { default as useSimpleSearchParams, createUseSimpleSearchParams } from './useSimpleSearchParams';

const useSearchParams = <D extends object>(
  initialOptions?: SearchParamsOptionsType<D>,
  genericOptions?: GenericSearchParamsOptionsType,
) => {
  const urlParams = useSearchParamsValues();
  const initialOptionsRef = React.useRef(initialOptions);
  const genericOptionsRef = React.useRef(genericOptions);
  const toolsRef = React.useRef({
    paramsHelpers: {} as Partial<Record<keyof D, SearchParamsItem>>,
    requiredParams: [] as string[],
    defaultHelper: new SearchParamsItem({
      key: '',
      encoding: genericOptions?.encoding,
    }),
  });

  const {
    setOne,
    setMany,
    setAll,
    deleteOne,
    deleteMany,
    clear,
  } = React.useMemo(() => {
    const paramsHelpers = {} as Partial<Record<keyof D, SearchParamsItem>>;
    const requiredParams = [] as string[];
    const { defaultHelper } = toolsRef.current;

    toolsRef.current.paramsHelpers = paramsHelpers;
    toolsRef.current.requiredParams = requiredParams;

    Object.entries(initialOptionsRef.current || {}).forEach((entry) => {
      const key = entry[0] as keyof D;
      const setting = entry[1] as SearchParamsItemOptionsType;
      const helper = new SearchParamsItem({
        key: key as string,
        rename: setting.rename,
        defaultValue: setting.defaultValue,
        encoding: setting.encoding ?? genericOptionsRef.current?.encoding,
        jsonify: setting.jsonify ?? genericOptionsRef.current?.jsonify,
      });
      if (helper.defaultValue !== undefined) {
        requiredParams.push(helper.urlKey);
      }
      paramsHelpers[key] = helper;
    });

    const getUrlKeyAndHelper = (key: keyof D) => {
      const helper = paramsHelpers[key] || defaultHelper;

      const urlKey = helper.urlKey || key as string;
      return [urlKey, helper] as const;
    };

    const prepareKeyValueForSet = (key: keyof D, value: unknown | null) => {
      const [urlKey, helper] = getUrlKeyAndHelper(key);

      const formattedValue = helper.formatValueBeforeSet(value);
      return [urlKey, formattedValue] as const;
    };

    const prepateParamsForSet = (params: Partial<D>) => {
      const formattedParams: Record<string, string | null> = {};

      Object.entries(params).forEach(([key, value]) => {
        const [urlKey, formattedValue] = prepareKeyValueForSet(key as keyof D, value);

        formattedParams[urlKey] = formattedValue;
      });

      return formattedParams;
    };

    const getOptions = (options?: SetParamOptionsType) => ({
      ...genericOptionsRef.current?.navigateOptions,
      ...options,
    });

    const setOne = <K extends keyof D>(
      key: K,
      value: D[K] | null,
      options?: SetParamOptionsType,
    ) => {
      const [urlKey, formattedValue] = prepareKeyValueForSet(key, value);

      searchParamsUtils.setOneParam(urlKey, formattedValue, getOptions(options));
    };

    const setMany = (
      params: Partial<D>,
      options?: SetParamOptionsType,
    ) => {
      const formattedParams = prepateParamsForSet(params);

      searchParamsUtils.setManyParams(formattedParams, getOptions(options));
    };

    const setAll = (
      params: Partial<D>,
      options?: SetParamOptionsType,
    ) => {
      const formattedParams = prepateParamsForSet(params) as Record<string, string>;

      searchParamsUtils.setAllParams(formattedParams, getOptions(options));
    };

    const deleteOne = (key: keyof D, options?: SetParamOptionsType) => {
      const [urlKey] = getUrlKeyAndHelper(key);

      searchParamsUtils.deleteOneParam(urlKey, getOptions(options));
    };

    const deleteMany = (keys: (keyof D)[], options?: SetParamOptionsType) => {
      const urlKeys = keys.map((key) => {
        const [urlKey] = getUrlKeyAndHelper(key);
        return urlKey;
      });

      searchParamsUtils.deleteManyParams(urlKeys, getOptions(options));
    };

    const clear = (options?: SetParamOptionsType) => {
      searchParamsUtils.clearParams(getOptions(options));
    };

    return {
      setOne,
      setMany,
      setAll,
      deleteOne,
      deleteMany,
      clear,
    };
  }, []);

  const params = React.useMemo(() => {
    const {
      paramsHelpers,
      requiredParams,
      defaultHelper,
    } = toolsRef.current;

    const params = {} as Partial<D>;

    const keys = _uniq([...Object.keys(urlParams), ...requiredParams]);

    keys.forEach((key) => {
      const helper = (Object.values(paramsHelpers) as SearchParamsItem[]).find((helper) => {
        return helper.urlKey === key;
      }) || defaultHelper;

      const value = helper.parseIncomingValue(urlParams[key]);
      params[(helper.key || key) as keyof D] = value as D[keyof D];
    });

    return params;
  }, [urlParams]);

  return {
    values: params,
    setOne,
    setMany,
    setAll,
    deleteOne,
    deleteMany,
    clear,
  };
};

export const createUseSearchParams = <D extends object>(
  options?: SearchParamsOptionsType<D>,
  genericOptions?: GenericSearchParamsOptionsType,
) => {
  return () => useSearchParams<D>(options, genericOptions);
};

export default useSearchParams;
