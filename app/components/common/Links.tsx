import { stopPropagationOnClick } from "@utils/neo4j/index";

export interface CommonLinkProps {
  animatedLink: boolean;
  onClick: Function;
  activeInd?: boolean;
}

export function CommonLink(props: React.PropsWithChildren<CommonLinkProps>) {
  return (
    <div
      onClick={(e) => stopPropagationOnClick(e, props.onClick)}
      className={`
        ${
          props.animatedLink
            ? `group flex max-w-fit 
      cursor-pointer items-center space-x-2 px-4 py-3
      transition-all duration-200 animate-pulse text-purple-500 hover:bg-purple-100 dark:hover:bg-[#000000] dark:hover:opacity-50 dark:text-purple-300`
            : `group flex max-w-fit 
      cursor-pointer items-center space-x-2 rounded-full px-4 py-3
      transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600`
        }
        ${props.activeInd ? "bg-gray-100 dark:bg-gray-600 text-twitter" : ""}
        `}
    >
      {props.children}
    </div>
  );
}
