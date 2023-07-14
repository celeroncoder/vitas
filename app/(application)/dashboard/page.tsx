import { CreateProjectForm } from "@/components/create-project";
import { ProjectGrid } from "@/components/project-grid";
import { Title } from "@/components/ui/title";
import { service } from "@/service";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard | get.id",
	description: "get.id Dashboard | Manage your projects",
};

export default async function Dashboard() {
	const { userId } = auth();
	const projects = await service.project.getAll(userId!);

	return (
		<>
			<div className="w-full flex items-center justify-between px-4 py-2 my-4">
				<Title className="text-2xl">Your Projects</Title>
				<CreateProjectForm />
			</div>
			{projects && <ProjectGrid projects={projects} />}
			{projects.length <= 0 && (
				<div className="relative w-full py-4 px-2">
					<p className="text-center text-gray-500">
						You don't have any projects yet. Create one now!
					</p>
				</div>
			)}
		</>
	);
}
