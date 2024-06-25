"use client";
// import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Tweet, User } from "../../../typings";
import TweetComponents from "../Tweet";
import UserHeader from "./UserHeader";
import Feed from "../Feed";
// import { useSession } from "next-auth/react";

type MainProfileProps = {
  tweets: Tweet[];
  userInfo: User;
};

const MainProfile: React.FC<MainProfileProps> = ({ tweets: tweetProp, userInfo }) => {
  // const { data: session } = useSession();
  const [tweets, setTweets] = useState<Tweet[]>(tweetProp);
  const [userPName, setUserPName] = useState();
  const [userPhotoUrl, setUserPhotoUrl] = useState();
  // const [user] = useAuthState(auth);
  // const router = useRouter();

  return (
    <div className="col-span-7 scrollbar-hide border-x max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
      <div>
        {userInfo && (
          <UserHeader userPName={userPName} userPhotoUrl={userPhotoUrl} />
        )}
      </div>
      <Feed 
        tweets={tweetProp}
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
