"use client";
// import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProfileUser, TweetToDisplay, User, UserProfileTweets } from "../../../typings";
import TweetComponents from "../Tweet";
import UserHeader from "./UserHeader";
import Feed from "../Feed";
import { useParams } from "next/navigation";
import { fetchUserTweets } from "@utils/user/fetchUserTweets";
import { fetchUserInfo } from "@utils/user/fetchUserInfo";

const MainProfile= () => {
  // const { data: session } = useSession();
  const params = useParams();
  const { name } = params;
  const username = name as string;
  const [tweets, setTweets] = useState<UserProfileTweets>();
  const [userInfo, setUserInfo] = useState<ProfileUser | undefined>(undefined);

  useEffect(
    () => {
      async function getProfileInfo() {
        const twts = await fetchUserTweets(username);
        const uInfo = await fetchUserInfo(username);
        setTweets(twts);
        setUserInfo(uInfo);
      }

      getProfileInfo();
    },
    []
  )

  // const [user] = useAuthState(auth);
  // const router = useRouter();

  return (
    <div className="col-span-7 scrollbar-hide border-x max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
      <div>
        {userInfo && (
          <UserHeader username={userInfo.user.username} avatar={userInfo.user.avatar} bgThumbnail={userInfo.user.bgThumbnail} />
        )}
      </div>
      <Feed
        title={`${userInfo ? userInfo.user.username + " Tweets" : ""}`}
        tweets={tweets?.userTweets ?? []}
      />
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
