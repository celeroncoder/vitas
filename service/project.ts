import { prisma } from "@/lib/db";
import { ProjectCreateProps, ProjectUpdateProps } from "@/lib/validators";
import { Project } from "@prisma/client";
import { z } from "zod";

async function getAll(userId: string): Promise<Project[]> {
  return await prisma.project.findMany({ where: { userId } });
}

async function getOne(id: string): Promise<Project | null> {
  return await prisma.project.findUnique({ where: { id } });
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

async function update(
  id: string,
  project: z.infer<typeof ProjectUpdateProps>
): Promise<[boolean, Project | unknown]> {
  try {
    return [
      true,
      await prisma.project.update({
        where: { id },
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
  update,
  getOne,
};
