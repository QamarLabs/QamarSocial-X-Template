"use client";
import React, { useEffect, useState } from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import TweetBox from "./TweetBox";
import { Tweet } from "../../typings";
import TweetComponents from "./Tweet";
import { fetchTweets } from "../../utils/fetchTweets";
import toast, { Toaster } from "react-hot-toast";
import { GetServerSideProps } from "next";
import { Params } from "@utils/index";
import { useSession } from "next-auth/react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../firebase/firebase";



interface Props {
  title: string;
  tweets: Tweet[];
  params?: Params | undefined;
}

function Feed({ title, params, tweets }: Props) {
  const { data: session } = useSession();
  const { user  } = session ?? {};

  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);

  const handleRefFunction = async () => {
    const refreshTost = toast.loading("Refreshing...");

    const tweets = await fetchTweets();
    setFilteredTweets(tweets as Tweet[]);

    toast.success("Feed Updated!", {
      id: refreshTost,
    });
  };

  return (
    <div className="col-span-7 scrollbar-hide border-x max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <h1 className="p-5 pb-0 text-xl font-bold">{title}</h1>
        <RefreshIcon
          onClick={handleRefFunction}
          className="h-8 w-8 cursor-pointer text-twitter
        mr-5 mt-5 transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
        />
      </div>
      {/* <div>{user && <TweetBox setTweets={setTweets} />}</div> */}
      <div>
        {(tweets ?? []).map((tweet, tweetKey) => (
          <TweetComponents
          key={tweet._id  ?? tweetKey} tweet={tweet} pushNote={true} userId={user ? (user as any)['_id'] : ""}  />
        ))}
      </div>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   try {
//     const tweets = await fetchTweets();

//     return {
//       props: {
//         tweets,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching tweets:', error);
//     return {
//       props: {
//         tweets: [],
//       },
//     };
//   }
// };

export default Feed;