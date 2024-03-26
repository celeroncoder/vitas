import { prisma } from "@/lib/db";
import {
  CardEmailSendData,
  ProjectCreateProps,
  ProjectUpdateProps,
} from "@/lib/validators";
import { Member, Project } from "@prisma/client";
import { NextApiRequest } from "next";
import { z } from "zod";
import { service } from ".";
import { getBaseUrl } from "@/lib/utils";
import { currentUser, getAuth } from "@clerk/nextjs/server";
import { TriggerWorkflowProperties } from "@knocklabs/node";
import { knock } from "@/lib/knock";

async function getAll(userId: string): Promise<Project[]> {
  return await prisma.project.findMany({ where: { userId } });
}

async function getOne(id: string): Promise<Project | null> {
  return await prisma.project.findUnique({ where: { id } });
}

async function create(
  project: ProjectCreateProps
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

const deleteProject = async (id: string): Promise<[boolean, unknown]> => {
  try {
    const deletedProject = await prisma.project.delete({ where: { id } });
    if (deletedProject) return [true, undefined];
    else return [false, new Error("Project couldn't be deleted.")];
  } catch (error) {
    return [false, error];
  }
};

const sendEmail = async (id: string) => {
  try {
    console.time();
    const project = await getOne(id);
    if (!project) return [false, new Error("Project not found.")];

    let members = await service.member.getAll(project.id);
    if (!members) return [false, new Error("Members not found.")];

    // filtering members with email
    members = members.filter((member) => (member.email ? true : false));

    const user = await currentUser();
    if (!user) return [false, new Error("User not found.")];

    const projectOwnerName =
      user.username || user.firstName || "Anonymous Owner";

    const triggerProps: TriggerWorkflowProperties[] = members.map((member) => ({
      data: {
        cardUrl: `${getBaseUrl()}/card/${member.id}`,
        member: {
          name: member.name,
        },
        projectDisplayName: project.displayName,
        projectOwnerName,
      },
      recipients: [
        {
          collection: "members",
          id: member.id.toString(),
          email: member.email,
          name: member.name,
        },
      ],
    }));

    const workflowTriggerIds: string[] = [];

    for (const props of triggerProps) {
      const res = await knock.workflows.trigger(
        "vitas-id-card-delievery",
        props
      );
      workflowTriggerIds.push(res.workflow_run_id);
    }

    console.timeEnd();
    return [true, { count: triggerProps.length, workflowTriggerIds }];
  } catch (error) {
    console.error(error);
    return [false, new Error((error as any).message || "")];
  }
};

export const project = {
  getAll,
  create,
  update,
  getOne,
  deleteProject,
  sendEmail,
};
