import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Params } from '@utils/neo4j';
import { ReduxSearchState, TweetToDisplay } from 'typings';

const initialState: ReduxSearchState = {
  searchQry: '',
  page: 1,
  limit: 20,
  searchedTweets: []
};

export const searchSlice = createSlice({
  name: 'search',
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
    setSearchedTweets: (state, { payload:newFilteredTweets }: PayloadAction<TweetToDisplay[]>) => {
      state.searchedTweets = newFilteredTweets;
    },
    resetSearchState: () => initialState
  },
});

export const { setNewPage, setSearchParams, setSearchQry, setSearchedTweets, resetSearchState } = searchSlice.actions;

export default searchSlice.reducer;
