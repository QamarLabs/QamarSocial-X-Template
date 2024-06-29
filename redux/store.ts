import { configureStore, createListenerMiddleware, ListenerMiddleware } from '@reduxjs/toolkit';
import searchSlice, { setSearchedTweets } from './slices/search';
import { fetchTweets } from '@utils/tweets/fetchTweets';

const createStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      search: searchSlice
    },
    preloadedState
  });
};

const listenerMiddleware = createListenerMiddleware();

const store = configureStore({
  reducer: {
    search: searchSlice
  },
  middleware: (getDefaultMiddleware) =>  getDefaultMiddleware().prepend(listenerMiddleware.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  predicate: (_action, currentState, previousState) => {
    return currentState.search.searchQry != previousState.search.searchQry;
  },
  effect: async (_action, listenerApi) => {
    //Debounce
    listenerApi.cancelActiveListeners();
    await listenerApi.delay(5000);

    const searchState = listenerApi.getState().search;
    const tweetsSearched = await fetchTweets({
      page: searchState.page,
      limit: searchState.limit,
      search_term: searchState.searchQry
    });

    listenerApi.dispatch(setSearchedTweets(tweetsSearched!))
  }
});

export default createStore;
