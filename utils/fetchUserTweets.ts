import { Tweet } from "../typings";

export const fetchUserTweets = async (name: string) => {
  try {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tweets/users/${name}`, { method: "GET" });
    if(!res.ok) {
      throw new Error("Error fetching a tweets for  " + name);
    }
    
    const data = await res.json();
    const tweets: Tweet[] = data.tweets;
    return tweets;
  } catch(error)  {
    console.log("Error:", error);
  }
};
