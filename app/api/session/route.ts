// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// import { cookies } from "next/headers";

type Data = {
    cookieInfo: any
};

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    // const cookieInfo = cookies();
    // console.log('cookieInfo:', cookieInfo);

  res.status(200).json({cookieInfo: {}});
}
