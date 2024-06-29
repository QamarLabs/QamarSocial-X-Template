export const retweet = async (statusId: string, userId: string, retweeted: boolean) => {
    try {
      console.log('userId:', userId);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tweets/${statusId}/retweet`, { method: "PATCH", body: JSON.stringify({
          userId,
          retweeted
      }) });
      if(!res.ok) {
        throw new Error("Error fetching a tweet of " + statusId);
      }
      
      return true;
    } catch(error)  {
      console.log("Error:", error);
    }
  };
  