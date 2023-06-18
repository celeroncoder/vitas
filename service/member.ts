import { prisma } from "@/lib/db";
import {
  MemberCreateMultipleProps,
  MemberCreateProps,
  MemberUpdateProps,
} from "@/lib/validators";
import type { Member } from "@prisma/client";
import { z } from "zod";

const getAll = async (projectId: string): Promise<Member[]> => {
  return await prisma.member.findMany({ where: { projectId } });
};

const create = async (
  member: z.infer<typeof MemberCreateProps>
): Promise<[boolean, unknown | Member]> => {
  try {
    const newMember = await prisma.member.create({
      data: { ...member },
    });
    if (newMember) return [true, newMember];
    else return [false, new Error("Member couldn't be created.")];
  } catch (error) {
    return [false, error];
  }
};

const createMany = async (
  projectId: string,
  rows: z.infer<typeof MemberCreateMultipleProps>["rows"]
): Promise<[boolean, unknown]> => {
  try {
    const newMembers = await prisma.member.createMany({
      data: rows.map((row) => ({ ...row, projectId: projectId })),
      skipDuplicates: true,
    });
    if (newMembers) return [true, newMembers];
    else return [false, new Error("Member couldn't be created.")];
  } catch (error) {
    return [false, error];
  }
};

const update = async (
  id: z.infer<z.ZodNumber>,
  member: z.infer<typeof MemberUpdateProps>
): Promise<[boolean, Member | unknown]> => {
  try {
    const updatedMember = await prisma.member.update({
      where: { id },
      data: { ...member },
    });
    if (updatedMember) return [true, updatedMember];
    else return [false, new Error("Member couldn't be updated.")];
  } catch (error) {
    return [false, error];
  }
};

const deleteMember = async (id: number): Promise<[boolean, unknown]> => {
  try {
    const deletedMember = await prisma.member.delete({ where: { id } });
    if (deletedMember) return [true, undefined];
    else return [false, new Error("Member couldn't be deleted.")];
  } catch (error) {
    return [false, error];
  }
};

const deleteMany = async (ids: number[]): Promise<[boolean, unknown]> => {
  try {
    const deletedMembers = await prisma.member.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    if (deletedMembers) return [true, undefined];
    else return [false, new Error("Members couldn't be defeated.")];
  } catch (error) {
    return [false, error];
  }
};

export const member = {
  create,
  createMany,
  getAll,
  update,
  deleteMember,
  deleteMany,
};
