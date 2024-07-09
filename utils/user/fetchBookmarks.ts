import { TweetToDisplay } from "../../typings";

export const fetchBookmarks = async (username: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/bookmarks`, { method: "GET" });
    if(!res.ok) {
      throw new Error("Error fetching bookmarks");
    }
    
    const data = await res.json();
    const bookmarks: any[] = data.bookmarks;
    return bookmarks;
  } catch(error)  {
    console.log("Error:", error);
  }
};
