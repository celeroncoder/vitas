// @ts-nocheck
import { service } from "@/service";

// return [status, isSubscribed]
export async function getUserSubscriptionPlan(
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
