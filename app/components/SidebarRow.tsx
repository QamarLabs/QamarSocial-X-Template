"use client";
import { useRouter } from "next/navigation";
import React, { SVGProps } from "react";
import { nonRoutableTitles } from "@utils/index";
import { signOut } from "next-auth/react";
import { CommonLink, CommonLinkProps } from "./common/Links";

interface SidebarRowProps {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  title: string;
  isShow?: boolean;
  href?: string;
  onClick?: Function;
  classNames?: string;
}

function SidebarRow({
  Icon,
  title,
  isShow,
  onClick,
  classNames,
  href,
}: SidebarRowProps) {
  const router = useRouter();

  const sidebarOnClick = async (e: React.MouseEvent) => {
    if (!nonRoutableTitles.includes(title)) router.push(href!);
    else {
      if (title === "Sign In" || title === "More") onClick!(e);
      if (title === "Sign Out") await signOut();
    }
  };

  const commonLinkProps: CommonLinkProps = {
    onClick: sidebarOnClick,
    animatedLink: title === "Sign In",
  };

  return (
    <>
      <CommonLink {...commonLinkProps}>
        <Icon className="h-6 w-6 " />
        <p className="hidden group-hover:text-twitter md:inline-flex text-base font-light">
          {title}
        </p>
      </CommonLink>
    </>
  );
}

export default SidebarRow;
