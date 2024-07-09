import React from "react";
import dynamic from "next/dynamic";
import { fetchBookmarks } from "@utils/user/fetchBookmarks";
import { getServerSession } from "next-auth";
import { getEmailUsername } from "@utils/neo4j";
import { redirect } from "next/navigation";
import TweetComponents from "@components/Tweet";
import { FeedContainer } from "@components/Feed";
import { NoRecordsTitle } from "@components/common/Titles";
const Feed = dynamic(() => import("@components/Feed"), { ssr: false });

async function BookmarksPage() {
  const session = await getServerSession();
  const bookmarks =
    session && session.user
      ? await fetchBookmarks(getEmailUsername(session.user.email!))
      : [];

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <FeedContainer>
        <div>
          {bookmarks && bookmarks.length ? (
            bookmarks.map((bookmark, bookmarkKey) => (
              <TweetComponents
                key={bookmark.tweet._id ?? bookmarkKey}
                tweet={bookmark}
                pushNote={true}
                userId={session?.user ? (session.user as any)["_id"] : ""}
                bookmarks={
                  session?.user ? (session.user as any)["bookmarks"] : ""
                }
                retweets={session?.user ? (session.user as any)["retweets"] : ""}
                likedTweets={
                  session?.user ? (session.user as any)["likedTweets"] : ""
                }
              />
            ))
          ) : (
            <NoRecordsTitle>You have no bookmarks!</NoRecordsTitle>
          )}
        </div>
      </FeedContainer>
    </React.Suspense>
  );
}

export default BookmarksPage;
