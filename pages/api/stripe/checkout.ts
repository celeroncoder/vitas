import { env } from "@/env.mjs";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { StripeChecoutSessionCreateProps } from "@/lib/validators";
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
