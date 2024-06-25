"use client";
import { useState } from "react";
import { CommonLink } from "./common/Links";

export enum NotificationTabs {
  All = "All",
  Verified = "Verified",
  Mentions = "Mentions",
}

const NotificationTabsComponent = () => {
  const [activeTab, setActiveTab] = useState(NotificationTabs.All);

  const handleTabSwitch = (tab: NotificationTabs) => {
    setActiveTab(tab);
  };
  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-[#000000] shadow-md rounded-lg mt-10">
      <div className="flex justify-around">
        <CommonLink
          onClick={() => handleTabSwitch(NotificationTabs.Mentions)}
          activeInd={activeTab === NotificationTabs.Mentions}
          animatedLink={false}
        >
            Mentions
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs ml-2">
              3
            </span>
        </CommonLink>
        <CommonLink
          onClick={() => handleTabSwitch(NotificationTabs.Verified)}
          activeInd={activeTab === NotificationTabs.Verified}
          animatedLink={false}
        >
            Verified{" "}
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs ml-2">
              5
            </span>
        </CommonLink>
        <CommonLink
          activeInd={activeTab === NotificationTabs.All}
          animatedLink={false}
          onClick={() => handleTabSwitch(NotificationTabs.All)}
        >
            All{" "}
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs ml-2">
              10
            </span>
        </CommonLink>
      </div>

      <div
        id="mentioned"
        className={`tab-content p-6 ${
          activeTab === NotificationTabs.Mentions ? "" : "hidden"
        }`}
      >
        <p>You have been mentioned in 3 posts.</p>
      </div>
      <div
        id="verified"
        className={`tab-content p-6 ${
          activeTab === NotificationTabs.Verified ? "" : "hidden"
        }`}
      >
        <p>You have 5 verified notifications.</p>
      </div>
      <div
        id="all"
        className={`tab-content p-6 ${
          activeTab === NotificationTabs.All ? "" : "hidden"
        }`}
      >
        <p>You have a total of 10 notifications.</p>
      </div>
    </div>
  );
};

export default NotificationTabsComponent;
