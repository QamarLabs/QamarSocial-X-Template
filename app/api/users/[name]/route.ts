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

    const users = await read(
      session,
      `
        MATCH (user:User {username: $username})
        RETURN user
      `,
      { username },
      "user"
    );
    const user = users && users.length ? users[0] : undefined;
    return NextResponse.json({ user });
  } catch (err) {
    console.log("Fetch Tweet Error:", err);
    return NextResponse.error();
  }
}

export { GET };
