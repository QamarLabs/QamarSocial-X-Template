"use client";
import React, { useEffect, useMemo, useState } from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import {
  DashboardTweetToDisplay,
  ReduxExploreState,
  ReduxFeedState,
  ReduxSearchState,
  TweetToDisplay,
} from "../../typings";
import TweetComponents from "./Tweet";
import { fetchTweets } from "../../utils/tweets/fetchTweets";
import toast from "react-hot-toast";

import { useSession } from "next-auth/react";
import TweetBox from "./TweetBox";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, FilterKeys, RootState } from "@localredux/store";
import { setFilterState, setTweets } from "@utils/redux";
import { useSearchParams } from "next/navigation";
import { convertQueryStringToObject, Params } from "@utils/neo4j";
import CustomPageLoader from "./common/CustomLoader";

interface Props {
  title?: string;
  filterKey?: FilterKeys;
  hideTweetBox?: boolean;
  tweets?: TweetToDisplay[] | DashboardTweetToDisplay[];
}

function FeedContainer({ children }: React.PropsWithChildren<any>) {
  return (
    <div className="col-span-7 scrollbar-hide border-x max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
      {children}
    </div>
  );
}

function Feed({ title, filterKey, hideTweetBox, tweets }: Props) {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { user } = session ?? {};
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const filterState = useSelector((store: RootState) => {
    if (filterKey === FilterKeys.Explore) return store.explore;
    else if (filterKey === FilterKeys.Search) return store.search;
    else return store.feed;
  });

  useEffect(() => {
    async function getTweets() {
      setLoading(true);
      try {
        const paramsFromQryString = convertQueryStringToObject(
          window.location.search
        );
        if (
          JSON.stringify(paramsFromQryString) !==
          JSON.stringify({
            page: filterState.page,
            limit: filterState.limit,
            search_term: filterState.searchQry,
          } as Params)
        )
          setFilterState(dispatch, filterKey!, paramsFromQryString);

        const twts = await fetchTweets({
          page: paramsFromQryString.page,
          limit: paramsFromQryString.limit,
          search_term: paramsFromQryString.search_term,
        });

        setTweets(dispatch, filterKey!, twts!);
      } finally {
        setLoading(false);
      }
    }

    if (!filterKey) return;

    getTweets();
  }, [searchParams]);

  const loadedTweets = useMemo(() => {
    if (filterKey === FilterKeys.Explore)
      return (filterState as ReduxExploreState).exploreTweets;
    else if (filterKey === FilterKeys.Search)
      return (filterState as ReduxSearchState).searchedTweets;
    else return (filterState as ReduxFeedState).feedTweets;
  }, [filterState]);

  return (
    <div className="col-span-7 scrollbar-hide border-x max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
      <div>
        {session && !hideTweetBox && (
          <TweetBox filterKey={filterKey ? filterKey : FilterKeys.Normal} />
        )}
      </div>
      <div>
        {loading ? (
          <CustomPageLoader title="Loading" />
        ) : (
          <>
            {(tweets ? tweets : loadedTweets ?? []).map((tweet, tweetKey) => (
              <TweetComponents
                key={tweet.tweet._id ?? tweetKey}
                tweet={tweet}
                pushNote={true}
                userId={user ? (user as any)["_id"] : ""}
                bookmarks={user ? (user as any)["bookmarks"] : ""}
                retweets={user ? (user as any)["retweets"] : ""}
                likedTweets={user ? (user as any)["likedTweets"] : ""}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export { FeedContainer };

export default Feed;
