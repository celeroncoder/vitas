"use client";

import { Member } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

export const columns: ColumnDef<Member>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
