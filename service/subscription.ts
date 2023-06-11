// @ts-nocheck
import { stripe } from "@/lib/stripe";
import { service } from "@/service";

// return [status, isSubscribed]
export async function isUserSubscribed(
  accountId: string
): Promise<[boolean, boolean]> {
  const account = await service.account.getOne(accountId);

  if (!account) return [false, false];

  const isSubscribed =
    account.stripePriceId &&
    account.stripeCurrentPeriodEnd &&
    account.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now();

  return [true, isSubscribed];
}

export async function isSubscriptionCanceled(
  subscriptionId: string
): Promize<boolean> {
  try {
    const stripePlan = await stripe.subscriptions.retrieve(subscriptionId);

    return stripePlan.cancel_at_period_end;
  } catch (error) {
    console.error(error);
    return false;
  }
}
