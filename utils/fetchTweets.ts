import { Params, retrieveQueryString } from ".";
import { Tweet } from "../typings";



export const fetchTweets = async (params?: Params | undefined) => {
  try {
    var queryString = retrieveQueryString(params);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tweets${queryString != "?" ? queryString : ""}`, { method: "GET" });
    if(!res.ok) {
      throw new Error("Error fetching tweets");
    }
    
    const data = await res.json();
    const tweets: Tweet[] = data.tweets;
    return tweets;
  } catch(error)  {
    console.log("Error:", error);
  }
};
