import ProjectNotFoundPage from "@/components/project-not-found";
import { Sidebar } from "@/components/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import { UpdateProject } from "@/components/update-project";
import { Wrapper } from "@/components/wrapper";
import { service } from "@/service";

type ProjectSettingsPageProps = {
  params: { id: string };
};

export default async function ProjectSettingsPage({
  params,
}: ProjectSettingsPageProps) {
  const project = await service.project.getOne(params.id);

  if (!project) return <ProjectNotFoundPage />;

  return (
    <Wrapper>
      <div className="flex w-full flex-1">
        <Sidebar />
        <main className="flex-1 flex lg:flex-row md:flex-row flex-col gap-16 px-4 py-2">
          {/* update col */}
          <div className="flex-[0.6] my-2">
            <div className="mb-6">
              <Title className="text-2xl mb-2">Update Project</Title>
              <Separator />
            </div>
            <UpdateProject project={project} />
          </div>

          {/* usage col */}
          <div className="flex-[0.4] my-2 flex flex-col gap-4">
            <div className="mb-6">
              <Title className="text-2xl mb-2">Usage</Title>
              <Separator />
            </div>
            <p className="text-muted-foreground text-sm">
              🚧 This is under construction 🚧
            </p>
          </div>
        </main>
      </div>
    </Wrapper>
  );
}
