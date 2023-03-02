export type StringsObjectType = Record<string, string>;

export type SetParamOptionsType = {
  replace?: boolean;
  state?: unknown;
};

export type GenericSearchParamsOptionsType = {
  navigateOptions?: SetParamOptionsType;
  encoding?: boolean;
  jsonify?: boolean;
};

export type SearchParamsItemOptionsType<D = unknown> = GenericSearchParamsOptionsType & {
  defaultValue?: D;
  rename?: string;
};

export type SearchParamsOptionsType<D extends object> = Partial<{
  [key in keyof D]: SearchParamsItemOptionsType<D[key]>;
}>;
