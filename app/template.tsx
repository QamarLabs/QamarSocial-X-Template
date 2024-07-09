// app/template.tsx

"use client";

import { toggleLoginModal } from "@localredux/slices/modals";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Template({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const unprotectedRoutes = ['/', '/explore', '/search'];

  useEffect(() => {
    if(!(session && session.user) && !unprotectedRoutes.some(unR => unR === pathname)) {
      dispatch(toggleLoginModal(true));
      redirect('/');
    }
  }, [session])
 
  return <>{children}</>;
}
