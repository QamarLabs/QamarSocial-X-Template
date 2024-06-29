import { TweetBody } from "typings";

export const addTweet = async (
  newTweet: TweetBody
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/tweets/`,
      {
        method: "POST",        
        body: JSON.stringify(newTweet),
      }
    );
    if (!res.ok) {
      throw new Error("Error creating tweet");
    }

    return true;
  } catch (error) {
    console.log("Error:", error);
  }
};
