import { AddMember } from "@/components/add-member";
import { AddMembersCSV } from "@/components/add-members-csv";
import { MembersTable } from "@/components/members-table";
import ProjectNotFoundPage from "@/components/project-not-found";
import { Sidebar } from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import { Wrapper } from "@/components/wrapper";
import { service } from "@/service";

type ProjectPageProps = {
  params: { id: string };
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await service.project.getOne(params.id);
  const members = await service.member.getAll(params.id);

  if (!project) return <ProjectNotFoundPage />;

  return (
    <Wrapper>
      <div className="flex w-full flex-1">
        <Sidebar />
        <main className="flex-1 px-4">
          <div className="w-full flex flex-wrap gap-2 items-center justify-between py-2 my-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Project: "{project.name}"
              </p>
              <Title className="text-2xl">Your Members</Title>
            </div>
            <div className="flex items-center gap-2">
              <AddMembersCSV project={project} />
              <AddMember project={project} />
            </div>
          </div>
          <Separator />
          <MembersTable members={members} />
        </main>
      </div>
    </Wrapper>
  );
}
