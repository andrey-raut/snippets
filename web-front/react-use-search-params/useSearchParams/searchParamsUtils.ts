import searchParamsService from './searchParamsService';
import type { SetParamOptionsType } from './searchParamsTypes';

const changeHistoryState = (
  url: URL,
  searchParams: URLSearchParams,
  options?: SetParamOptionsType,
) => {
  // eslint-disable-next-line no-param-reassign
  url.search = searchParams.toString();

  const args = [options?.state, '', url] as const;
  if (options?.replace) {
    window.history.replaceState(...args);
  } else {
    window.history.pushState(...args);
  }
};

const getUrlAndSearchParams = () => {
  const url = searchParamsService.getUrl();
  const searchParams = searchParamsService.getUrlSearchParams();

  return { url, searchParams };
};

export const setOneParam = (key: string, value: string | null, options?: SetParamOptionsType) => {
  const { url, searchParams } = getUrlAndSearchParams();

  if (value === null) {
    searchParams.delete(key);
  } else {
    searchParams.set(key, value);
  }

  changeHistoryState(url, searchParams, options);
};

export const setManyParams = (
  params: Record<string, string | null>,
  options?: SetParamOptionsType,
) => {
  const { url, searchParams } = getUrlAndSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      return searchParams.delete(key);
    }
    searchParams.set(key, value);
  });

  changeHistoryState(url, searchParams, options);
};

export const setAllParams = (params: Record<string, string>, options?: SetParamOptionsType) => {
  const url = searchParamsService.getUrl();
  const searchParams = new URLSearchParams('');

  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  changeHistoryState(url, searchParams, options);
};

export const deleteOneParam = (key: string, options?: SetParamOptionsType) => {
  const { url, searchParams } = getUrlAndSearchParams();

  searchParams.delete(key);

  changeHistoryState(url, searchParams, options);
};

export const deleteManyParams = (keys: string[], options?: SetParamOptionsType) => {
  const { url, searchParams } = getUrlAndSearchParams();

  keys.forEach((key) => {
    searchParams.delete(key);
  });

  changeHistoryState(url, searchParams, options);
};

export const clearParams = (options?: SetParamOptionsType) => {
  setAllParams({}, options);
};
