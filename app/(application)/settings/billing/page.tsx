import { CheckoutCard } from "@/components/checkout-card";
import { Title } from "@/components/ui/title";
import { stripe } from "@/lib/stripe";
import { service } from "@/service";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Billing | get.id",
	description: "Manage your subscriptions",
};

export default async function BillingSettingsPage({
	searchParams,
}: {
	searchParams: { session_id?: string };
}) {
	const [account, user] = await service.account.get();

	if (!user) redirect("/sign-in");
	if (!account) redirect("/sign-up");

	const { session_id: sessionId } = searchParams;

	if (sessionId) {
		const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
		const subscription = await stripe.subscriptions.retrieve(
			checkoutSession.subscription as string
		);

		// if subscription already exists and the user is trying to subscribe again
		if (account.stripeSubscriptionId) {
			const [success, _] = await service.account.update({
				data: {
					stripePriceId: subscription.items.data[0].price.id,
					stripeCurrentPeriodEnd: new Date(
						subscription.current_period_end * 1000
					),
				},
				stripeSubscriptionId: subscription.id,
			});

			if (success) redirect("/settings/billing");
		} else {
			const [success, _] = await service.account.update({
				data: {
					stripeSubscriptionId: subscription.id,
					stripeCustomerId: subscription.customer as string,
					stripePriceId: subscription.items.data[0].price.id,
					stripeCurrentPeriodEnd: new Date(
						subscription.current_period_end * 1000
					),
				},
				id: account.id,
			});

			if (success) redirect("/settings/billing");
		}
	}

	const [success, isSubscribed] = await service.subscription.isUserSubscribed(
		account.id
	);

	const isCanceled = await service.subscription.isSubscriptionCanceled(
		account.stripeSubscriptionId!
	);

	if (!success) redirect("/sign-up");

	return (
		<>
			<div className="mb-4">
				<Title className="text-3xl">Billing Settings</Title>
				<p className="text-muted-foreground">Manage your subscriptions</p>
			</div>
			<CheckoutCard
				account={account}
				isSubscribed={isSubscribed}
				isCanceled={isCanceled}
			/>
		</>
	);
}
