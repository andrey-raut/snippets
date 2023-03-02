import type { StringsObjectType } from './searchParamsTypes';

export const getSearchParams = (urlSearchParams: URLSearchParams) => {
  const keys = Array.from(urlSearchParams.keys());
  const params: Record<string, string> = {};
  keys.forEach((key) => {
    params[key] = urlSearchParams.get(key) as string;
  });
  return params;
};

class SearchParamsService {
  private searchParams: StringsObjectType = {};

  private url: URL = new URL(window.location.href);

  private urlSearchParams: URLSearchParams = new URLSearchParams(this.url.search);

  constructor() {
    this.refresh();
  }

  readonly refresh = () => {
    this.url = new URL(window.location.href);
    this.urlSearchParams = new URLSearchParams(this.url.search);
    this.searchParams = getSearchParams(this.urlSearchParams);
  };

  readonly get = () => {
    return this.searchParams;
  };

  readonly getUrl = () => {
    return this.url;
  };

  readonly getUrlSearchParams = () => {
    return this.urlSearchParams;
  };
}

export default new SearchParamsService();
