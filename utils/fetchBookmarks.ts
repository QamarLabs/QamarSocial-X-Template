import { Tweet } from "../typings";

export interface Params {
  query: string
}

export const fetchBookmarks = async (params?: Params | undefined) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookmarks`, { method: "GET" });
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
