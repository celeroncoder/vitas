import { Member } from "@prisma/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export const MembersTable: React.FC<{ members: Member[] }> = ({ members }) => {
  return (
    <div className="pb-10 py-4">
      <DataTable data={members} columns={columns} />
    </div>
  );
};
