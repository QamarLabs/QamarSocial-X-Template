"use client";
import React, { useCallback } from "react";
import {
  BellIcon,
  HashtagIcon,
  BookmarkIcon,
  CollectionIcon,
  DotsCircleHorizontalIcon,
  MailIcon,
  UserIcon,
  HomeIcon,
  UsersIcon,
  LoginIcon,
  LogoutIcon,
  CogIcon,
} from "@heroicons/react/outline";
import SidebarRow from "./SidebarRow";
// import { auth } from "../firebase/firebase";
import DarkSwitch from "./DarkSwitch";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getEmailUsername, stopPropagationOnClick } from "@utils/neo4j/index";
import { User } from "typings";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@localredux/store";
import { toggleLoginModal } from "@localredux/slices/modals";

type SideBarProps = {};

const SideBar = ({}: SideBarProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
  // const { showLoginModal } = useSelector((store: RootState) => store.modals);
  const dispatch = useDispatch();

  const openModal = () => dispatch(toggleLoginModal(true));

  const handleDropdownEnter = useCallback(
    () => setIsDropdownOpen(!isDropdownOpen),
    []
  );
  // console.log("session.user:", session!.user);
  const username = session ? (session!.user as User).username : "";

  return (
    <>
      <div className="col-span-1 sm:col-span-2 flex flex-col item-center mt-2 md:mt-0 md:px-1 md:px-4 md:items-start">
        <div className="flex justify-start">
          <img
            className={`
              m-0 h-full w-full md:h-13 md:w-14 transition-all duration-200 
              hover:bg-gray-100 dark:hover:bg-gray-600
          `}
            src="https://res.cloudinary.com/aa1997/image/upload/v1717352649/k5kuqij3llmmf5mzsex7.png"
            alt=""
            style={{ maxWidth: "unset" }}
            onClick={() => router.push("/")}
          />
        </div>
        <SidebarRow Icon={HashtagIcon} title="Explore" href="/explore" />
        <SidebarRow
          Icon={BellIcon}
          title="Notifications"
          href="/notifications"
        />
        <SidebarRow Icon={MailIcon} title="Messages" href="/messages" />
        <SidebarRow Icon={BookmarkIcon} title="Bookmarks" href="/bookmarks" />
        <SidebarRow Icon={CollectionIcon} title="Lists" href="/lists" />
        <SidebarRow Icon={UsersIcon} title="Communities" href="/communities" />
        {/* {
          session ? 
          (
           <SidebarRow Icon={LoginIcon} title="Sign Out" />
          
          ) : (
            <SidebarRow Icon={LogoutIcon} title="Sign In" onClick={openModal} />

          )
        } */}
        <div className="relative more-container">
          <SidebarRow
            Icon={DotsCircleHorizontalIcon}
            title="More"
            onClick={handleDropdownEnter}
          />
          {isDropdownOpen && (
            <div className="absolute left-0 bottom-100 mt-2 w-48 rounded-md shadow-lg ring-1 bg-white dark:bg-[#000000] ring-black ring-opacity-5 z-40">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {session ? (
                  <>
                    <SidebarRow Icon={CogIcon} title="Settings" />
                    <SidebarRow Icon={LoginIcon} title="Sign Out" />
                  </>
                ) : (
                  <SidebarRow
                    Icon={LogoutIcon}
                    title="Sign In"
                    onClick={openModal}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <DarkSwitch />
        {session && (
          <>
            <hr />
            {/* <div className="flex align-center p-2 cursor-pointer hover:opacity-75"> */}
            <div
              onClick={() => router.push(`/users/${username}`)}
              className="group flex max-w-fit
        cursor-pointer items-center space-x-2 rounded-full px-1 md:px-4 py-1 py-3
        transition-all duration-200 hover:bg-purple-200 dark:hover:bg-gray-600 mb-1 mt-1"
            >
              <img
                className="m-0 mt-3 w-full h-full md:h-14 md:w-14 rounded-full"
                src={session!.user!.image!}
                alt="Avatar"
                loading="lazy"
              />
              {/* <div className="flex flex-col justify-center  p-3 opacity-50 text-xs sm:text-sm lg:text-md"> */}
              <div className="flex flex-col display-none md:display-initial hidden group-hover:text-twitter md:inline-flex text-base font-light text-xs lg:text-sm">
                <p>{session!.user!.name}</p>
                <p>@{getEmailUsername(session!.user!.email!)}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default SideBar;
