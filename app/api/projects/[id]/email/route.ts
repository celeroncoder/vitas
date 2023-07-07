import { service } from "@/service";
import { ProjectContext } from "../types";

export async function POST(req: Request, ctx: ProjectContext) {
	try {
		const parsedCtx = ProjectContext.safeParse(ctx);

		if (!parsedCtx.success)
			return new Response(JSON.stringify({ error: "Invalid Project ID" }), {
				status: 400,
			});

		const { id } = parsedCtx.data.params;

		const [status, response] = await service.project.sendEmail(id);

		if (!status)
			return new Response(JSON.stringify({ error: response }), {
				status: 500,
			});

		return new Response(JSON.stringify(response), { status: 200 });
	} catch (error) {
		console.error("[PROJECT EMAIL] Error:", error);
		return new Response(
			JSON.stringify({
				error: "Something Went Wrong! Please try again later...",
			}),
			{ status: 500 }
		);
	}
}
