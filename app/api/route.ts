import { service } from "@/service";

export async function GET() {
  const projects = await service.project.getAll();

  if (!projects) {
    return new Response(
      JSON.stringify({
        error: "Couldn't fetch all projects",
      }),
      { status: 404 }
    );
  }

  return new Response(JSON.stringify(projects), { status: 200 });
}
