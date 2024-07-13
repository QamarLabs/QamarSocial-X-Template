"use client";
import { faker } from "@faker-js/faker";
import { BookmarkIcon, HeartIcon, UploadIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import TimeAgo from "react-timeago";

// import { auth } from "../firebase/firebase";
import { Comment, TweetToDisplay, User } from "../../typings";
import { fetchComments } from "@utils/tweets/fetchComments";
import {
  getPercievedNumberOfRecord,
  stopPropagationOnClick,
} from "@utils/neo4j/index";
import { likeTweet } from "@utils/update-tweets/likeTweet";
import { retweet } from "@utils/update-tweets/retweet";
import { bookmarkTweet } from "@utils/user/bookmarkTweet";
import { useDispatch } from "react-redux";
import { toggleLoginModal } from "@localredux/slices/modals";
import { BookmarkIcon as BookmarkFillIcon } from "@heroicons/react/solid";

interface Props {
  tweet: TweetToDisplay;
  comments?: Comment[];
  userId: string | undefined;
  username?: string | undefined;
  bookmarks?: string[];
  retweets?: string[];
  likedTweets?: string[];
  pushNote: boolean;
}

function TweetComponent({
  tweet,
  comments,
  userId,
  username,
  bookmarks,
  retweets,
  likedTweets,
}: Props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentComments, setCurrentComments] = useState<Comment[]>(
    comments ?? []
  );
  const [input, setInput] = useState<string>("");
  const [commentBoxOpen, setCommentBoxOpen] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isRetweeted, setIsRetweeted] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const initiallyBooleanValues = useRef<{
    retweeted: boolean;
    liked: boolean;
    commented: boolean;
  }>({
    retweeted: false,
    liked: false,
    commented: false,
  });

  const numberOfRetweets = useMemo(
    () =>
      getPercievedNumberOfRecord<User>(
        isRetweeted,
        initiallyBooleanValues.current?.retweeted,
        tweet.retweeters ?? []
      ),
    [isRetweeted]
  );
  const numberOfLikes = useMemo(
    () =>
      getPercievedNumberOfRecord<User>(
        isLiked,
        initiallyBooleanValues.current?.liked,
        tweet.likers ?? []
      ),
    [isLiked]
  );
  const numberOfComments = useMemo(() => {
    return currentComments.some((comm: Comment) => comm.username === username)
      ? currentComments.length + 1
      : currentComments.length;
  }, [currentComments]);
  // const isBookmarkedRef = useRef<boolean>(bookmarks?.some(bk => bk === tweet.tweet._id) ?? false);

  const tweetInfo = tweet.tweet;
  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweetInfo._id);
    setCurrentComments(comments);
  };
  const checkUserIsLoggedInBeforeUpdatingTweet = async (
    callback: () => Promise<void>
  ) => {
    if (!userId) return dispatch(toggleLoginModal(true));

    await callback();
  };

  useLayoutEffect(() => {
    //If any of the bookmarks are not undefined, that means
    if (userId) {
      const twtAlreadyLiked =
        likedTweets?.some((likedTweet) => likedTweet === tweet.tweet._id) ??
        false;

      const twtAlreadyRetweeted =
        retweets?.some((retweet) => retweet === tweet.tweet._id) ?? false;

      initiallyBooleanValues.current = {
        liked: twtAlreadyLiked,
        retweeted: twtAlreadyRetweeted,
        commented: false,
      };
      setIsBookmarked(bookmarks?.some((bk) => bk === tweet.tweet._id) ?? false);
      setIsRetweeted(twtAlreadyRetweeted);
      setIsLiked(twtAlreadyLiked);
    }
  }, [userId]);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    const commentToast = toast.loading("Posting Comment...");

    toast.success("Comment Posted!", {
      id: commentToast,
    });

    setInput("");
    setCommentBoxOpen(false);
    refreshComments();
  };

  const navigateToTweetUser = () => {
    router.push(`users/${tweetInfo.username}`);
  };

  const navigateToTweet = () => {
    router.push(`status/${tweetInfo._id}`);
  };

  const onLikeTweet = async () => {
    const beforeUpdate = isLiked;
    try {
      setIsLiked(!isLiked);
      await checkUserIsLoggedInBeforeUpdatingTweet(async () => {
        await likeTweet(tweet.tweet._id, userId!, isLiked);
      });
    } catch {
      setIsLiked(beforeUpdate);
    }
  };

  const onRetweet = async () => {
    const beforeUpdate = isRetweeted;
    try {
      setIsRetweeted(!isRetweeted);
      await checkUserIsLoggedInBeforeUpdatingTweet(async () => {
        await retweet(tweet.tweet._id, userId!, isRetweeted);
      });
    } catch {
      setIsRetweeted(beforeUpdate);
    }
  };

  const commentOnTweet = () => {};

  const onBookmarkTweet = async () => {
    const beforeUpdate = isBookmarked;
    try {
      setIsBookmarked(!isBookmarked);
      await checkUserIsLoggedInBeforeUpdatingTweet(async () => {
        await bookmarkTweet(tweet.tweet._id, userId!, isBookmarked);
      });
    } catch {
      setIsBookmarked(beforeUpdate);
    }
  };

  return (
    <div
      className="flex flex-col space-x-3 border-y border-gray-100 p-5 hover:shadow-lg dark:border-gray-800 dark:hover:bg-[#000000]"
      onClick={navigateToTweet}
    >
      <div className="flex space-x-3 cursor-pointer">
        <img
          className="h-10 w-10 rounded-full object-cover "
          src={tweetInfo.profileImg}
          alt={tweetInfo.username}
          onClick={(e) => stopPropagationOnClick(e, navigateToTweetUser)}
        />
        <div>
          <div className="flex item-center space-x-1">
            <p
              className={`font-bold mr-1 hover:underline`}
              onClick={(e) => stopPropagationOnClick(e, navigateToTweetUser)}
            >
              {tweetInfo.username}
            </p>
            {userId === tweetInfo.username && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-[#00ADED] mr-1 mt-auto mb-auto"
              >
                <path
                  fillRule="evenodd"
                  d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <p
              className="hidden text-sm text-gray-500 sm:inline dark:text-gray-400 hover:underline"
              onClick={(e) => stopPropagationOnClick(e, navigateToTweetUser)}
            >
              @
              {tweetInfo.username ? tweetInfo.username.replace(/\s+/g, "") : ""}
              .
            </p>
            <TimeAgo
              className="text-sm text-gray-500 dark:text-gray-400"
              date={tweetInfo._createdAt}
            />
          </div>
          <p className="pt-1">{tweetInfo.text}</p>
          {tweetInfo.image && (
            <img
              src={tweetInfo.image}
              alt="img/tweet"
              className="m-5 ml-0 max-h-60
          rounded-lg object-cover shadow-sm"
            />
          )}
        </div>
      </div>
      <div className="mt-5 flex justify-between">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) =>
            stopPropagationOnClick(e, () => {
              dispatch(toggleLoginModal(true));
              setCommentBoxOpen(!commentBoxOpen);
            })
          }
          className="flex cursor-pointer item-center space-x-3 text-gray-400 hover:text-twitter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>

          <p className="text-center">{numberOfComments}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            flex cursor-pointer item-center space-x-3 ${
              isRetweeted ? "text-retweet" : "text-gray-400"
            } hover:text-retweet
            `}
          onClick={(e) => stopPropagationOnClick(e, onRetweet)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
            />
          </svg>

          <p className="text-center">{numberOfRetweets}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`flex cursor-pointer item-center space-x-3 ${
            isLiked ? "text-liked" : "text-gray-400"
          } hover:text-liked`}
          onClick={(e) => stopPropagationOnClick(e, onLikeTweet)}
        >
          <HeartIcon className="h-5 w-5" />
          <p className="text-center">{numberOfLikes}</p>
        </motion.div>
        <div className="flex gap-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              flex cursor-pointer item-center space-x-3 ${
                isBookmarked ? "text-twitter" : "text-gray-400"
              } hover:text-twitter
            `}
            onClick={(e) => stopPropagationOnClick(e, onBookmarkTweet)}
          >
            {isBookmarked ? (
              <BookmarkFillIcon className="h-5 w-5" />
            ) : (
              <BookmarkIcon className="h-5 w-5" />
            )}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex cursor-pointer item-center space-x-3 text-gray-400"
          >
            <UploadIcon className="h-5 w-5" />
          </motion.div>
        </div>
      </div>

      {commentBoxOpen && (
        <>
          {userId && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <form className="mt-3 flex space-x-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 rounded-lg bg-gray-100 p-2 outline-none dark:bg-gray-700"
                  type="text"
                  placeholder="Write a comment..."
                />
                <button
                  onClick={handleSubmit}
                  disabled={!input}
                  type="submit"
                  className="text-twitter  disabled:text-gray-200 cursor-pointer"
                >
                  Post
                </button>
              </form>
            </motion.div>
          )}
        </>
      )}
      {commentBoxOpen && (
        <>
          {currentComments?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5 scrollbar-thin scrollbar-thumb-blue-100"
            >
              {currentComments.map((comment) => (
                <div key={comment._id} className="flex space-x-2">
                  <hr className="top-10 h-8 border-x border-twitter/30" />
                  <img
                    src={comment.profileImg}
                    className="mt-2 h-7 w-7 rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <div className="flex items-center space-x-l">
                      <p className="mr-1 font-bold">{comment.username}</p>
                      <p className="hidden text-sm text-gray-500 lg:inline">
                        @{comment.username.replace(/\s+/g, "")}.
                      </p>
                      <TimeAgo
                        className="text-sm text-gray-500"
                        date={comment._createdAt}
                      />
                    </div>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

export default TweetComponent;
