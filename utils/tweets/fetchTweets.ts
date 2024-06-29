export const dynamic = 'force-dynamic';
import { Params, retrieveQueryString } from "../neo4j";
import { TweetToDisplay } from "../../typings";



export const fetchTweets = async (params?: Params | undefined) => {
  if(process.env.NEXT_PUBLIC_RUN_MODE === "building") {
    return [] as TweetToDisplay[];
  }
  try {
    var queryString = retrieveQueryString(params);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tweets${queryString != "?" ? queryString : ""}`, { method: "GET" });

    if(!res.ok) {
      throw new Error("Error fetching tweets");
    }
    
    const data = await res.json();
    const tweets: TweetToDisplay[] = data.tweets;
    return tweets;
  } catch(error)  {
    console.log("Error:", error);
  }
};
