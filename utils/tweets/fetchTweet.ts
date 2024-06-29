import { Params, retrieveQueryString } from "../neo4j";
import { TweetToDisplay, Comment } from "../../typings";

export const fetchTweet = async (statusId: string) => {
  try {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tweets/${statusId}`, { method: "GET" });
    if(!res.ok) {
      throw new Error("Error fetching a tweet of " + statusId);
    }
    
    const data = await res.json();
    const tweet: TweetToDisplay = data.tweet;
    return {tweet };
  } catch(error)  {
    console.log("Error:", error);
  }
};
