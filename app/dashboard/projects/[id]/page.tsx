import { Sidebar } from "@/components/sidebar";
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
      </div>
    </Wrapper>
  );
}
