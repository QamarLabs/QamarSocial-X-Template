// app/layout.j
import "../styles/globals.css";
import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import Header from "./components/layout/Header";
const PageContainer = dynamic(() => import("./components/PageContainer"), {
  ssr: false,
});
const ThemeProviderWrapper = dynamic(
  () => import("./components/layout/ThemeProviderWrapper"),
  { ssr: false }
);
const SessionProviderWrapper = dynamic(
  () => import("./components/layout/SessionProviderWrapper"),
  { ssr: false }
);
const ReduxProviderWrapper = dynamic(
  () => import("./components/layout/ReduxProviderWrapper"),
  { ssr: false }
);
const LoadingSpinner = dynamic(
  () => import("./components/layout/LoadingSpinner"),
  { ssr: false }
);


export const metadata: Metadata = {
  title: "Qamar Social",
  description: "The X Clone",
  icons: "https://res.cloudinary.com/aa1997/image/upload/v1720488120/Qamar_Social-removebg-preview.png",
  openGraph: {
    title: "Qamar Social",
    description: "The X Clone",
    url: "https://myapp.com",

    images: [
      {
        url: "https://res.cloudinary.com/aa1997/image/upload/v1720488120/Qamar_Social-removebg-preview.png",
        width: 560,
        height: 440,
        alt: "Qamar Social ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@qamarsocial",
    creator: "@qamarsocial",
    title: "Qamar Social",
    description: "The X Clone",
    images:
      "https://res.cloudinary.com/aa1997/image/upload/v1720488120/Qamar_Social-removebg-preview.png",
  },
};

interface LayoutProps {
  className?: string;
  metadata?: Metadata;
}

export default async function RootLayout({
  children,
  metadata,
}: React.PropsWithChildren<LayoutProps>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper
          session={session}
          refetchInterval={5 * 60}
          refetchWhenOffline={false}
        >
          <ReduxProviderWrapper>
            <ThemeProviderWrapper>
              <Header metadata={metadata} />

              <div className="mx-auto max-h-screen overflow-hidden lg:max-w-6xl">
                <main className="grid grid-cols-9">
                  <Suspense
                    fallback={
                      <LoadingSpinner color="text-green-500" size="w-8 h-8" />
                    }
                  >
                    <PageContainer>{children}</PageContainer>
                  </Suspense>
                </main>
              </div>
            </ThemeProviderWrapper>
          </ReduxProviderWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
