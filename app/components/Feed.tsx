"use client";
import React, { useEffect, useState } from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import { TweetToDisplay } from "../../typings";
import TweetComponents from "./Tweet";
import { fetchTweets } from "../../utils/tweets/fetchTweets";
import toast from "react-hot-toast";

import { useSession } from "next-auth/react";
import TweetBox from "./TweetBox";
import useGetTweets from "hooks/useGetTweets";
import { useSelector } from "react-redux";
import { RootState } from "@localredux/store";

interface Props {
  title: string;
  searchServer?: boolean;
  hideTweetBox?: boolean;
  tweets?: TweetToDisplay[];
}

function FeedContainer({ children }: React.PropsWithChildren<any>) {
  return (
    <div className="col-span-7 scrollbar-hide border-x max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
      {children}
    </div>
  );
}

function Feed({ title, searchServer, hideTweetBox }: Props) {
  const { data: session } = useSession();
  const { user } = session ?? {};
  // let feedKey = "";
  // let stateKey = "";
  // if(type === TypeOfFeed.Explore) {
  //   stateKey = "explore";
  //   feedKey = 'exploreTweets';
  // } else if (type === TypeOfFeed.Search) {
  //   stateKey = "search";
  //   feedKey = 'searchTweets';
  // } else {
  //   stateKey = "feed";
  //   feedKey = 'feedTweets';
  // }
  // const stateStore = useSelector((store: RootState) => store[stateKey as keyof RootState])
  const { searchParams, setSearchParams, tweets, setTweets } = useGetTweets(
    searchServer ?? false
  );
  // alert(JSON.stringify(tweets));
  return (
    <div className="col-span-7 scrollbar-hide border-x max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
      <div>
        {session && !hideTweetBox && (
          <TweetBox
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            tweets={tweets}
            setTweets={setTweets}
          />
        )}
      </div>
      <div>
        <React.Suspense fallback={<h1>Loading...</h1>}>
          {(tweets ?? []).map((tweet, tweetKey) => (
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
        </React.Suspense>
      </div>
    </div>
  );
}

export { FeedContainer };

export default Feed;
