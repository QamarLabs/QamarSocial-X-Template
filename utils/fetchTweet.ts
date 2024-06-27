import { Params, retrieveQueryString } from ".";
import { Tweet, Comment } from "../typings";

export const fetchTweet = async (statusId: string) => {
  try {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tweets/${statusId}`, { method: "GET" });
    if(!res.ok) {
      throw new Error("Error fetching a tweet of " + statusId);
    }
    
    const data = await res.json();
    const tweet: Tweet = data.tweet;
    const comments: Comment[] = data.comments;
    return {tweet, comments };
  } catch(error)  {
    console.log("Error:", error);
  }
};
