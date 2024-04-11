import { z } from "zod";

export const CardEmailSendData = z.object({
  cardUrl: z.string().url(),
  member: z.object({
    name: z.string(),
  }),
  projectDisplayName: z.string(),
  projectOwnerName: z.string(),
});

export type CardEmailSendData = z.infer<typeof CardEmailSendData>;

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

export type ProjectCreateProps = z.infer<typeof ProjectCreateProps>;

export const ProjectUpdateProps = z.object({
  name: z.string().min(3),
  displayName: z.string().min(3),
  displayUrl: z.string().optional(),

  // bannerImageUrl: z.string().optional(),
  from: z.date().optional(),
  to: z.date().optional(),
  fee: z.number().optional(),
});

export type ProjectUpdateProps = z.infer<typeof ProjectUpdateProps>;

export const ProjectUpdateReqBody = z.object({
  name: z.string().min(3),
  displayName: z.string().min(3),
  displayUrl: z.string().optional(),

  // bannerImageUrl: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  fee: z.number().optional(),
});

export type ProjectUpdateReqBody = z.infer<typeof ProjectUpdateReqBody>;

export const MemberCreateProps = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  position: z.string().min(1),
  email: z.string().email().nullable(),

  projectId: z.string(),
});

export type MemberCreateProps = z.infer<typeof MemberCreateProps>;

export const MemberUpdateProps = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  position: z.string().min(1),
  email: z.string().email().nullable(),
});
export type MemberUpdateProps = z.infer<typeof MemberUpdateProps>;

export const MemberFields = ["name", "username", "position", "email"] as const;
export type MemberFields = (typeof MemberFields)[number];

export const MemberCreateMultipleProps = z.object({
  rows: z
    .object({
      name: z.string().min(1),
      username: z.string().min(1),
      position: z.string().min(1),
      email: z.string().email().nullable(),
    })
    .array(),
  projectId: z.string().cuid(),
});
export type MemberCreateMultipleProps = z.infer<
  typeof MemberCreateMultipleProps
>;

export type MemberCreateRows = MemberCreateMultipleProps["rows"];

export const MemberDeleteManyProps = z.object({
  ids: z.number().array(),
});
