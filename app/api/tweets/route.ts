// app/api/tweets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { defineDriver, read, write } from '@utils/neo4j/neo4j';
import { TweetRecord, TweetToDisplay } from '../../../typings';


async function GET(request: NextRequest) {
  const params = new URL(request.url!).searchParams;
  const [limit, page] = [parseInt(params.get('limit')!), parseInt(params.get('page')!)];
  const driver = defineDriver();
  const session = driver.session();
  let tweets: TweetToDisplay[] = [];

  try {
    const result = await read(
                            session, 
                            `
                              MATCH (tweet:Tweet)
                              OPTIONAL MATCH (tweet)-[:HAS_COMMENT]->(c:Comment)<-[:COMMENTED]-(u:User)
                              OPTIONAL MATCH (tweet)-[:RETWEETS]->(retweeter:User)
                              OPTIONAL MATCH (tweet)-[:LIKED]->(liker:User)
                              WITH tweet,
                                  COLLECT(DISTINCT c) AS comments,
                                  COLLECT(DISTINCT u) AS commenters,
                                  COLLECT(DISTINCT retweeter) AS retweeters,
                                  COLLECT(DISTINCT liker) AS likers
                              ORDER BY tweet._createdAt DESCENDING
                              RETURN tweet,
                                    comments,
                                    commenters,
                                    retweeters,
                                    likers
                              SKIP ${(page - 1) * limit}
                              LIMIT ${limit}
                            `, 
                            {}, 
                            ["tweet", "comments", "commenters", "retweeters", "likers"]
                          );
                          // console.log(page, limit);
                          // console.log('tweets:', tweets);
    tweets = result ?? []; // Adjust based on your schema
  } finally {
    await session.close();
  }
  // console.log('tweets:', tweets);
  return NextResponse.json({ tweets });
}



// type Data = {
//   message: string;
// };

async function POST(
  request: NextRequest,
) {
  const data: TweetRecord = await request.json();
  const driver = defineDriver();
  const session = driver.session();
  try {
    if(!data.text)
      throw new Error("Tweet requires text.");

    await write(session, `
      MATCH (u:User {username: $username})
      CREATE (u)-[:POSTED]->(t:Tweet {
        _id: $_id,
        _createdAt: datetime(),
        _updatedAt: datetime(),
        _rev: $_rev,
        _type: $_type,
        blockTweet: $blockTweet,
        text: $text,
        username: $username,
        profileImg: $profileImg,
        image: $image
      })
      `, { ...data })
  
    return NextResponse.json({ success: true });
  } catch(error) {
    return NextResponse.json({ success: false });
  }
}
export { GET, POST };