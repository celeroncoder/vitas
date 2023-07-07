import { MemberUpdateProps } from "@/lib/validators";
import { MemberContext } from "./types";
import { service } from "@/service";

export async function PUT(req: Request, ctx: MemberContext) {
	try {
		const parsedCtx = MemberContext.safeParse(ctx);

		if (!parsedCtx.success) {
			return new Response(JSON.stringify({ error: parsedCtx.error }), {
				status: 400,
			});
		}

		const id = parseInt(parsedCtx.data.params.id);

		const parsedBody = MemberUpdateProps.safeParse(await req.json());

		if (!parsedBody.success) {
			return new Response(JSON.stringify({ error: parsedBody.error }), {
				status: 400,
			});
		}

		const [success, response] = await service.member.update(
			id,
			parsedBody.data
		);

		if (!success) {
			return new Response(JSON.stringify({ error: response }), {
				status: 500,
			});
		}

		return new Response(JSON.stringify(response), { status: 200 });
	} catch (error) {
		console.log("[MEMBER UPDATE] Error: ", error);
		return new Response(JSON.stringify({ error: (error as any).message }), {
			status: 500,
		});
	}
}

export async function DELETE(req: Request, ctx: MemberContext) {
	try {
		const parsedCtx = MemberContext.safeParse(ctx);

		if (!parsedCtx.success) {
			return new Response(JSON.stringify({ error: parsedCtx.error }), {
				status: 400,
			});
		}

		const id = parseInt(parsedCtx.data.params.id);

		const [success, response] = await service.member.deleteMember(id);

		if (!success) {
			return new Response(JSON.stringify({ error: response }), {
				status: 500,
			});
		}

		return new Response(JSON.stringify(response), { status: 200 });
	} catch (error) {
		console.log("[MEMBER DELETE] Error: ", error);
		return new Response(JSON.stringify({ error: (error as any).message }), {
			status: 500,
		});
	}
}
