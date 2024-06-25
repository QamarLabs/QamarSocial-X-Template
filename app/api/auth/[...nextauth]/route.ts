// pages/api/auth/[...nextauth].ts
import { faker } from "@faker-js/faker";
import { getEmailUsername } from "@utils/index";
import { defineDriver, read, write } from "@utils/neo4j";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const reusableEmailQuery = "MATCH (u:User {username: $username}) RETURN u";


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
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token, user }) {
      const driver = defineDriver();
      const dSession = driver.session();
      if(session.user) {
        const loginUserInfo = await read(dSession, reusableEmailQuery, {
          username: session?.user ? getEmailUsername(session.user.email!) : "",
        });
        const loggedInUser = loginUserInfo?.length ? loginUserInfo[0] : {};
        session.user = { ...session.user, ...loggedInUser };
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

        const user = await read(dSession, reusableEmailQuery, {
          username: profile.email,
        });
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
                email: $username,
                phone: $phone,
                profileImg: $profileImg,
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
              username: profile.email,
              countryOfOrigin: null,
              phone: null,
              profileImg: (profile as any)["picture"]
                ? (profile as any)["picture"]
                : null,
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
