"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
// import { } from 'next-auth/'

type SignInProps = {};

const SignIn: React.FC<SignInProps> = () => {
  const router = useRouter();
  const [user, setUser] = useState(undefined);

  const handleFacebookSignIn = () => signIn("facebook");
  const handleDiscordSignIn = () => signIn("discord");

  const handleSignUp = async () => {};

  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      console.log("You Need To Login");
    }
  }, [user]);

  return (
    <div className="mt-20">
      <div>
        {/* <button
          className="flex items-center p-3 border border-red-500 rounded-lg text-red-500 font-bold hover:bg-red-500 hover:text-white"
          onClick={handleGoogleSignIn}
        >
          <Image
            src="/google-icon.svg"
            height={20}
            width={20}
            alt="Google Social Button Icon"
          />
          Sign in with Google
        </button> */}
        <button
          className="flex items-center p-3 border border-blue-600 rounded-lg text-blue-600 font-bold hover:bg-blue-600 hover:text-white"
          onClick={handleFacebookSignIn}
        >
          <Image
            src="/facebook-icon.svg"
            height={20}
            width={20}
            alt="Facebook Social Button Icon"
          />
          Sign in with Facebook
        </button>
        <button
          className="flex items-center p-3 border border-purple-600 rounded-lg text-purple-600 font-bold hover:bg-purple-600 hover:text-white"
          onClick={handleDiscordSignIn}
        >
          <Image
            src="/discord-icon.svg"
            height={20}
            width={20}
            alt="Discord Social Button Icon"
          />
          Sign in with Discord
        </button>
      </div>
    </div>
  );
};
export default SignIn;
