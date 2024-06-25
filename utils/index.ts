export interface Params {
  limit?: number;
  search_term?: string;
}

export function retrieveQueryString(params: Params | undefined) {
  let queryString = "?";
  if (params) {
    if (params.search_term) queryString += `searchTerm=${params.search_term}`;
    if (params.limit) queryString += `limit=${params.limit}`;
  }
  return queryString;
}

export function stopPropagationOnClick<T>(e: React.MouseEvent<T>, callback: Function) {
  e.stopPropagation();
  callback();
}

export const nonRoutableTitles = ["Sign In", "Sign Out", "More" ];

export function getEmailUsername(email: string): string {
  const [username] = email.split('@');
  return username;
}