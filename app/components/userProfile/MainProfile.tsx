"use client";
// import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  DashboardTweetToDisplay,
  ProfileUser,
  TweetToDisplay,
} from "../../../typings";
import TweetComponents from "../Tweet";
import UserHeader from "./UserHeader";
import Feed from "../Feed";
import { useParams } from "next/navigation";
import { fetchUserTweets } from "@utils/user/fetchUserTweets";
import { fetchUserInfo } from "@utils/user/fetchUserInfo";
import Tabs from "@components/common/Tabs";
import { useSession } from "next-auth/react";
import CustomPageLoader  from "@components/common/CustomLoader";


const MainProfile = () => {
  const { data: session } = useSession();
  const params = useParams();
  const { name } = params;
  const username = name as string;
  const [userTweets, setUserTweets] = useState<DashboardTweetToDisplay[]>();
  const [bookmarkedTweets, setBookmarkedTweets] = useState<DashboardTweetToDisplay[]>();
  const [likedTweets, setLikedTweets] = useState<DashboardTweetToDisplay[]>();
  const [retweetedTweets, setRetweetedTweets] = useState<DashboardTweetToDisplay[]>();
  const [repliedTweets, setRepliedTweets] = useState<DashboardTweetToDisplay[]>();

  const [userInfo, setUserInfo] = useState<ProfileUser | undefined>(undefined);

  useLayoutEffect(() => {
    async function getProfileInfo() {
      const dTwts = await fetchUserTweets(username);
      const uInfo = await fetchUserInfo(username);
      setUserTweets(dTwts?.userTweets);
      setBookmarkedTweets(dTwts?.bookmarkedTweets);
      setLikedTweets(dTwts?.likedTweets);
      setRetweetedTweets(dTwts?.retweetedTweets);
      setRepliedTweets(dTwts?.repliedTweets);
      setUserInfo(uInfo);
      console.log("uInfo:", uInfo);
      console.log('dTwts:', dTwts)
    }

    getProfileInfo();
  }, []);

  // const [user] = useAuthState(auth);
  // const router = useRouter();
  const renderer = useCallback(
    (twt: DashboardTweetToDisplay) => (
      <TweetComponents
        key={twt.tweet._id}
        tweet={twt}
        pushNote={true}
        userId={session && session.user ? (session.user as any)["_id"] : ""}
      />
    ),
    []
  );

  if(!userInfo) {
    return <CustomPageLoader title="Loading..." />;
  }
  return (
    <div className="col-span-7 scrollbar-hide border-x max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
      <div>
        {userInfo && (
          <>
            <UserHeader
              username={userInfo.user.username}
              avatar={userInfo.user.avatar}
              bgThumbnail={userInfo.user.bgThumbnail}
            />
            <React.Suspense fallback={<h2>Loading...</h2>}>
              <Tabs
                tabs={[
                  {
                    tabKey: "recent",
                    title: "Recent",
                    content: userTweets ?? [],
                    renderer,
                  },
                  {
                    tabKey: "retweets",
                    title: "Retweets",
                    content: retweetedTweets ?? [],
                    renderer,
                  },
                  {
                    tabKey: "bookmarks",
                    title: "Bookmarks",
                    content: bookmarkedTweets ?? [],
                    renderer,
                  },
                  {
                    tabKey: "replied-tweets",
                    title: "Replies",
                    content: repliedTweets ?? [],
                    renderer,
                  },
                  {
                    tabKey: "liked-tweets",
                    title: "Liked Tweets",
                    content: likedTweets ?? [],
                    renderer,
                  },
                ]}
              />
            </React.Suspense>
          </>
        )}
      </div>
      {/* <div>
        {tweets.map((tweet) => (
          <div key={tweet._id}>
            {tweet.username === userName && (
              <TweetComponents
                tweet={tweet}
                userId={user ? (user as any)['id'] : ""}
                setUserPName={setUserPName}
                userName={userName}
                setUserPhotoUrl={setUserPhotoUrl}
                pushNote={false}
              />
            )}
          </div>
        ))}
      </div> */}
    </div>
  );
};
export default MainProfile;
