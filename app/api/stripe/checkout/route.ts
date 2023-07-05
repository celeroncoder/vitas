import { env } from "@/env.mjs";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { StripeChecoutSessionCreateProps } from "@/lib/validators";
import { service } from "@/service";
import { isUserSubscribed } from "@/service/subscription";

const billingUrl = absoluteUrl(
	"/settings/billing?session_id={CHECKOUT_SESSION_ID}"
);

export async function POST(req: Request) {
	const parsedBody = StripeChecoutSessionCreateProps.safeParse(
		await req.json()
	);

	if (!parsedBody.success)
		return new Response(
			JSON.stringify({
				error: "Invalid Request, couldn't parse request body.",
			}),
			{ status: 400 }
		);

	try {
		const body = parsedBody.data;
		const account = await service.account.getOne(body.accountId);

		if (!account)
			return new Response(
				JSON.stringify({
					error: "Unauthorized",
				}),
				{ status: 401 }
			);

		const [success, isSubscribed] = await isUserSubscribed(account.id);

		if (!success)
			return new Response(
				JSON.stringify({
					error: "Internal server error",
				}),
				{ status: 500 }
			);

		// the user is already on pro plan and want a portal to manage subscription
		if (isSubscribed && account.stripeCustomerId) {
			const stripeSession = await stripe.billingPortal.sessions.create({
				customer: account.stripeCustomerId,
				return_url: absoluteUrl("/settings/billing"),
			});

			return new Response(
				JSON.stringify({
					url: stripeSession.url,
				}),
				{ status: 201 }
			);
		}

		// the user is on free plan is upgrading
		// creating a checkout session to upgrade
		const stripeSession = await stripe.checkout.sessions.create({
			success_url: billingUrl,
			cancel_url: billingUrl,
			payment_method_types: ["card"],
			mode: "subscription",
			billing_address_collection: "auto",
			customer_email: body.email,
			line_items: [
				{
					price: env.STRIPE_PREMIUM_PLAN_PRICE_ID,
					quantity: 1,
				},
			],
			metadata: {
				accountId: body.accountId,
			},
		});

		return new Response(
			JSON.stringify({
				url: stripeSession.url,
			}),
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({
				error: error || "Internal server error",
			}),
			{ status: 500 }
		);
	}
}
