import type { SearchParamsItemOptionsType } from './searchParamsTypes';

class SearchParamsItem {
  key: string;

  encoding: boolean;

  jsonify: boolean;

  defaultValue: unknown;

  urlKey: string;

  constructor(options: SearchParamsItemOptionsType & { key: string }) {
    this.key = options.key;
    this.urlKey = options.rename || options.key;
    this.encoding = options.encoding ?? false;
    this.jsonify = options.jsonify ?? false;
    this.defaultValue = options.defaultValue;
  }

  formatValueBeforeSet = (value: unknown) => {
    if (value === null) {
      return value;
    }

    let formattedValue = value as string;

    if (this.jsonify) {
      formattedValue = JSON.stringify(formattedValue);
    }

    if (this.encoding) {
      formattedValue = window.btoa(formattedValue);
    }

    return formattedValue;
  };

  parseIncomingValue = (value: unknown) => {
    let formattedValue = value as string;

    try {
      if (this.encoding) {
        formattedValue = window.atob(formattedValue);
      }

      if (this.jsonify) {
        formattedValue = JSON.parse(formattedValue);
      }
    } catch {
      return formattedValue ?? this.defaultValue;
    }

    return formattedValue ?? this.defaultValue;
  };
}

export default SearchParamsItem;
