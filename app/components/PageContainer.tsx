"use client";
import Head from "next/head";
import React from "react";
import { Toaster } from "react-hot-toast";
import SideBar from "./SideBar";
import Widgets from "./Widgets";
import { motion } from "framer-motion";
import { Tweet } from "../../typings";
import Feed from "./Feed";

type PageContainerProps = {
  title?: string;
};

const PageContainer = ({
  children,
}: React.PropsWithChildren<PageContainerProps>) => {
  // const [user] = useAuthState(auth);
  return (
    <>
      <SideBar isShow={false} isHome={true} />
      <div className="col-span-7 lg:col-span-5">
        {children ? children : null}
      </div>
      <Widgets />
    </>
  );
};
export default PageContainer;
