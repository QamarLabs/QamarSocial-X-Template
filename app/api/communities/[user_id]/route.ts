import { defineDriver, read } from "@utils/neo4j";
import { NextRequest, NextResponse } from "next/server";

async function GET(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const { user_id } = params;
  const userId = user_id as string;

  if (!userId) {
    return new NextResponse("User must be logged in", { status: 400 });
  }

  const driver = defineDriver();
  const session = driver.session();

  try {
    // Adjust the Cypher query to fetch the tweet by ID

    const tweets = await read(
      session,
      `
            // Match the queried user and retrieve their hobbies
            MATCH (queriedUser:User {id: $userId})
            WITH queriedUser, queriedUser.hobbies AS hobbies

            // Find other users who share the same hobbies
            MATCH (otherUser:User)
            WHERE otherUser <> queriedUser AND otherUser.hobbies = hobbies

            // Match tweets liked by the other users
            MATCH (otherUser)-[:LIKES]->(tweet:Tweet)

            // Return the other users and the tweets they liked
            RETURN COLLECT(tweet) AS likedTweets

        `,
      { userId },
      "likedTweets"
    );
    const twts = tweets?.length ? tweets : [];

    if (twts) {
      return NextResponse.json({ tweets: twts, success: true  });
    } else {
      throw new Error(
        `Communities tweets not found based on user id ${userId}`
      );
    }
  } catch (err) {
    return NextResponse.json({ message: "Fetch bookmarks error!", success: false });
  }
}

export { GET };
