// app/api/tweets/route.ts
import { NextResponse } from 'next/server';
import { defineDriver, read } from '../../../utils/neo4j';
import { Tweet, TweetBody } from '../../../typings';
import { NextApiRequest, NextApiResponse } from 'next';

export interface TweetResponse {
  records: Tweet[];
}

async function GET() {
  const driver = defineDriver();
  const session = driver.session();
  let tweets: Tweet[] = [];
  
  try {
    const result = await read(session, 'MATCH (t:Tweet) RETURN t LIMIT 100', {}, "t");
    tweets = result ?? []; // Adjust based on your schema
  } finally {
    await session.close();
  }
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