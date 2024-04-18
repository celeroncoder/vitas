import { CreateProjectForm } from "@/components/create-project";
import { ProjectGrid } from "@/components/project-grid";
import { Title } from "@/components/ui/title";
import { service } from "@/service";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | VITAS",
  description: "VITAS Dashboard | Manage your events",
};

export default async function Dashboard() {
  const { userId } = auth();
  const projects = await service.project.getAllByUserId(userId!);

  return (
    <>
      <div className="w-full flex items-center justify-between px-4 py-2 my-4">
        <Title className="text-2xl">Your Events</Title>
        <CreateProjectForm />
      </div>
      {projects && <ProjectGrid projects={projects} />}
      {projects.length <= 0 && (
        <div className="relative w-full py-4 px-2">
          <p className="text-center text-gray-500">
            You don't have any events yet. Create one now!
          </p>
        </div>
      )}
    </>
  );
}
