import { ZodString, z } from "zod";

export const CardEmailSendProps = z.object({
  cardUrl: z.string().url(),
  member: z.object({
    name: z.string(),
  }),
  projectDisplayName: z.string(),
  projectOwnerName: z.string(),
});

export type CardEmailSendProps = z.infer<typeof CardEmailSendProps>;

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
  email: z.string().email().optional(),

  projectId: z.string(),
});

export const MemberUpdateProps = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  position: z.string().min(1),
});

export const RequiredMemberFields = ["name", "username", "position"] as const;
export const OptionalMemberFields = ["email"] as const;
export const MemberFields = [
  ...RequiredMemberFields,
  ...OptionalMemberFields,
] as const;

export type OptionalMemberFields = (typeof OptionalMemberFields)[number];
export type RequiredMemberFields = (typeof RequiredMemberFields)[number];
export type MemberFields = (typeof MemberFields)[number];

function generateRowsValidator() {
  const shape: {
    [key in MemberFields]: z.ZodOptional<ZodString>;
  } = (() => {
    let propsObj: any = {};
    for (const key of MemberFields) {
      propsObj[key] = z.string().optional();
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
