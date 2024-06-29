import React from "react";
import dynamic from "next/dynamic";
const Feed = dynamic(() => import("@components/Feed"), { ssr: false });

async function SearchPage() {

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Feed title="Search" />
    </React.Suspense>
  );
};

export default SearchPage;