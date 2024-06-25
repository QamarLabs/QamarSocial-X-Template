import React from "react";
import dynamic from "next/dynamic";
import { fetchTweets } from "../../utils/fetchTweets";
const Feed = dynamic(() => import("@components/Feed"), { ssr: false });

async function ExplorePage() {
  const twts = await fetchTweets();

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Feed tweets={twts ?? []} title="Explore" />
    </React.Suspense>
  );
};

export default ExplorePage;