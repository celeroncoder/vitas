import { prisma } from "@/lib/db";
import { ProjectCreateRequestBodyValidator } from "@/lib/validators";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// get all projects
export async function GET(req: NextRequest) {
  const { userId } = auth();
  if (userId) {
    const projects = await prisma.project.findMany({
      where: { userId: userId },
    });

    if (projects) return NextResponse.json(projects);
    else
      NextResponse.next({
        status: 404,
        statusText: "Couldn't fetch your projects",
      });
  } else {
    return NextResponse.next({ status: 401 });
  }
}

// create a project
export async function POST(req: NextRequest) {
  if (req.bodyUsed) {
    const body = ProjectCreateRequestBodyValidator.safeParse(req.body);
    if (body.success) {
      const project = await prisma.project.create({ data: { ...body.data } });

      if (project) {
        NextResponse.next({ status: 201 });
        return NextResponse.json(project);
      } else
        return NextResponse.next({
          status: 500,
          statusText: "Uh Oh! Some error occurred while creating project.",
        });
    } else return NextResponse.next({ status: 400 });
  } else return NextResponse.next({ status: 400 });
}
