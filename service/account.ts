import { prisma } from "@/lib/db";
import { AccountCreateProps } from "@/lib/validators";
import { currentUser } from "@clerk/nextjs";
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

export const account = {
  getOne,
  create,
  get,
};
