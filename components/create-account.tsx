"use client";

import { AccountCreateProps } from "@/lib/validators";
import { Card } from "@/components/ui/card";
import { CheckCircledIcon, ShadowNoneIcon } from "@radix-ui/react-icons";

import { User } from "@clerk/nextjs/server";

import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const CreateAccount: React.FC<{ user: User }> = ({ user }) => {
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	const action = async () => {
		try {
			const payload: AccountCreateProps = { id: user.id };
			const res = await api.post("/account/create", payload);

			if (res.status === 201) {
				setLoading(false);
				router.push("/dashboard");
			} else router.push("/sign-in");
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		router.prefetch("/dashboard");
		(async () => await action())();
	});

	return (
		<Card className="p-5 items-center justify-center flex">
			<div className="flex gap-2 items-center justify-center text-xl font-semibold">
				{loading ? (
					<>
						<ShadowNoneIcon className="w-8 animate-spin" />
						Creating Account...
					</>
				) : (
					<>
						<CheckCircledIcon className="text-emerald-500" />
						Account Created 🎊
					</>
				)}
			</div>
		</Card>
	);
};
