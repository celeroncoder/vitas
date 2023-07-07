import { ProjectUpdateProps } from "@/lib/validators";
import { service } from "@/service";
import { z } from "zod";

const ProjectContext = z.object({
	params: z.object({
		id: z.string().cuid(),
	}),
});
type ProjectContext = z.infer<typeof ProjectContext>;

export async function GET(req: Request, context: ProjectContext) {
	try {
		const parsedCtx = ProjectContext.safeParse(context);

		if (!parsedCtx.success)
			return new Response(JSON.stringify({ error: "Invalid Project ID" }), {
				status: 400,
			});

		const { id } = parsedCtx.data.params;

		const project = await service.project.getOne(id);

		if (!project)
			return new Response(JSON.stringify({ error: "Project not found!" }), {
				status: 404,
			});

		return new Response(JSON.stringify(project), { status: 200 });
	} catch (error) {
		console.error("Error:", error);
		return new Response(
			JSON.stringify({
				error: "Something Went Wrong! Please try again later...",
			}),
			{ status: 500 }
		);
	}
}

export async function PUT(req: Request, ctx: ProjectContext) {
	try {
		const parsedCtx = ProjectContext.safeParse(ctx);

		if (!parsedCtx.success)
			return new Response(JSON.stringify({ error: "Invalid Project ID" }), {
				status: 400,
			});

		const { id } = parsedCtx.data.params;

		const parsedBody = ProjectUpdateProps.safeParse(await req.json());

		if (!parsedBody.success)
			return new Response(JSON.stringify({ error: "Invalid Request Body" }), {
				status: 400,
			});

		const [status, response] = await service.project.update(
			id,
			parsedBody.data
		);

		if (!status)
			return new Response(JSON.stringify({ error: response }), {
				status: 500,
			});

		return new Response(JSON.stringify(response), { status: 200 });
	} catch (error) {
		console.error("[PROJECT UPDATE] Error:", error);
		return new Response(
			JSON.stringify({
				error: "Something Went Wrong! Please try again later...",
			}),
			{ status: 500 }
		);
	}
}
