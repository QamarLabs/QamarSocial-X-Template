import {
  setExploreSearchParams,
  setExploreTweets
} from "@localredux/slices/explore";
import { setFeedSearchParams, setFeedTweets } from "@localredux/slices/feed";
import { setSearchedTweets, setSearchParams } from "@localredux/slices/search";
import { AppDispatch, FilterKeys } from "@localredux/store";
import { Params } from "@utils/neo4j";
import { TweetToDisplay } from "typings";

export const setTweets = (
  dispatch: AppDispatch,
  filterKey: FilterKeys,
  tweets: TweetToDisplay[]
) => {
  if (filterKey === FilterKeys.Explore)
    return dispatch(setExploreTweets(tweets));
  else if (filterKey === FilterKeys.Search)
    return dispatch(setSearchedTweets(tweets));
  else return dispatch(setFeedTweets(tweets));
};

export const setFilterState = (
  dispatch: AppDispatch,
  filterKey: FilterKeys,
  params: Params
) => {
  if (filterKey === FilterKeys.Explore)
    return dispatch(setExploreSearchParams(params));
  else if (filterKey === FilterKeys.Search)
    return dispatch(setSearchParams(params));
  else return dispatch(setFeedSearchParams(params));
};
