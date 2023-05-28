import { CreateProject } from "@/components/create-project";
import { ProjectGrid } from "@/components/project-grid";
import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { Wrapper } from "@/components/wrapper";
import { service } from "@/service";
import { auth } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export default async function Dashboard() {
  const { userId } = auth();
  const projects = await service.project.getAll(userId!);

  return (
    <Wrapper>
      <div className="w-full flex items-center justify-between px-4 py-2 my-4">
        <Title className="text-2xl font-bold tracking-tighter">
          Your Projects
        </Title>
        <CreateProject
          trigger={
            <Button className="group shadow-sm hover:shadow-lg duration-300">
              <Plus className="w-4 mr-2" /> Create Project
            </Button>
          }
        />
      </div>
      {projects && <ProjectGrid projects={projects} />}
    </Wrapper>
  );
}
