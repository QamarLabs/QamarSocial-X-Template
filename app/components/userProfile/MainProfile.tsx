"use client";
// import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  ProfileUser,
  TweetToDisplay,
  User,
  UserProfileTweets,
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
  const [tweets, setTweets] = useState<UserProfileTweets>();
  const [userInfo, setUserInfo] = useState<ProfileUser | undefined>(undefined);

  useLayoutEffect(() => {
    async function getProfileInfo() {
      const twts = await fetchUserTweets(username);
      const uInfo = await fetchUserInfo(username);
      setTweets(twts);
      setUserInfo(uInfo);
      console.log("uInfo:", uInfo);
    }

    getProfileInfo();
  }, []);

  // const [user] = useAuthState(auth);
  // const router = useRouter();
  const renderer = useCallback(
    (twt: TweetToDisplay) => (
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
                    content: tweets?.userTweets ?? [],
                    renderer,
                  },
                  {
                    tabKey: "retweets",
                    title: "Retweets",
                    content: tweets?.retweetedTweets ?? [],
                    renderer,
                  },
                  {
                    tabKey: "bookmarks",
                    title: "Bookmarks",
                    content: tweets?.bookmarkedTweets ?? [],
                    renderer,
                  },
                  {
                    tabKey: "replied-tweets",
                    title: "Replies",
                    content: tweets?.commentedTweets ?? [],
                    renderer,
                  },
                  {
                    tabKey: "liked-tweets",
                    title: "Liked Tweets",
                    content: tweets?.retweetedTweets ?? [],
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
