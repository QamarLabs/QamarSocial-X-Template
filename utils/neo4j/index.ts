import { TweetToDisplay } from "typings";

export interface Params {
  page?: number;
  limit?: number;
  search_term?: string;
}

export function retrieveQueryString(params: Params | undefined) {
  let queryString = "?";
  if (params) {
    if (params.page) queryString += `page=${params.page}&`;
    if (params.search_term) queryString += `searchTerm=${params.search_term}&`;
    if (params.limit) queryString += `limit=${params.limit}`;
  }
  return queryString;
}

export function convertQueryStringToObject(queryString: string) {
  // Convert the query string to an object
  const queryParams = new URLSearchParams(queryString);

  // Create an object to hold the parameters
  const paramsObject: any = {};

  // Loop through each parameter and add it to the object
  for (let [key, value] of queryParams) {
    paramsObject[key] = value;
  }

  return {
    page: paramsObject["page"],
    limit: paramsObject["limit"],
    search_term: paramsObject["searchTerm"],
  } as Params;
}

export function stopPropagationOnClick<T>(
  e: React.MouseEvent<T>,
  callback: Function
) {
  e.stopPropagation();
  callback();
}

export const nonRoutableTitles = ["Sign In", "Sign Out", "More"];

export function getEmailUsername(email: string): string {
  const [username] = email.split("@");
  return username;
}

export const defaultSearchParams = {
  page: 1,
  limit: 20,
  search_term: "",
};

export const isTweetSearchAMatch = (
  twt: TweetToDisplay,
  searchQry: string
): boolean => {
  return (
    twt.tweet.username.includes(searchQry) ||
    twt.tweet.text.includes(searchQry) ||
    twt.tweet._id === searchQry ||
    twt.commenters.some((c) => c.username === searchQry)
  );
};

export function getPercievedNumberOfRecord<T>(
  stateBool: boolean,
  origBool: boolean,
  loadedNumberOfRecords: T[]
) {
  if(stateBool && !origBool)
    return loadedNumberOfRecords.length + 1
  else if(!stateBool && origBool)
    return loadedNumberOfRecords.length - 1
  else
    return loadedNumberOfRecords.length;
}
