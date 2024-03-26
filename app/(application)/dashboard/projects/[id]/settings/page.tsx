import { ProjectDeleteConfirmationForm } from "@/components/project-delete";
import ProjectNotFoundPage from "@/components/project-not-found";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Title } from "@/components/ui/title";
import { UpdateProjectForm } from "@/components/update-project";
import { service } from "@/service";
import { Metadata } from "next";
import { z } from "zod";

type ProjectSettingsPageProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: ProjectSettingsPageProps): Promise<Metadata> {
  const parsedId = z.string().cuid().safeParse(params.id);

  if (!parsedId.success)
    return {
      title: "Event Not Found | VITAS",
      description: "The Requested event couldn't be found.",
    };

  const project = await service.project.getOne(parsedId.data);

  if (!project)
    return {
      title: "Event Not Found | VITAS",
      description: "The Requested event couldn't be found.",
    };

  return {
    title: `Settings | Event "${project.name}" | VITAS`,
    description: `Settings for Event: "${project.displayName}" | URL: ${project.displayUrl}`,
  };
}

export default async function ProjectSettingsPage({
  params,
}: ProjectSettingsPageProps) {
  const project = await service.project.getOne(params.id);

  if (!project) return <ProjectNotFoundPage />;

  return (
    <>
      <div className="mb-4">
        <Title className="text-3xl">Settings</Title>
        <p className="text-muted-foreground">
          Manage Event & Participant Settings
        </p>
      </div>
      <Card className="shadow mb-2">
        <CardHeader>
          <CardTitle>Update Event</CardTitle>
          <CardDescription>
            Update the event details, these details will show up on the ID Card
            also.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateProjectForm project={project} />
        </CardContent>
      </Card>
      <Card className="shadow">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            This will permenentely delete the event and all the participants in
            it. The ID Card from this event will no longer be valid.{" "}
            <span className="font-semibold">This action is irreversible.</span>
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <ProjectDeleteConfirmationForm project={project} />
        </CardFooter>
      </Card>
    </>
  );
}
