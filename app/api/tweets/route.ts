// app/api/tweets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { defineDriver, read } from '@utils/neo4j/neo4j';
import { TweetToDisplay } from '../../../typings';
import { NextApiRequest, NextApiResponse } from 'next';


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

// export async function POST(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   const data: TweetBody = JSON.parse(req.body);
//   const mutations = {
//     mutations: [
//       {
//         create: {
//           _type: "tweet",
//           text: data.text,
//           username: data.username,
//           blockTweet: false,
//           profileImg: data.profileImg,
//           image: data.image,
//         },
//       },
//     ],
//   };

//   const apiEndPoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;

//   const result = await fetch(apiEndPoint, {
//     headers: {
//       "content-type": "application/json",
//       Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
//     },
//     body: JSON.stringify(mutations),
//     method: "POST",
//   });

//   const json = await result.json();

//   res.status(200).json({ message: "Added" });
// }
export { GET };