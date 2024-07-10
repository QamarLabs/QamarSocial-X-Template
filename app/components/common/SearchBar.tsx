"use client";
import { setSearchQry } from "@localredux/slices/search";
import { AppDispatch, RootState } from "@localredux/store";
import { retrieveQueryString, stopPropagationOnClick } from "@utils/neo4j";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

interface SearchBarProps {
    fullWidth?: boolean;
}

function SearchBar({ fullWidth }: SearchBarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { searchQry, page, limit } = useSelector(
    (store: RootState) => store.search
  );

  const onSearch = () => {
    const qryString = retrieveQueryString({
      search_term: searchQry,
      page,
      limit,
    });
    // if(pathname != '/search')
      router.push(`/search${qryString}`);
    // else
      
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(setSearchQry(e.target.value));

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the Enter key was pressed
    if (e.key === "Enter") {
      // Prevent the default form submit behavior if inside a form
      e.preventDefault();
      onSearch();
      1;
    }
  };

  return (
    <div className={`relative text-gray-800 ${fullWidth ? "w-full" : "w-80"} p-5 dark:text-gray-500 flex`}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex cursor-pointer item-center space-x-3 text-gray-400 hover:text-twitter p-2"
        onClick={(e) => stopPropagationOnClick(e, onSearch)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 items-center"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </motion.div>

      <input
        onKeyDown={handleSearchKeyDown}
        onChange={handleSearchChange}
        value={searchQry}
        type="search"
        name="search"
        placeholder="Search Qamar Social"
        className="bg-dim-700 h-10 px-10 pr-5 w-full rounded-full text-sm focus:outline-none bg-purple-white shadow border-0 dark:bg-gray-800 dark:text-gray-200"
      />
    </div>
  );
}

export default SearchBar;
