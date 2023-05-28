import { prisma } from "@/lib/db";
import { ProjectCreateProps } from "@/lib/validators";
import { Project } from "@prisma/client";
import { z } from "zod";

async function getAll(userId: string): Promise<Project[]> {
  return await prisma.project.findMany({ where: { userId } });
}

async function create(
  project: z.infer<typeof ProjectCreateProps>
): Promise<[boolean, Project | unknown]> {
  try {
    return [
      true,
      await prisma.project.create({
        data: { ...project },
      }),
    ];
  } catch (error) {
    return [false, error];
  }
}

export const project = {
  getAll,
  create,
};
