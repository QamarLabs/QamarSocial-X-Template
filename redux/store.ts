import { configureStore, createListenerMiddleware, ListenerMiddleware } from '@reduxjs/toolkit';
import searchSlice, { setSearchedTweets } from './slices/search';
import feedSlice, { setFeedTweets } from './slices/feed';
import exploreSlice, { setExploreTweets } from './slices/explore';
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
    search: searchSlice,
    feed: feedSlice,
    explore: exploreSlice
  },
  middleware: (getDefaultMiddleware) =>  getDefaultMiddleware().prepend(listenerMiddleware.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  predicate: (_action, currentState, previousState) => {
    return currentState.explore.searchQry != previousState.explore.searchQry || currentState.explore.topicToExplore != previousState.explore.topicToExplore;
  },
  effect: async (_action, listenerApi) => {
    //Debounce
    listenerApi.cancelActiveListeners();
    await listenerApi.delay(5000);

    const exploreState = listenerApi.getState().explore;
    const exploreTweets = await fetchTweets({
      page: exploreState.page,
      limit: exploreState.limit,
      search_term: exploreState.topicToExplore ? exploreState.topicToExplore : exploreState.searchQry,
    });

    listenerApi.dispatch(setExploreTweets(exploreTweets!))
  }
});


listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  predicate: (_action, currentState, previousState) => {
    return currentState.feed.searchQry != previousState.feed.searchQry;
  },
  effect: async (_action, listenerApi) => {
    //Debounce
    listenerApi.cancelActiveListeners();
    await listenerApi.delay(5000);

    const feedState = listenerApi.getState().feed;
    const tweetsOnFeed = await fetchTweets({
      page: feedState.page,
      limit: feedState.limit,
      search_term: feedState.searchQry
    });

    listenerApi.dispatch(setFeedTweets(tweetsOnFeed!))
  }
});

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
