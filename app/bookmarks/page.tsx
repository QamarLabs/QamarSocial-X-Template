import React from "react";
import dynamic from "next/dynamic";
import { fetchTweets } from "../../utils/fetchTweets";
const Feed = dynamic(() => import("@components/Feed"), { ssr: false });

async function BookmarksPage() {
  const bookmarks = await fetchTweets();

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Feed tweets={bookmarks ?? []} title="Bookmarks" />
    </React.Suspense>
  );
};

export default BookmarksPage;