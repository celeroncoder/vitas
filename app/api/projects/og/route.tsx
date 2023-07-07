import { ImageResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

import favicon from "@/public/favicon.png";

export const runtime = "edge";

export async function GET(req: Request) {
	try {
		const projectName = new URL(req.url || "").searchParams.get("name");

		if (!projectName)
			return new Response(JSON.stringify({ error: "No name provided" }), {
				status: 400,
			});

		return new ImageResponse(
			(
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "16px",
						height: "100%",
						width: "100%",
						flexDirection: "column",
					}}
					tw="bg-slate-900 text-slate-200"
				>
					<div tw="flex items-center justify-center" style={{ flex: 0.9 }}>
						<p style={{ fontSize: "64px" }}>{projectName}</p>
					</div>
					<div
						style={{
							flex: 0.1,
							minHeight: "72px",
							fontSize: "32px",
						}}
						tw="border-t-2 border-lime-200 w-full flex items-center justify-center"
					>
						<div tw="flex items-center justify-center text-lg leading-tight font-bold bg-lime-200 text-slate-900 px-4 py-1 rounded-lg">
							<img
								src={`${
									process.env.NODE_ENV === "development"
										? "http://localhost:3000"
										: "https://get.id"
								}${favicon.src}`}
								width={50}
								height={50}
								alt="logo"
							/>
							<p tw="pl-2 m-0 uppercase">get.id</p>
						</div>
					</div>
				</div>
			),
			{
				width: 1200,
				height: 630,
			}
		);
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: (error as any).message }), {
			status: 500,
		});
	}
}
