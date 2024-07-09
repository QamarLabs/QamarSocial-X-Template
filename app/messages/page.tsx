// pages/protected.tsx
import { NoRecordsTitle } from "@components/common/Titles";
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
      <NoRecordsTitle>You have no messages!</NoRecordsTitle>
    </div>
  );
}

export default MessagesPage;
