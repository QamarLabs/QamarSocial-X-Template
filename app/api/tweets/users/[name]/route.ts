// app/api/tweets/[tweet_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { defineDriver, read } from "@utils/neo4j/neo4j";

async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;
  const username = name as string;

  if (!username) {
    return new NextResponse("User ID is required", { status: 400 });
  }

  const driver = defineDriver();
  const session = driver.session();

  try {
    // Adjust the Cypher query to fetch the tweet by ID
    const userTweets = await read(
      session,
      `
        MATCH (user:User {username: $username})
        OPTIONAL MATCH (user)-[:LIKES]->(likedTweet:Tweet)
        OPTIONAL MATCH (user)-[:RETWEETED]->(retweetedTweet:Tweet)
        OPTIONAL MATCH (user)-[:BOOKMARKED]->(bookmarkedTweet:Tweet)
        OPTIONAL MATCH (user)-[:POSTED]->(comment:Comment)-[:HAS_COMMENT]->(commentedTweet:Tweet)
        OPTIONAL MATCH (user)-[:POSTED]->(userTweet:Tweet)
        WITH user,
            COLLECT(DISTINCT likedTweet) AS likedTweets,
            COLLECT(DISTINCT retweetedTweet) AS retweetedTweets,
            COLLECT(DISTINCT bookmarkedTweet) AS bookmarkedTweets,
            COLLECT(DISTINCT commentedTweet) AS commentedTweets,
            COLLECT(DISTINCT userTweet) AS userTweets
        RETURN likedTweets, retweetedTweets, bookmarkedTweets, commentedTweets, userTweets
      `,
      { username },
      ["likedTweets", "retweetedTweets", "bookmarkedTweets", "commentedTweets", "userTweets"]
    );

    // const allTweets = userTweets?.flatMap(tw => tw);
    // console.log("allTweets:", allTweets
    // );
    // console.log("userTweets:", JSON.stringify(userTweets));

    return NextResponse.json({ userTweets, success: true });
  } catch (err) {
    return NextResponse.json({ message: 'Fetch tweets error', success: false });
  }
}

export { GET };


   // Adjust the Cypher query to fetch the tweet by ID
  //  const bookmarksTweets = await read(
  //   session,
  //   `
  //   MATCH (tweet:Tweet)
  //   WHERE tweet.id IN $tweetIds
  //   OPTIONAL MATCH (tweet)-[:HAS_COMMENT]->(c:Comment)<-[:COMMENTED]-(u:User)
  //   OPTIONAL MATCH (tweet)-[:RETWEETS]->(retweeter:User)
  //   OPTIONAL MATCH (tweet)-[:LIKED]->(liker:User)
  //   WITH tweet,
  //       COLLECT(DISTINCT c) AS comments,
  //       COLLECT(DISTINCT u) AS commenters,
  //       COLLECT(DISTINCT retweeter) AS retweeters,
  //       COLLECT(DISTINCT liker) AS likers
  //   ORDER BY tweet._createdAt DESC
  //   RETURN tweet,
  //         comments,
  //         commenters,
  //         retweeters,
  //         likers
  //   SKIP ${(page - 1) * limit}
  //   LIMIT ${limit}
  //   `,
  //   {
  //     tweetIds: bookmarkedIds
  //   }
  // );

  // const repliedTweets = await read(
  //   session,
  //   `
  //   MATCH (tweet:Tweet)
  //   WHERE tweet.id IN $tweetIds
  //   OPTIONAL MATCH (tweet)-[:HAS_COMMENT]->(c:Comment)<-[:COMMENTED]-(u:User)
  //   OPTIONAL MATCH (tweet)-[:RETWEETS]->(retweeter:User)
  //   OPTIONAL MATCH (tweet)-[:LIKED]->(liker:User)
  //   WITH tweet,
  //       COLLECT(DISTINCT c) AS comments,
  //       COLLECT(DISTINCT u) AS commenters,
  //       COLLECT(DISTINCT retweeter) AS retweeters,
  //       COLLECT(DISTINCT liker) AS likers
  //   ORDER BY tweet._createdAt DESC
  //   RETURN tweet,
  //         comments,
  //         commenters,
  //         retweeters,
  //         likers
  //   SKIP ${(page - 1) * limit}
  //   LIMIT ${limit}
  //   `,
  //   {
  //     tweetIds: repliedTweetsIds
  //   }
  // );

  // const retweetedTweets = await read(
  //   session,
  //   `
  //   MATCH (tweet:Tweet)
  //   WHERE tweet.id IN $tweetIds
  //   OPTIONAL MATCH (tweet)-[:HAS_COMMENT]->(c:Comment)<-[:COMMENTED]-(u:User)
  //   OPTIONAL MATCH (tweet)-[:RETWEETS]->(retweeter:User)
  //   OPTIONAL MATCH (tweet)-[:LIKED]->(liker:User)
  //   WITH tweet,
  //       COLLECT(DISTINCT c) AS comments,
  //       COLLECT(DISTINCT u) AS commenters,
  //       COLLECT(DISTINCT retweeter) AS retweeters,
  //       COLLECT(DISTINCT liker) AS likers
  //   ORDER BY tweet._createdAt DESC
  //   RETURN tweet,
  //         comments,
  //         commenters,
  //         retweeters,
  //         likers
  //   SKIP ${(page - 1) * limit}
  //   LIMIT ${limit}
  //   `,
  //   {
  //     tweetIds: retweetedIds
  //   }
  // );

  // const likedTweets = await read (
  //   session,
  //   `
  //   MATCH (tweet:Tweet)
  //   WHERE tweet.id IN $tweetIds
  //   OPTIONAL MATCH (tweet)-[:HAS_COMMENT]->(c:Comment)<-[:COMMENTED]-(u:User)
  //   OPTIONAL MATCH (tweet)-[:RETWEETS]->(retweeter:User)
  //   OPTIONAL MATCH (tweet)-[:LIKED]->(liker:User)
  //   WITH tweet,
  //       COLLECT(DISTINCT c) AS comments,
  //       COLLECT(DISTINCT u) AS commenters,
  //       COLLECT(DISTINCT retweeter) AS retweeters,
  //       COLLECT(DISTINCT liker) AS likers
  //   ORDER BY tweet._createdAt DESC
  //   RETURN tweet,
  //         comments,
  //         commenters,
  //         retweeters,
  //         likers
  //   SKIP ${(page - 1) * limit}
  //   LIMIT ${limit}
  //   `,
  //   {
  //     tweetIds: likedIds
  //   }
  // );