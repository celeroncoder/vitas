import { prisma } from "@/lib/db";
import { AccountCreateProps } from "@/lib/validators";
import { Account } from "@prisma/client";
import { z } from "zod";

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
};
