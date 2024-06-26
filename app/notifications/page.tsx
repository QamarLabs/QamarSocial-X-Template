// pages/search.tsx
import React, { useState } from "react";
import { fetchTweets } from "../../utils/fetchTweets";
import dynamic from "next/dynamic";
const NotificationTabs = dynamic(() => import("../components/NotificationTabs"), { ssr: false });

async function NotificationsPage() {
  const topic = "Notifications";
  const searchedTweets = await fetchTweets();
  console.log('process.env.NEXT_PUBLIC_RUN_MODE', process.env.NEXT_PUBLIC_RUN_MODE);

  return (
    <>
      <h1 className="p-5 pb-0 text-xl font-bold">Notifications</h1>
      <NotificationTabs />
    </>
  );
};

export default NotificationsPage;
