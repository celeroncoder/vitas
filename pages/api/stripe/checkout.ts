import { env } from "@/env.mjs";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { StripeChecoutSessionCreateProps } from "@/lib/validators";
import { service } from "@/service";
import { isUserSubscribed } from "@/service/subscription";
import { NextApiRequest, NextApiResponse } from "next";

const billingUrl = absoluteUrl(
  "/settings/billing?session_id={CHECKOUT_SESSION_ID}"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const parsedBody = StripeChecoutSessionCreateProps.safeParse(req.body);
    if (parsedBody.success) {
      const body = parsedBody.data;

      try {
        const account = await service.account.getOne(body.accountId);
        if (!account) return res.status(401).end("Unauthorized");

        const [success, isSubscribed] = await isUserSubscribed(account.id);

        if (!success) return res.status(500).end("Internal server error");

        // the user is already on pro plan and want a portal to manage subscription
        if (isSubscribed && account.stripeCustomerId) {
          const stripeSession = await stripe.billingPortal.sessions.create({
            customer: account.stripeCustomerId,
            return_url: absoluteUrl("/settings/billing"),
          });

          return res.status(201).json({ url: stripeSession.url });
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

        res.status(201).json({ url: stripeSession.url });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: error || "Internal server error" });
      }
    } else {
      return res.status(400).end("Invalid request body");
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method not allowed");
  }
}
