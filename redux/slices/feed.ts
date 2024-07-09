import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Params } from '@utils/neo4j';
import { ReduxFeedState, TweetToDisplay } from 'typings';

const initialState: ReduxFeedState = {
  searchQry: '',
  page: 1,
  limit: 20,
  feedTweets: []
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState: initialState,
  reducers: {
    setNewPage: (state, { payload:newPage}: PayloadAction<number>) => {
      state.page = newPage;
    },
    setSearchQry: (state, { payload:newSearchQry }: PayloadAction<string>) => {
      state.searchQry = newSearchQry;
    },
    setSearchParams: (state, { payload: searchParams }: PayloadAction<Params>) => {
      state.page = searchParams.page!;
      state.limit = searchParams.limit!;
      state.searchQry = searchParams.search_term!;
    },
    setFeedTweets: (state, { payload:newFeedTweets }: PayloadAction<TweetToDisplay[]>) => {
      state.feedTweets = newFeedTweets;
    },
    resetFeedState: () => initialState
  },
});

export const { setNewPage, setSearchParams, setSearchQry, setFeedTweets, resetFeedState } = feedSlice.actions;

export default feedSlice.reducer;
