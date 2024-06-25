import { Metadata } from "next";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

interface HeaderProps {
  metadata: Metadata | undefined;
}

function Header({ metadata }: HeaderProps) {
  return (
    <>
      <div className="mx-auto max-h-screen overflow-hidden lg:max-w-6xl">
        <Head>
          <title>{metadata ? metadata.title as string : 'Qamar Social'}</title>
          <meta name="description" content="Qamar Social" />
          <link
            rel="icon"
            href="https://res.cloudinary.com/aa1997/image/upload/v1717352483/xqqejvpf6hwmmntj438l.png"
          />
        </Head>
        <Toaster />
      </div>
    </>
  );
}

export default Header;
