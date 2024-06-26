// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { defineDriver, write } from "../../../../utils/neo4j";
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
  const listName = body["name"] ?? "";
  const listDescription = body["description"] ?? "";

  if (!listName) {
    return new NextResponse("Name of List is required", { status: 400 });
  }
  if (!listDescription) {
    return new NextResponse("Description of List is required", { status: 400 });
  }

  try {
    await write(
      session,
      `
          // Create a new list with a name and description
          MERGE (u:User {id: $userId})
          CREATE (l:List {userId: $userId, name: $listName, description: $listDescription})
          CREATE (u)-[:CREATED]->(l)
          `,
      { userId, listName, listDescription }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Add list error!", success: false });
  }
}

async function PATCH(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const body = await request.json();
  const driver = defineDriver();
  const session = driver.session();
  const { user_id } = params;
  const userId = user_id as string;
  const listId = body["listId"] ?? "";
  const tweetId = body["tweetId"] ?? "";
  const isAdded = body["added"];

  if (!tweetId) {
    return new NextResponse("tweet ID is required", { status: 400 });
  }

  if (!listId) {
    return new NextResponse("list ID is required", { status: 400 });
  }

  try {
    if (isAdded === false) {
      await write(
        session,
        `
          // Match the user node
          MERGE (u:User {id: $userId})
          // Match the tweet node
          MERGE (t:Tweet {id: $tweetId})
          // Match the list node
          MERGE (l:List {id: $listId})
          // Ensure the user owns the list
          MERGE (u)-[:OWNS]->(l)
          // Create the 'CONTAINS' relationship between the list and the tweet with a timestamp
          MERGE (l)-[r:CONTAINS]->(t)
          ON CREATE SET r.timestamp = timestamp()
          `,
        { userId, tweetId, listId }
      );
    } else if (isAdded === true) {
      await write(
        session,
        `
          // Match the user node
          MATCH (u:User {id: $userId})
          // Match the list node
          MATCH (l:List {id: $listId})
          // Ensure the user owns the list
          MATCH (u)-[:OWNS]->(l)
          // Match and delete the 'CONTAINS' relationships between the list and any tweets
          OPTIONAL MATCH (l)-[r:CONTAINS]->(t:Tweet)
          DELETE r
          // Delete the 'OWNS' relationship and the list node
          WITH l
          OPTIONAL MATCH (u)-[o:OWNS]->(l)
          DELETE o, l

          `,
        { userId, listId }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Patch list error!", success: false });
  }
}

export { POST, PATCH };
