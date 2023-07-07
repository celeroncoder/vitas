import { AccountCreateProps } from "@/lib/validators";
import { service } from "@/service";

export async function POST(req: Request) {
	try {
		const parsedBody = AccountCreateProps.safeParse(await req.json());

		console.log(req.body);

		if (!parsedBody.success)
			return new Response(
				JSON.stringify({
					error: "Invalid Request, couldn't parse request body.",
				}),
				{ status: 400 }
			);

		const [success, account] = await service.account.create(parsedBody.data);

		if (!success)
			return new Response(
				JSON.stringify({
					error:
						(account as any).message ||
						"Uh Oh! Some error occurred while creating account.",
				}),
				{
					status: 500,
					statusText: "Uh Oh! Some error occurred while creating account.",
				}
			);

		return new Response(JSON.stringify({ data: account, error: undefined }), {
			status: 201,
			statusText: "Account Created!",
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: (error as any).message,
			}),
			{
				status: 500,
				statusText: "Uh Oh! Some error occurred while creating account.",
			}
		);
	}
}
