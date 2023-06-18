import { AddMember } from "@/components/add-member";
import { AddMembersCSV } from "@/components/add-members-csv";
import { MembersTable } from "@/components/members-table";
import ProjectNotFoundPage from "@/components/project-not-found";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import { service } from "@/service";

type ProjectPageProps = {
  params: { id: string };
};

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
          <AddMembersCSV project={project} />
          <AddMember project={project} />
        </div>
      </div>
      <Separator />
      <MembersTable members={members} />
    </>
  );
}