"use client";

import { Title } from "@/components/ui/title";
import { api } from "@/lib/axios";
import { Project } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function ProjectDetails({
  project: initialProjectData,
}: {
  project: Project;
}) {
  const { data: project } = useQuery<Project>({
    queryKey: ["project", initialProjectData.id],
    async queryFn() {
      const res = await api.get(`/projects/${initialProjectData.id}`);
      return res.data;
    },
    initialData: initialProjectData,
  });

  return (
    <div>
      <p className="text-sm text-muted-foreground">Event: "{project.name}"</p>
      <Title className="text-2xl">Your Participants</Title>
    </div>
  );
}
