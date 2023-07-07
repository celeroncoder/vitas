import { prisma } from "@/lib/db";
import {
	CardEmailSendData,
	MemberCreateMultipleProps,
	MemberCreateProps,
	MemberUpdateProps,
} from "@/lib/validators";
import { currentUser } from "@clerk/nextjs/server";
import type { Member } from "@prisma/client";
import { z } from "zod";
import { service } from ".";
import { knock } from "@/lib/knock";
import { getBaseUrl } from "@/lib/utils";

const getAll = async (projectId: string): Promise<Member[]> => {
	return await prisma.member.findMany({ where: { projectId } });
};

const getOne = async (id: Member["id"]): Promise<Member | null> => {
	return await prisma.member.findUnique({ where: { id } });
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
		console.error("[MEMBER UPDATE]", error);
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

export const sendEmail = async (id: Member["id"]) => {
	try {
		const member = await getOne(id);
		if (!member) return [false, new Error("Member not found.")];

		const project = await service.project.getOne(member.projectId);
		if (!project) return [false, new Error("Project not found.")];

		const user = await currentUser();

		if (!user) return [false, new Error("Unauthorized.")];

		if (user.id !== project.userId) return [false, new Error("Unauthorized.")];

		const projectOwnerName = user.firstName || user.username || "Anonymous";

		const props: CardEmailSendData = {
			cardUrl: `${getBaseUrl()}/card/${member.id}`,
			member: {
				name: member.name,
			},
			projectDisplayName: project.displayName,
			projectOwnerName: projectOwnerName,
		};

		const res = await knock.workflows.trigger("get-id-card-delivery", {
			data: props,
			recipients: [
				{
					id: member.id.toString(),
					email: member.email,
					name: member.name,
					collection: "members",
				},
			],
		});

		return [true, res];
	} catch (error) {
		console.error(error);
		return [false, new Error((error as any).message || "")];
	}
};

export const member = {
	create,
	createMany,
	getAll,
	getOne,
	update,
	deleteMember,
	deleteMany,
	sendEmail,
};
