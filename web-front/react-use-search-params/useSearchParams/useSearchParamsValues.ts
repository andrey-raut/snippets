import React from 'react';

import type { historyChangeEvent } from './extendHistoryChanges';
import { HISTORY_CHANGE_EVENT_NAME } from './extendHistoryChanges';
import type { StringsObjectType } from './searchParamsTypes';
import searchParamsService from './searchParamsService';

const useSearchParamsValues = <D extends StringsObjectType = StringsObjectType>() => {
  const [params, setParamsState] = React.useState(searchParamsService.get());

  React.useEffect(() => {
    const handleHistoryChange = ((ev: typeof historyChangeEvent) => {
      setParamsState(ev.detail.params);
    }) as (ev: Event) => void;

    window.addEventListener(HISTORY_CHANGE_EVENT_NAME, handleHistoryChange);

    return () => {
      window.removeEventListener(HISTORY_CHANGE_EVENT_NAME, handleHistoryChange);
    };
  }, []);

  return params as Partial<D>;
};

export default useSearchParamsValues;
