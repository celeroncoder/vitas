import { service } from "@/service";
import { ProjectContext } from "../types";

export async function GET(req: Request, context: ProjectContext) {
	const members = await service.member.getAll(context.params.id);

	if (!members) {
		return new Response(
			JSON.stringify({
				error: "Couldn't fetch your members",
			}),
			{ status: 404 }
		);
	}

	return new Response(JSON.stringify(members), { status: 200 });
}
