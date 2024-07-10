import React from "react";
import dynamic from "next/dynamic";
import { FilterKeys } from "@localredux/store";
const SearchBar = dynamic(() => import("@components/common/SearchBar"), { ssr: false });
const Feed = dynamic(() => import("@components/Feed"), { ssr: false });

async function SearchPage() {

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <SearchBar fullWidth />
      <Feed hideTweetBox={true} title="Search" filterKey={FilterKeys.Search}/>
    </React.Suspense>
  );
};

export default SearchPage;