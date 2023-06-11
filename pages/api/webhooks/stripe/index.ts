import { env } from "@/env.mjs";
import { stripe } from "@/lib/stripe";
import { service } from "@/service";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = req.body;
    const signature = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    // getting the stripe event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res
        .status(400)
        .json({ message: `Webhook error: ${(error as any).message}` });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // for when the checkout session is completed
    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      if (!session?.metadata?.accountId)
        return res.status(400).json({
          message: "No account id found in checkout session metadata",
        });
      else {
        const [success, _] = await service.account.update({
          data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
          id: session?.metadata?.accountId!,
        });

        if (!success)
          return res.status(400).json({ message: "Error updating account" });
      }
    }

    // for when the incoice is paid
    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      const [success, _] = await service.account.update({
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
        stripeSubscriptionId: subscription.id,
      });

      if (!success)
        return res.status(400).json({ message: "Error updating account" });
    }

    return res.status(200).end(null);
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
