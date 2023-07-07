import { MemberCreateMultipleProps } from "@/lib/validators";
import { service } from "@/service";

export async function POST(req: Request) {
	try {
		const parsedBody = MemberCreateMultipleProps.safeParse(await req.json());

		if (!parsedBody.success) {
			return new Response(
				JSON.stringify({
					error: parsedBody.error,
				}),
				{ status: 400 }
			);
		}

		const [success, response] = await service.member.createMany(
			parsedBody.data.projectId,
			parsedBody.data.rows
		);

		if (!success) {
			return new Response(
				JSON.stringify({
					error: (response as any).message,
				}),
				{ status: 500 }
			);
		}

		return new Response(JSON.stringify(response), { status: 201 });
	} catch (error) {
		console.error("Error:", error);
		return new Response(
			JSON.stringify({
				error: "Something went wrong.",
			}),
			{ status: 500 }
		);
	}
}
