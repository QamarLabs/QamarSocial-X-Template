export const likedTweet = async (statusId: string, userId: string, liked: boolean) => {
  try {
    console.log('userId:', userId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tweets/${statusId}`, { method: "PATCH", body: JSON.stringify({
        userId,
        liked
    }) });
    if(!res.ok) {
      throw new Error("Error fetching a tweet of " + statusId);
    }
    
    return true;
  } catch(error)  {
    console.log("Error:", error);
  }
};
