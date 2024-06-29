export interface ReduxSearchState {
  searchQry: string;
  page: number;
  limit: number;
  searchedTweets: TweetToDisplay[];
}

export interface UserProfileTweets {
  likedTweet: TweetToDisplay[];
  retweetedTweets: TweetToDisplay[];
  bookmarkedTweets: TweetToDisplay[];
  commentedTweets: TweetToDisplay[];
  userTweets: TweetToDisplay[];
}
export interface TweetToDisplay {
  tweet: TweetRecord,
  comments: Comment[],
  commenters: User[],
  retweeters: User[],
  likers: User[]
}

export interface TweetRecord extends TweetBody {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "tweet";
  blockTweet: boolean;
  likes?: string[]
}

export interface ProfileUser {
  user: User;
  bookmarks: string[];
}

export interface User extends UserInfo {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  dateOfBirth?: string;
  geoId?: string;1
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  hobbies?: string[];
  preferredMadhab?: 'Hanafi' | "Shafi'i" | 'Maliki' | 'Hanbali' | "Salafi";
  frequentMasjid?: string;
  favoriteQuranReciters?: string[];
  favoriteIslamicScholars?: string[];
  islamicStudyTopics?: string[];
  verified: boolean;
}

export type UserInfo = {
  username: string;
  countryOfOrigin: string;
  avatar: string;
  bgThumbnail: string;
  email: string;
  phone?: string;
  personalInfo?: PersonalInfo;
  personalInterests?: PersonalInterests;
};

export type TweetBody = {
  text: string;
  username: string;
  profileImg: string;
  image?: string;
};

export type CommentBody = {
  // comment: string;
  // tweetId: string;
  // username: string;
  // profileImg: string;
};

export interface Comment extends CommentBody {
  // _createdAt: string;
  // _id: string;
  // _updatedAt: string;
  // _rev: string;
  // _type: "comment";
  // tweet: {
  //   _ref: string;
  //   _type: "reference";
  // };
  image:  string;
  _createdAt: string;
  _id: string;
  text: string;
  profileImg: string;
  _updatedAt: string;
  username: string;
}

/// Exceptions ///////////////////
// export enum ErrorTypes {
//   Tweet = "Tweet",
//   Tweets = "Tweets",
//   User = "User",
//   Users = "Users",
//   Comment = "Comment",
//   Comments = "Comments",
//   Communities = "Communities",
//   Bookmarks = "Bookmarks",
//   Lists = "Lists"
// }
// export class FetchError extends Error {
//   constructor(errorType: keyof typeof ErrorTypes) {
//     super(`Sorry, we can't fetch ${ErrorTypes[errorType]}. Contact support`);
        
//     // Set the name of the error to the class name
//     this.name = 'FetchError';
    
//     // Set the prototype explicitly to maintain the instanceof checks
//     Object.setPrototypeOf(this, FetchError.prototype);
//   }
// }