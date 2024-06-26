// app/api/tweets/[tweet_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { defineDriver, read } from "@utils/neo4j";

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

    const tweets = await read(
      session,
      `
        MATCH (user:User {username: $username})-[:LIKES]->(tweet:Tweet)
        RETURN tweet
      `,
      { username },
      "tweet"
    );

    return NextResponse.json({ tweets: tweets && tweets.length ? tweets : [], success: true });
  } catch (err) {
    return NextResponse.json({ message: 'Fetch tweets error', success: false });
  }
}

export { GET };
