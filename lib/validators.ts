import { z } from "zod";
import { Account } from "@prisma/client";

export const StripeChecoutSessionCreateProps = z.object({
  email: z.string().email(),
  accountId: z.string(),
});

export type StripeChecoutSessionCreateProps = z.infer<
  typeof StripeChecoutSessionCreateProps
>;

export const StripeChecoutSessionCreateResult = z.object({
  url: z.string().url(),
});

export type StripeChecoutSessionCreateResult = z.infer<
  typeof StripeChecoutSessionCreateResult
>;

export const AccountUpdateData = z.object({
  stripeSubscriptionId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  stripePriceId: z.string(),
  stripeCurrentPeriodEnd: z.date(),
});

export type AccountUpdateData = z.infer<typeof AccountUpdateData>;

export const AccountCreateProps = z.object({
  id: z.string(),
});

export type AccountCreateProps = z.infer<typeof AccountCreateProps>;

export const ProjectCreateProps = z.object({
  userId: z.string().min(3),
  name: z.string().min(3),
  displayName: z.string().min(3),
  displayUrl: z.string().optional(),
});

export const ProjectUpdateProps = z.object({
  name: z.string().min(3),
  displayName: z.string().min(3),
  displayUrl: z.string().optional(),
});

export const MemberCreateProps = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  position: z.string().min(1),

  projectId: z.string(),
});

export const MemberUpdateProps = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  position: z.string().min(1),
});

export const MemberFields = ["name", "username", "position"] as const;
export type MemberFields = (typeof MemberFields)[number];

function generateRowsValidator() {
  const shape: { [key in MemberFields]: z.ZodString } = (() => {
    let propsObj: any = {};
    for (const key of MemberFields) {
      propsObj[key] = z.string();
    }
    return propsObj;
  })();

  return z.object(shape);
}

export const MemberCreateMultipleProps = z.object({
  rows: z.array(generateRowsValidator()),
  projectId: z.string().cuid(),
});

export type MemberCreateRows = z.infer<
  ReturnType<typeof generateRowsValidator>
>;

export const MemberDeleteManyProps = z.object({
  ids: z.number().array(),
});
