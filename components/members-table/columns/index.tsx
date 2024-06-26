"use client";

import { Member } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../ui/checkbox";
import { DataTableColumnHeader } from "../column-header";
import { ActionsCol } from "./actions-col";
import { Badge } from "@/components/ui/badge";

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
    header: "#",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Registration Number" />
      );
    },
  },
  {
    accessorKey: "position",
    enableHiding: true,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Position" />;
    },
    cell({ row }) {
      return <Badge>{row.original.position}</Badge>;
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },

  //   action col
  {
    id: "actions",
    // cell: ({ row }) => <ActionsCol row={row} />,
    cell: ActionsCol,
  },
];
