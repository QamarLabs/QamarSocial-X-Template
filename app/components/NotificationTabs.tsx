"use client";
import { useCallback, useState } from "react";
import Tabs from "@components/common/Tabs";
import { TweetToDisplay } from "typings";
import TweetComponent from "./Tweet";

export enum NotificationTabs {
  All = "All",
  Verified = "Verified",
  Mentions = "Mentions",
}

const NotificationTabsComponent = () => {
  const renderer = useCallback(
    (twt: TweetToDisplay) => (
      <TweetComponent
        key={twt.tweet._id}
        tweet={twt}
      />
    ),
    []
  );

  return (
    <Tabs
      tabs={[
        {
          tabKey: "all",
          title: "All",
          content: [],
          renderer,
        },
        {
          tabKey: "mentioned",
          title: "Mentions",
          content: [],
          renderer,
        },
        {
          tabKey: "verified",
          title: "Verified",
          content: [],
          renderer,
        },
      ]}
      showNumberOfRecords={true}
    />
  );
};

export default NotificationTabsComponent;
