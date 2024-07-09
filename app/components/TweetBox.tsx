import { EmojiHappyIcon, PhotographIcon } from "@heroicons/react/outline";
import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

import { TweetBody, TweetRecord, TweetToDisplay } from "../../typings";
import { useSession } from "next-auth/react";
import {
  Params,
  defaultSearchParams,
  getEmailUsername,
  isTweetSearchAMatch,
} from "@utils/neo4j/index";
import { fetchTweets } from "@utils/tweets/fetchTweets";
import { addTweet } from "@utils/tweets/addTweet";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import { faker } from "@faker-js/faker";

interface Props {
  tweets: TweetToDisplay[];
  setTweets: (twts: TweetToDisplay[]) => void;
  searchParams: Params;
  setSearchParams?: (sParams: Params) => void;
}

function TweetBox({ tweets, setTweets, searchParams, setSearchParams }: Props) {
  const { data: session } = useSession();
  const [input, setInput] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleShowEmojiPicker = useCallback(
    () => setShowEmojiPicker(!showEmojiPicker),
    []
  );
  const handleEmojiSelect = useCallback(
    (iValue: string) => (emoji: any) => {
      const newInputValue = iValue + emoji.native;
      setInput(newInputValue);
      setShowEmojiPicker(false);
    },
    []
  );
  const handleEmojiSelectClickOutside = useCallback(
    () => setShowEmojiPicker(false),
    []
  );

  const handleUploadImage = useCallback(() => {
    imageInputRef?.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const postTweet = async () => {
    const tweetInfo: TweetRecord = {
      _id: faker.datatype.uuid(),
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      _type: "tweet",
      blockTweet: true,
      text: input,
      username: getEmailUsername(session!.user?.email!)!,
      profileImg: session!.user?.image!,
      image: image,
    };
    debugger;
    await addTweet(tweetInfo);

    const newTweets = await fetchTweets(defaultSearchParams);
    setTweets(newTweets!);

    toast("Tweet Posted", {
      icon: "🚀",
    });
  };

  const handleSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      e.preventDefault();
      setSubmitting(true);

      await postTweet();

      setInput("");
      setImage("");
      setSubmitting(false);
    },
    [input, image]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex space-x-2 p-5"
    >
      <img
        className="h-14 w-14 rounded-full object-cover mt-4"
        src={session!.user?.image!}
        alt=""
      />
      <div className="flex flex-1 item-center pl-2">
        <form className="flex flex-1 flex-col">
          <input
            value={input}
            onChange={handleInputChange}
            type="text"
            placeholder="What's Happening"
            className="h-24 w-full text-xl outline-none placeholder:text-xl dark:bg-[#000000]"
          />
          {image && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <img
                className="mt-10 h-40 w-full rounded-xl object-contain shadow-lg"
                src={image}
                alt="image/tweet"
              />
            </motion.div>
          )}
          <div className="flex items-center">
            <div className="flex flex-1 space-x-2 text-twitter">
              <PhotographIcon
                onClick={handleUploadImage}
                className="h-5 w-5 cursor-pointer
              transition-transform duration-150 ease-out
              hover:scale-150"
              />
              <input
                type="file"
                ref={imageInputRef}
                hidden
                onChange={handleFileChange}
              />
              <EmojiHappyIcon
                onClick={handleShowEmojiPicker}
                className="h-5 w-5 cursor-pointer
              transition-transform duration-150 ease-out
              hover:scale-150"
              />
              {showEmojiPicker && (
                <div style={{ position: "absolute", zIndex: 1000 }}>
                  <Picker
                    data={emojiData}
                    onEmojiSelect={handleEmojiSelect(input)}
                    onClickOutside={handleEmojiSelectClickOutside}
                  />
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input || submitting}
              className={`rounded-full bg-twitter px-5 py-2 font-bold text-white
              disabled:opacity-40`}
              type="button"
            >
              {submitting ? (
                <svg
                  aria-hidden="true"
                  className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                "Tweet"
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default TweetBox;
