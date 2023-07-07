import { service } from "@/service";
import { MemberContext } from "../types";

export async function POST(req: Request, ctx: MemberContext) {
	try {
		const parsedCtx = MemberContext.safeParse(ctx);

		if (!parsedCtx.success) {
			return new Response(JSON.stringify({ error: parsedCtx.error }), {
				status: 400,
			});
		}

		const id = parseInt(parsedCtx.data.params.id);

		const [success, response] = await service.member.sendEmail(id);

		if (!success) {
			return new Response(JSON.stringify({ error: response }), {
				status: 500,
			});
		}

		return new Response(JSON.stringify(response), { status: 200 });
	} catch (error) {
		console.log("[MEMBER EMAIL] Error: ", error);
		return new Response(JSON.stringify({ error: (error as any).message }), {
			status: 500,
		});
	}
}
