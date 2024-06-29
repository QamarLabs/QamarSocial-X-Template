import {
  setSearchedTweets,
  setSearchParams as setReduxSearchParams,
} from "@localredux/slices/search";
import { RootState } from "@localredux/store";
import { Params } from "@utils/neo4j";
import { fetchTweets } from "@utils/tweets/fetchTweets";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TweetToDisplay } from "typings";

function useGetTweets(useRedux: boolean) {
  const dispatch = useDispatch();
  const [isBottom, setIsBottom] = useState(false);
  const { searchQry, page, limit, searchedTweets } = useSelector(
    (store: RootState) => store.search
  );
  // const [tweets, setTweets] = useState<TweetToDisplay[]>([]);
  // const [searchParams, setSearchParams] = useState<Params>(defaultSearchParams);

  async function setSParamsAndGetTwts() {
    // if (useRedux) {
    const newSearchParams = {
      search_term: searchQry,
      limit: limit,
      page: page + 1,
    };
    console.log("newSearchParams", newSearchParams);
    const getTwtsSuccessful = await getTwts(newSearchParams);
    if (getTwtsSuccessful) dispatch(setReduxSearchParams(newSearchParams));
    //   } else {
    //       const newSearchParams = {
    //         ...searchParams,
    //         page: searchParams.page! + 1
    //       };
    //       const getTwtsSuccessful = await getTwts();
    //       if(getTwtsSuccessful)
    //         setSearchParams(newSearchParams);
    //   }
  }

  async function getTwts(searchParamsArg?: Params) {
    const twts = await fetchTweets(searchParamsArg);

    if (twts && twts.length) {
      // if(useRedux) {
      const twtsToSet = searchedTweets.slice().concat(twts!);
      dispatch(setSearchedTweets(twtsToSet));
      // } else {
      //     const twtsToSet = tweets.slice().concat(twts!);
      //     setTweets(twtsToSet);
      // }
      return true;
    }
    return false;
  }

  const handleScroll = useCallback(async () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      setIsBottom(true);
    }
  }, []);

  useEffect(() => {
    // if(useRedux) {
    getTwts({
      search_term: searchQry,
      page: page,
      limit: limit,
    });
    // } else {
    //     getTwts();
    // }
  }, []);

  useEffect(() => {
    if (isBottom) {
        setSParamsAndGetTwts();
        console.log("Scrolled to the end of the page!");
        setIsBottom(false); // Reset the state
    }

    return () => {
    //   clearTimeout(debounce);
    };
  }, [isBottom]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // if(useRedux) {
  return {
    searchParams: {
      search_term: searchQry,
      limit: limit,
      page,
    },
    setSearchParams: (sParams: Params) => {
      dispatch(setReduxSearchParams(sParams));
    },
    tweets: searchedTweets,
    setTweets: (twts: TweetToDisplay[]) => {
      dispatch(setSearchedTweets(twts));
    },
  };
  // } else {
  //     return {
  //         searchParams,
  //         setSearchParams,
  //         tweets,
  //         setTweets,
  //     };
  // }
}

export default useGetTweets;
