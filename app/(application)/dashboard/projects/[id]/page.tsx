import { AddMemberForm } from "@/components/add-member";
import { AddMembersCSVForm } from "@/components/add-members-csv";
import { MembersTable } from "@/components/members-table";
import ProjectNotFoundPage from "@/components/project-not-found";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import { service } from "@/service";
import { Metadata } from "next";
import { z } from "zod";

type ProjectPageProps = {
	params: { id: string };
};

export async function generateMetadata({
	params,
}: ProjectPageProps): Promise<Metadata> {
	const parsedId = z.string().cuid().safeParse(params.id);

	if (!parsedId.success)
		return {
			title: "Project Not Found | get.id",
			description: "The Requested project couldn't be found.",
		};

	const project = await service.project.getOne(parsedId.data);

	if (!project)
		return {
			title: "Project Not Found | get.id",
			description: "The Requested project couldn't be found.",
		};

	return {
		title: `Project "${project.name}" | get.id`,
		description: `Project: "${project.displayName}" | URL: ${project.displayUrl}`,
	};
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	const project = await service.project.getOne(params.id);
	const members = await service.member.getAll(params.id);

	if (!project) return <ProjectNotFoundPage />;

	return (
		<>
			<div className="w-full flex flex-wrap gap-2 items-center justify-between pt-1 pb-4">
				<div>
					<p className="text-sm text-muted-foreground">
						Project: "{project.name}"
					</p>
					<Title className="text-2xl">Your Members</Title>
				</div>
				<div className="flex items-center gap-2">
					<AddMembersCSVForm project={project} />
					<AddMemberForm project={project} />
				</div>
			</div>
			<Separator />
			<MembersTable members={members} />
		</>
	);
}
