import dynamic from "next/dynamic";
import React, { Suspense, useState } from "react";
const TweetComponent = dynamic(() => import("../../components/Tweet"), {
  ssr: false,
});
import { fetchTweet } from "@utils/fetchTweet";
import { getServerSession } from "next-auth";

interface StatusPageProps {
  params: {
    status_id: string;
  };
}

async function getTweetData(status_id: string) {
  const tweet = await fetchTweet(status_id);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!tweet) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return tweet;
}

const StatusPage = async ({ params }: StatusPageProps) => {
  const session = await getServerSession();
  const { user } = session ?? {};
  const tweet = await getTweetData(params.status_id);
  debugger;
  return (
    <div className="col-span-7 scrollbar-hide border-x max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
      <div className="flex items-center justify-between">
        {/* <h1>User Status</h1> */}
        {/* <p>{JSON.stringify(tweet)}</p> */}
        <Suspense fallback={<h4 className="text-body">Loading...</h4>}>
          <TweetComponent
            tweet={tweet}
            pushNote={true}
            userId={user ? (user as any)["_id"] : ""}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default StatusPage;