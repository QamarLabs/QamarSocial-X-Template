// app/api/tweets/[tweet_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { defineDriver, read, write } from "@utils/neo4j/neo4j";
import { TweetToDisplay } from "typings";


async function PATCH(
    request: NextRequest,
    { params }: { params: { tweet_id: string } }
  ) {
    const body = await request.json();
    const { tweet_id } = params;
    const tweetId = tweet_id as string;
  
    if (!tweetId) {
      return new NextResponse("Tweet ID is required", { status: 400 });
    }
  
    const driver = defineDriver();
    const session = driver.session();
    console.log('body["userId', body)
    try {
      if (!body["liked"]) {
        await write(
          session,
          `
          // Match the user node
          MERGE (u:User {id: $userId})
          // Match the tweet node
          MERGE (t:Tweet {id: $tweetId})
          // Create the 'LIKES' relationship with a timestamp
          MERGE (u)-[r:LIKES]->(t)
          ON CREATE SET r.timestamp = timestamp()
          `,
          { userId: body["userId"], tweetId: tweet_id }
        );
      } else if (body["liked"]) {
        await write(
          session,
          `
          // Match the user, tweet, and the 'LIKES' relationship
          MATCH (u:User {id: $userId})-[r:LIKES]->(t:Tweet {id: $tweetId})
          // Delete the 'LIKES' relationship
          DELETE r
          `,
          { userId: body["userId"], tweetId: tweet_id }
        );
      }
  
      return NextResponse.json({ success: true });
    } catch (err) {
      return NextResponse.json({ message: "Patch Tweet error!", success: false });
  
    }
  }

export {  PATCH };
