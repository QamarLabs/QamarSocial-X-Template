// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { defineDriver, read, write } from "@utils/neo4j/neo4j";
import { NextRequest, NextResponse } from "next/server";

async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const driver = defineDriver();
  const session = driver.session();
  const { name } = params;
  const username = name as string;

  if (!username) {
    return new NextResponse("You need to be logged in, in order to access  your bookmarks.", { status: 400 });
  }
  try {
    const bookmarks = await read(
                                session, 
                                `
                                  MATCH (user:User {username: $username})-[:BOOKMARKED]->(twt:Tweet)
                                  MATCH (tweet:Tweet {_id: twt._id})
                                  OPTIONAL MATCH (tweet)-[:HAS_COMMENT]->(c:Comment)<-[:COMMENTED]-(u:User)
                                  OPTIONAL MATCH (tweet)-[:RETWEETS]->(retweeter:User)
                                  OPTIONAL MATCH (tweet)-[:LIKED]->(liker:User)
                                  WITH tweet, COLLECT(DISTINCT c) AS comments, COLLECT(DISTINCT u) AS commenters, COLLECT(DISTINCT retweeter) AS retweeters, COLLECT(DISTINCT liker) AS likers
                                  ORDER BY tweet._createdAt DESCENDING
                                  RETURN tweet, comments, commenters, retweeters, likers
                                  SKIP 0
                                  LIMIT 100
                                `, 
                                { username },
                                ["tweet", "comments", "commenters", "retweeters", "likers"]
                            );

    console.log("bookmarks:", bookmarks);

    return NextResponse.json({ success: true, bookmarks });
  } catch (err) {
    return NextResponse.json({ message: "Add bookmarks error!", success: false });
  }
}

export { GET };