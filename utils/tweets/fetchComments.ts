import { Comment } from "../../typings";

export const fetchComments = async (tweetId: string) => {
  const res = await fetch(`/api/comments?tweetId=${tweetId}`, { method: "GET" });

  const comments: Comment[] = await res.json();

  return comments;
};
