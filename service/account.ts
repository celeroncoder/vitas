import { prisma } from "@/lib/db";
import { AccountCreateProps, AccountUpdateData } from "@/lib/validators";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@clerk/nextjs/dist/types/server";
import { Account } from "@prisma/client";
import { z } from "zod";

async function get(): Promise<[Account | null, User | null]> {
  const user = await currentUser();
  if (user) {
    const account = await prisma.account.findUnique({
      where: { id: user.id },
    });

    if (account) return [account, user];
    else return [null, user];
  } else return [null, null];
}

async function getOne(id: string) {
  return await prisma.account.findUnique({ where: { id } });
}

async function create(
  account: z.infer<typeof AccountCreateProps>
): Promise<[boolean, unknown | Account]> {
  try {
    const newAccount = await prisma.account.create({
      data: { ...account },
    });
    if (newAccount) return [true, newAccount];
    else return [false, new Error("Account couldn't be created.")];
  } catch (error) {
    return [false, error];
  }
}

const update = async (props: {
  data: AccountUpdateData;
  id?: string;
  stripeSubscriptionId?: string;
}): Promise<[boolean, unknown]> => {
  const { data, id, stripeSubscriptionId } = props;
  try {
    const updatedAccount = await prisma.account.update({
      where: id ? { id } : { stripeSubscriptionId },
      data: { ...data },
    });

    if (updatedAccount) return [true, updatedAccount];
    else return [false, new Error("Account couldn't be updated.")];
  } catch (error) {
    console.error(error);
    return [false, error];
  }
};

export const account = {
  getOne,
  get,
  create,
  update,
};
