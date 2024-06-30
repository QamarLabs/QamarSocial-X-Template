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

interface Props {
  title: string;
  tweets?: TweetToDisplay[];
  searchServer?: boolean;
  hideTweetBox?: boolean;
}

function Feed({ title, searchServer, hideTweetBox }: Props) {
  const { data: session } = useSession();
  const { user } = session ?? {};
  const { searchParams, setSearchParams, tweets, setTweets } = useGetTweets(searchServer ?? false);
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
        {(tweets ?? []).map((tweet, tweetKey) => (
          <TweetComponents
            key={tweet.tweet._id ?? tweetKey}
            tweet={tweet}
            pushNote={true}
            userId={user ? (user as any)["_id"] : ""}
            bookmarks={user ? (user as any)["bookmarks"] : ""}
          />
        ))}
      </div>
    </div>
  );
}

export default Feed;
