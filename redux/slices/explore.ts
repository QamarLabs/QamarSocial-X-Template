import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Params } from '@utils/neo4j';
import { ReduxExploreState, TweetToDisplay } from 'typings';

const initialState: ReduxExploreState = {
  searchQry: '',
  page: 1,
  limit: 20,
  exploreTweets: [],
  topicToExplore: ''
};

export const exploreSlice = createSlice({
  name: 'explore',
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
    setExploreTweets: (state, { payload:newExploreTweets }: PayloadAction<TweetToDisplay[]>) => {
      state.exploreTweets = newExploreTweets;
    },
    resetExploreState: () => initialState
  },
});

export const { setNewPage, setSearchParams, setSearchQry, setExploreTweets, resetExploreState } = exploreSlice.actions;

export default exploreSlice.reducer;
