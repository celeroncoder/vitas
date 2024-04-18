import { CreateAccountForm } from "@/components/create-account";
import { service } from "@/service";
import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

export default async function CreateAccountPage() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const account = await service.account.getOne(user.id);

  if (account) redirect("/dashboard");

  return <CreateAccountForm id={user.id} />;
}
