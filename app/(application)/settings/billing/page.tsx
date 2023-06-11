import { CheckoutCard } from "@/components/checkout-card";
import { Title } from "@/components/ui/title";
import { service } from "@/service";
import { redirect } from "next/navigation";

export default async function BillingSettingsPage() {
  const [account, user] = await service.account.get();

  if (!user) redirect("/sign-in");
  if (!account) redirect("/sign-up");

  const [success, isSubscribed] =
    await service.subscription.getUserSubscriptionPlan(account.id);

  if (!success) redirect("/sign-up");

  return (
    <>
      <div className="mb-4">
        <Title className="text-3xl">Billing Settings</Title>
        <p className="text-muted-foreground">Manage your subscriptions</p>
      </div>
      <CheckoutCard account={account} isSubscribed={isSubscribed} />
    </>
  );
}
