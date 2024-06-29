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

    return NextResponse.json({ tweets: userTweets && userTweets.length ? userTweets : [], success: true });
  } catch (err) {
    return NextResponse.json({ message: 'Fetch tweets error', success: false });
  }
}

export { GET };
