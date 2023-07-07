import { MemberDeleteManyProps } from "@/lib/validators";
import { service } from "@/service";

export async function POST(req: Request) {
	try {
		const parsedBody = MemberDeleteManyProps.safeParse(await req.json());

		if (!parsedBody.success) {
			return new Response(
				JSON.stringify({
					error: parsedBody.error,
				}),
				{ status: 400 }
			);
		}

		const [success, response] = await service.member.deleteMany(
			parsedBody.data.ids
		);

		if (!success) {
			return new Response(
				JSON.stringify({
					error: response,
				}),
				{ status: 500 }
			);
		}

		return new Response(JSON.stringify({}), { status: 200 });
	} catch (error) {
		console.error("[MEMBERS DELETE_MANY] Error:", error);
		return new Response(
			JSON.stringify({
				error: (error as any).message,
			}),
			{ status: 500 }
		);
	}
}
