import { CreateAccount } from "@/components/create-account";
import { service } from "@/service";
import { currentUser } from "@clerk/nextjs";

import { redirect } from "next/navigation";

export default async function CreateAccountPage() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const account = await service.account.getOne(user.id);

  if (account) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <CreateAccount user={user} />
    </div>
  );
}
