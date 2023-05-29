import { prisma } from "@/lib/db";
import { MemeberCreateProps } from "@/lib/validators";
import { Member } from "@prisma/client";
import { z } from "zod";

const getAll = async (projectId: string): Promise<Member[]> => {
  return await prisma.member.findMany({ where: { projectId } });
};

const create = async (
  member: z.infer<typeof MemeberCreateProps>
): Promise<[boolean, unknown | Member]> => {
  try {
    const newMember = await prisma.member.create({
      data: { ...member },
    });
    return [true, newMember];
  } catch (error) {
    return [false, error];
  }
};

export const member = { create, getAll };
