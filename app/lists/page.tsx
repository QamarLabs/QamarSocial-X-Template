import React from "react";
import dynamic from "next/dynamic";
import { fetchTweets } from "../../utils/fetchTweets";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
const Feed = dynamic(() => import("@components/Feed"), { ssr: false });

async function ListsPage() {
  const session = await getServerSession();
  if (!session) {
    return redirect("/");
  }
  
  const lists = await fetchTweets();
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Feed tweets={lists ?? []} title="My Lists" />
    </React.Suspense>
  );
};

export default ListsPage;