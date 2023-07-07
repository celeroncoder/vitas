import { MemberCreateProps } from "@/lib/validators";
import { service } from "@/service";

export async function POST(req: Request) {
	try {
		const parsedBody = MemberCreateProps.safeParse(await req.json());

		if (!parsedBody.success) {
			return new Response(
				JSON.stringify({
					error: parsedBody.error,
				}),
				{ status: 400 }
			);
		}

		const [success, member] = await service.member.create(parsedBody.data);

		if (!success) {
			return new Response(
				JSON.stringify({
					error: member,
				}),
				{ status: 500 }
			);
		}

		return new Response(JSON.stringify(member), { status: 201 });
	} catch (error) {
		console.error("Error:", error);
		return new Response(
			JSON.stringify({
				error: "Invalid Request, couldn't parse request body.",
			}),
			{ status: 500 }
		);
	}
}
