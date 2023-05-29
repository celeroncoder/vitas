"use client";

import { Member } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "id",
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium w-fit inline">
          {row.getValue("id")}
        </div>
      );
    },
    header: ({ column }) => {
      return (
        <div
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          className="cursor-pointer inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 w-3" />
        </div>
      );
    },
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
