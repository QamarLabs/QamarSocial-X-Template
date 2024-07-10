import React from "react";
import dynamic from "next/dynamic";
import { fetchTweets } from "../../utils/tweets/fetchTweets";
import { FilterKeys } from "@localredux/store";
const Feed = dynamic(() => import("@components/Feed"), { ssr: false });

async function ExplorePage() {

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Feed title="Explore" filterKey={FilterKeys.Explore} />
    </React.Suspense>
  );
};

export default ExplorePage;