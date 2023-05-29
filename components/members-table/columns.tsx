"use client";

import { Member } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Member>[] = [
  { accessorKey: "id", header: "#" },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return `@${row.getValue("username")}`;
    },
  },
  {
    accessorKey: "position",
    header: "Position/Title",
  },
];
