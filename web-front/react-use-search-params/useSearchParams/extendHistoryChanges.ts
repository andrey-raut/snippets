import searchParamsService from './searchParamsService';

export const HISTORY_PUSH_EVENT_NAME = 'historyPush';
export const historyPushEvent = new CustomEvent(HISTORY_PUSH_EVENT_NAME);

export const HISTORY_REPLACE_EVENT_NAME = 'historyReplace';
export const historyReplaceEvent = new CustomEvent(HISTORY_REPLACE_EVENT_NAME);

export const HISTORY_CHANGE_EVENT_NAME = 'historyChange';
export const historyChangeEvent = new CustomEvent(
  HISTORY_CHANGE_EVENT_NAME,
  { detail: { params: {} as Record<string, string> } },
);

const dispatchHistoryChangeEvent = () => {
  searchParamsService.refresh();
  historyChangeEvent.detail.params = searchParamsService.get();
  window.dispatchEvent(historyChangeEvent);
};

window.history.pushState = new Proxy(window.history.pushState, {
  apply(target, thisArg, argList: Parameters<typeof window.history.pushState>) {
    target.apply(thisArg, argList);

    window.dispatchEvent(historyPushEvent);
    dispatchHistoryChangeEvent();
  },
});

window.history.replaceState = new Proxy(window.history.replaceState, {
  apply(target, thisArg, argList: Parameters<typeof window.history.replaceState>) {
    target.apply(thisArg, argList);

    window.dispatchEvent(historyReplaceEvent);
    dispatchHistoryChangeEvent();
  },
});

window.addEventListener('popstate', () => {
  dispatchHistoryChangeEvent();
});
