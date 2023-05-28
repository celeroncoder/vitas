import { Project } from "@prisma/client";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Card className="border-2 shadow-sm hover:shadow-lg duration-300 w-full sm:w-72 md:w-72 lg:w-72">
      <CardHeader>
        <CardTitle className="select-none">{project.name}</CardTitle>
        <CardDescription>
          Display Name: <code>{project.displayName}</code>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Link
          href={`/dashboard/projects/${project.id}`}
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Visit <ChevronRight className="w-4 ml-2" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export const ProjectGrid: React.FC<{ projects: Project[] }> = ({
  projects,
}) => {
  return (
    <div className="flex items-center gap-4 px-4 flex-wrap">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
