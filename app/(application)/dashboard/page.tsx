import { CreateProject, CreateProjectForm } from "@/components/create-project";
import { ProjectGrid } from "@/components/project-grid";
import { Title } from "@/components/ui/title";
import { service } from "@/service";
import { auth } from "@clerk/nextjs";

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
		</>
	);
}
