'use client';
import React, { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

import { Tweet } from "../typings";
import { fetchTweets } from "../utils/fetchTweets";
// import PageContainer from "components/PageContainer";
import Feed from "app/components/Feed";
import { useSession } from "next-auth/react";

interface Props {
  tweets: Tweet[];
}

const Home = () => {
  // const tweets = await fetchTweets();
  // const [isClient, setIsClient] = useState<boolean>(false);
  const [tweets, setTweets] = useState<Tweet[]>([]);

  async function getTwts() {
    const twts = await fetchTweets();    
    setTweets(twts!);
  }
  useEffect(
    () => {
      getTwts();
    },
    []
  );

  return (
    <Feed tweets={tweets} title="Popular Tweets" />
  );
};

export default Home;

