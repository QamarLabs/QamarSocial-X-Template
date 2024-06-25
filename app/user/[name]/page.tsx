import React from "react";
import { motion } from "framer-motion";

import MainProfile from "../../components/userProfile/MainProfile";
import { useParams } from "next/navigation";
import { fetchUserTweets } from "@utils/fetchUserTweets";
import { fetchUserInfo } from "@utils/fetchUserInfo";

const UserProfule = async () => {
  const params = useParams();
  const { name } = params;
  const username = name as string;
  const tweets = await fetchUserTweets(username);
  const userInfo = await fetchUserInfo(username);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="dark:bg-[#000000] h-screen overflow-hidden"
    >
      <MainProfile tweets={tweets ?? []} userInfo={userInfo!} />
    </motion.div>
  );
};

export default UserProfule;
