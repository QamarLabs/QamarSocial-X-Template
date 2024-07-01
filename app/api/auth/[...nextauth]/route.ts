// pages/api/auth/[...nextauth].ts
import { faker } from "@faker-js/faker";
import { getEmailUsername } from "@utils/neo4j/index";
import { defineDriver, read, write } from "@utils/neo4j/neo4j";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const sessionQuery = `
    MATCH (user:User {email: $email})
    OPTIONAL MATCH (user)-[:BOOKMARKED]->(bookmark:Tweet)
    OPTIONAL MATCH (user)-[:RETWEETED]->(retweet:Tweet)
    OPTIONAL MATCH (user)-[:LIKES]->(likedTweet:Tweet)
    RETURN user,
          COLLECT(bookmark) AS bookmarks,
          COLLECT(retweet) AS retweets,
          COLLECT(likedTweet) AS likedTweets
`;
const checkUserQuery = `MATCH (user:User {email: $email}) return user`;

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session, token, user }) {
      const driver = defineDriver();
      const dSession = driver.session();
      if (session && session.user) {
        const usersInDb = await read(
          dSession,
          sessionQuery,
          {
            email: session.user.email,
          },
          ["user", "bookmarks", "retweets", "likedTweets"]
        );
        const userInDb = usersInDb && usersInDb.length ? usersInDb[0] : {};
        session.user = {
          ...session.user,
          ...userInDb.user,
          bookmarks: Array.from(new Set(userInDb.bookmarks.map((bk: any) => bk._id))),
          retweets: Array.from(new Set(userInDb.retweets.map((retweet: any) => retweet._id))),
          likedTweets: Array.from(new Set(userInDb.likedTweets.map((likedTweet: any) => likedTweet._id))),
        };

      }
      
      return session;
    },
    async signIn({ account, profile }) {
      // console.log("ACCOUNT:", account);
      // console.log("PROFILE:", profile);
      if (!profile?.email) {
        throw new Error("Profile doesn't exist.");
      }

      //Upsert functionality .
      try {
        const driver = defineDriver();
        const dSession = driver.session();
        const user = await read(
          dSession,
          checkUserQuery,
          {
            email: profile.email,
          },
          "user"
        );
        // console.log("Neo4j User:", user);
        if (!user?.length)
          await write(
            dSession,
            `
              CREATE (u:User {
                _id: $_id,
                _createdAt: $_createdAt,
                _updatedAt: $_updatedAt,
                username: $username,
                countryOfOrigin: $countryOfOrigin,
                email: $email,
                phone: $phone,
                bgThumbnail: $bgThumbnail,
                avatar: $avatar,
                dateOfBirth: $dateOfBirth,
                geoId: $geoId,
                maritalStatus: $maritalStatus,
                preferredMadhab: $preferredMadhab,
                hobbies: $hobbies,
                frequentMasjid: $frequentMasjid,
                favoriteQuranReciters: $favoriteQuranReciters,
                favoriteIslamicScholars: $favoriteIslamicScholars,
                islamicStudyTopics: $islamicStudyTopics,
                verified: false
              })`,
            {
              _id: faker.datatype.uuid(),
              _createdAt: new Date().toUTCString(),
              _updatedAt: null,
              username: getEmailUsername(profile.email),
              email: profile.email,
              countryOfOrigin: null,
              phone: null,
              avatar: (profile as any)["picture"]
                ? (profile as any)["picture"]
                : null,
              bgThumbnail: faker.image.city(),
              dateOfBirth: null,
              geoId: null,
              maritalStatus: null,
              preferredMadhab: null,
              hobbies: null,
              frequentMasjid: null,
              favoriteQuranReciters: null,
              favoriteIslamicScholars: null,
              islamicStudyTopics: null,
            }
          );
      } catch (error) {
        console.log("Profile Login Error:", error);
      } finally {
        return true;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
