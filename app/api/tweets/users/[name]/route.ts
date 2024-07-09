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
    const allTweets = await read(
      session,
      `
        // User Tweets
        MATCH (u:User {username: $username})
        MATCH (tweet:Tweet {username: u.username})
        OPTIONAL MATCH (tweet)-[:HAS_COMMENT]->(c:Comment)<-[:COMMENTED]-(u:User)
        OPTIONAL MATCH (tweet)-[:RETWEETS]->(retweeter:User)
        OPTIONAL MATCH (tweet)-[:LIKED]->(liker:User)
        WITH tweet, COLLECT(DISTINCT c) AS comments, COLLECT(DISTINCT u) AS commenters, COLLECT(DISTINCT retweeter) AS retweeters, COLLECT(DISTINCT liker) AS likers, "user" as type
        ORDER BY tweet._createdAt DESCENDING
        RETURN tweet, comments, commenters, retweeters, likers, type
        SKIP 0
        LIMIT 100

        UNION

        // Bookmarked Tweets
        MATCH (u:User {username: $username})
        MATCH (tweet:Tweet)
        WHERE (u)-[:BOOKMARKED]->(tweet)
        OPTIONAL MATCH (tweet)-[:HAS_COMMENT]->(c:Comment)<-[:COMMENTED]-(u:User)
        OPTIONAL MATCH (tweet)-[:RETWEETS]->(retweeter:User)
        OPTIONAL MATCH (tweet)-[:LIKED]->(liker:User)
        WITH tweet, COLLECT(DISTINCT c) AS comments, COLLECT(DISTINCT u) AS commenters, COLLECT(DISTINCT retweeter) AS retweeters, COLLECT(DISTINCT liker) AS likers, "bookmarked" as type
        ORDER BY tweet._createdAt DESCENDING
        RETURN tweet, comments, commenters, retweeters, likers, type
        SKIP 0
        LIMIT 100

        UNION

        // Liked Tweets
        MATCH (u:User {username: $username})
        MATCH (tweet:Tweet)
        WHERE (u)-[:LIKED]->(tweet)
        OPTIONAL MATCH (tweet)-[:HAS_COMMENT]->(c:Comment)<-[:COMMENTED]-(u:User)
        OPTIONAL MATCH (tweet)-[:RETWEETS]->(retweeter:User)
        OPTIONAL MATCH (tweet)-[:LIKED]->(liker:User)
        WITH tweet, COLLECT(DISTINCT c) AS comments, COLLECT(DISTINCT u) AS commenters, COLLECT(DISTINCT retweeter) AS retweeters, COLLECT(DISTINCT liker) AS likers, "liked" as type
        ORDER BY tweet._createdAt DESCENDING
        RETURN tweet, comments, commenters, retweeters, likers, type
        SKIP 0
        LIMIT 100

        UNION

        // Retweeted Tweets
        MATCH (u:User {username: $username})
        MATCH (tweet:Tweet)
        WHERE (u)-[:RETWEETED]->(tweet)
        OPTIONAL MATCH (tweet)-[:HAS_COMMENT]->(c:Comment)<-[:COMMENTED]-(u:User)
        OPTIONAL MATCH (tweet)-[:RETWEETS]->(retweeter:User)
        OPTIONAL MATCH (tweet)-[:LIKED]->(liker:User)
        WITH tweet, COLLECT(DISTINCT c) AS comments, COLLECT(DISTINCT u) AS commenters, COLLECT(DISTINCT retweeter) AS retweeters, COLLECT(DISTINCT liker) AS likers, "retweeted" as type
        ORDER BY tweet._createdAt DESCENDING
        RETURN tweet, comments, commenters, retweeters, likers, type
        SKIP 0
        LIMIT 100

        UNION

        // Replied Tweets
        MATCH (u:User {username: $username})
        MATCH (tweet:Tweet)
        WHERE (u)-[:COMMENTED]->(tweet)
        OPTIONAL MATCH (tweet)-[:HAS_COMMENT]->(c:Comment)<-[:COMMENTED]-(u:User)
        OPTIONAL MATCH (tweet)-[:RETWEETS]->(retweeter:User)
        OPTIONAL MATCH (tweet)-[:LIKED]->(liker:User)
        WITH tweet, COLLECT(DISTINCT c) AS comments, COLLECT(DISTINCT u) AS commenters, COLLECT(DISTINCT retweeter) AS retweeters, COLLECT(DISTINCT liker) AS likers, "replied" as type
        ORDER BY tweet._createdAt DESCENDING
        RETURN tweet, comments, commenters, retweeters, likers, type
        SKIP 0
        LIMIT 100
      `,
      { username },
      ["tweet", "comments", "commenters", "retweeters", "likers", "type"]
    );

    const userTweets = allTweets?.filter((t) => t.type === "user");
    const bookmarkedTweets = allTweets?.filter((t) => t.type === "bookmarked");
    const likedTweets = allTweets?.filter((t) => t.type === "liked");
    const retweetedTweets = allTweets?.filter((t) => t.type === "retweeted");
    const repliedTweets = allTweets?.filter((t) => t.type === "replied");

    // const allTweets = userTweets?.flatMap(tw => tw);
    // console.log("allTweets:", allTweets
    // );
    // console.log("userTweets:", JSON.stringify(userTweets));

    return NextResponse.json({
      dashboardTweets: {
        userTweets,
        bookmarkedTweets,
        likedTweets,
        retweetedTweets,
        repliedTweets,
      },
      success: true,
    });
  } catch (err) {
    return NextResponse.json({ message: "Fetch tweets error", success: false });
  }
}

export { GET };
