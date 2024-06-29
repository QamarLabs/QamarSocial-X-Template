// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { defineDriver, write } from "@utils/neo4j/neo4j";
import { NextRequest, NextResponse } from "next/server";

type Data = {
  message: string;
};

async function POST(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const body = await request.json();
  const driver = defineDriver();
  const session = driver.session();
  const { user_id } = params;
  const userId = user_id as string;
  const tweetId = body["tweetId"] ?? "";
  const isBookmarked = body["bookmarked"];

  if (!tweetId) {
    return new NextResponse("tweet ID is required", { status: 400 });
  }

  try {
    if (isBookmarked === false) {
      await write(
        session,
        `
            // Match the user node
            MERGE (u:User {id: $userId})
            // Match the tweet node
            MERGE (t:Tweet {id: $tweetId})
            // Create the 'BOOKMARKED' relationship with a timestamp
            MERGE (u)-[r:BOOKMARKED]->(t)
            ON CREATE SET r.timestamp = timestamp()
          `,
        { userId, tweetId }
      );
    } else if (isBookmarked === true) {
      await write(
        session,
        `
            // Match the user node
            MATCH (u:User {id: $userId})
            // Match the tweet node
            MATCH (t:Tweet {id: $tweetId})
            // Match the 'BOOKMARKED' relationship
            MATCH (u)-[r:BOOKMARKED]->(t)
            // Delete the relationship
            DELETE r
          `,
        { userId, tweetId }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Add bookmarks error!", success: false });
  }
}

export { POST };