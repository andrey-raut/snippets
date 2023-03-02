import * as searchParamsUtils from './searchParamsUtils';
import useSearchParamsValues from './useSearchParamsValues';
import type { StringsObjectType, SetParamOptionsType } from './searchParamsTypes';

type PartialParamsDataType<D extends StringsObjectType = StringsObjectType> = Partial<{
  [key in keyof D]: D[key] | null;
}>;

const useSimpleSearchParams = <D extends StringsObjectType = StringsObjectType>() => {
  const params = useSearchParamsValues<D>();

  return {
    values: params,
    setOne: searchParamsUtils.setOneParam as <K extends keyof D>(
      key: K,
      value: D[K],
      options?: SetParamOptionsType,
    ) => void,
    setMany: searchParamsUtils.setManyParams as (
      params: PartialParamsDataType<D>,
      options?: SetParamOptionsType
    ) => void,
    setAll: searchParamsUtils.setAllParams as (
      params: PartialParamsDataType<D>,
      options?: SetParamOptionsType
    ) => void,
    deleteOne: searchParamsUtils.deleteOneParam as <K extends keyof D>(
      key: K,
      options?: SetParamOptionsType,
    ) => void,
    deleteMany: searchParamsUtils.deleteManyParams as unknown as (
      keys: keyof D[],
      options?: SetParamOptionsType,
    ) => void,
    clear: searchParamsUtils.clearParams,
  };
};

export const createUseSimpleSearchParams = <D extends StringsObjectType>() => {
  return () => useSimpleSearchParams<D>();
};

export default useSimpleSearchParams;
