// pages/protected.tsx
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function MessagesPage() {
  const session = await getServerSession();
  if (!session) {
    return redirect("/");
  }

  return (
    <div>
      <h1>You have no messages</h1>
    </div>
  );
}

export default MessagesPage;
