import { AddMember } from "@/components/add-member";
import { Sidebar } from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import { Wrapper } from "@/components/wrapper";
import { service } from "@/service";
import Link from "next/link";

type ProjectPageProps = {
  params: { id: string };
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await service.project.getOne(params.id);

  if (!project)
    return (
      <Wrapper>
        <div className="flex items-center justify-center w-full p-4">
          <h1 className="text-xl">
            Sorry Didn't Find Anything,{" "}
            <Link
              href="/dashboard"
              className="underline underline-offset-2 text-lime-400"
            >
              see all projects
            </Link>
            .
          </h1>
        </div>
      </Wrapper>
    );

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
              <AddMember project={project} />
            </div>
          </div>
          <Separator />
        </main>
      </div>
    </Wrapper>
  );
}
