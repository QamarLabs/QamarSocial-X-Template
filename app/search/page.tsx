// pages/search.tsx
import React from "react";
import { fetchTweets } from "../../utils/fetchTweets";
import PageContainer from "../components/PageContainer";
import { Tweet } from "../../typings";



// type SearchPageProps = {
//   topic: string | null;
//   searchedTweets: Tweet[];
// };

const SearchPage =  async () => {
  const topic = 'Search Page';
  const searchedTweets = await fetchTweets();
  if (!searchedTweets) return <div>Loading...</div>;

  

  return (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <PageContainer title={`${topic ? "Trending - " + topic : "Search"}`} tweets={searchedTweets}>
      </PageContainer>
    </React.Suspense>
  );
};

export default SearchPage;
