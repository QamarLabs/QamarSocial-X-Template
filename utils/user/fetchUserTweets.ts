import { UserProfileDashboardTweets } from "../../typings";

export const fetchUserTweets = async (username: string) => {
  try {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tweets/users/${username}`, { method: "GET" });
    if(!res.ok) {
      throw new Error("Error fetching a tweets for  " + username);
    }
    
    const data = await res.json();
    const tweets: UserProfileDashboardTweets = data.dashboardTweets;
    return tweets;
  } catch(error)  {
    console.log("Error:", error);
  }
};
