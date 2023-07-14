"use client";

import { Member } from "@prisma/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const MembersTable: React.FC<{
	members: Member[];
	projectId: string;
}> = ({ members: initialMembersData, projectId }) => {
	const { data: members } = useQuery<Member[]>({
		queryKey: ["members", projectId],
		async queryFn() {
			const res = await api.get(`/projects/${projectId}/members`);
			return res.data;
		},
		initialData: initialMembersData,
	});

	if (!members) return null;

	return (
		<div className="pb-10 py-4">
			<DataTable data={members} columns={columns} />
		</div>
	);
};
