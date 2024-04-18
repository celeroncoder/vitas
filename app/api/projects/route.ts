import { ProjectCreateProps } from "@/lib/validators";
import { service } from "@/service";
import { currentUser } from "@clerk/nextjs/server";

// get all user's projects
export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
      }),
      { status: 401 }
    );
  }

  const projects = await service.project.getAllByUserId(user.id);

  if (!projects) {
    return new Response(
      JSON.stringify({
        error: "Couldn't fetch your projects",
      }),
      { status: 404 }
    );
  }

  return new Response(JSON.stringify(projects), { status: 200 });
}

// create project
export async function POST(req: Request) {
  try {
    const parsedBody = ProjectCreateProps.safeParse(await req.json());

    if (!parsedBody.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid Request, couldn't parse request body.",
        }),
        { status: 400 }
      );
    }

    const [success, project] = await service.project.create(parsedBody.data);

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Uh Oh! Some error occurred while creating project.",
        }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(project), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      { status: 500 }
    );
  }
}
