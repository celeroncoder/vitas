"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Eye, Loader2, Trash } from "lucide-react";
import { z } from "zod";
import { MemberDeleteManyProps } from "@/lib/validators";
import { Member } from "@prisma/client";
import { api } from "@/lib/axios";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  //  TODO: do some mass action thing with this selection
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  //   Mass Effects
  // filling up the selection data
  const [selectedRows, setSelectedRows] = useState<TData[]>([]);

  useEffect(() => {
    if (Object.keys(rowSelection).length > 0) {
      const idxs = Object.keys(rowSelection).map((idx) => parseInt(idx));
      setSelectedRows(data.filter((_, idx) => idxs.includes(idx)));
    } else setSelectedRows([]);
  }, [rowSelection]);

  const [deleteSelectionDisabled, setDeleteSelectionDisabled] = useState(true);

  useEffect(() => {
    if (selectedRows.length > 0) setDeleteSelectionDisabled(false);
    else setDeleteSelectionDisabled(true);
  }, [selectedRows]);

  const { toast } = useToast();
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const DeleteConfirmationModal = () => {
    const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
    const deleteSelectedRows = async () => {
      setDeleteBtnLoading(true);
      const payload: z.infer<typeof MemberDeleteManyProps> = {
        ids: selectedRows.map((row) => (row as Member).id),
      };

      const res = await api.post("/members/deleteMany", payload);

      if (res.status === 204) {
        toast({
          title: "Selected Members Deleted",
          description: "The selected Members were deleted successfully!",
        });
      } else
        toast({
          variant: "destructive",
          title: "Some Error Occurred!",
          description: "Uh Oh! Some problem Occurred while adding the member",
        });

      setDeleteBtnLoading(false);
      setDeleteModalOpen(false);
      setRowSelection({});
      router.refresh();
    };

    return (
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              members from the project, and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button disabled={deleteBtnLoading} onClick={deleteSelectedRows}>
              {deleteBtnLoading && (
                <Loader2 className="mr-2 w-4 animate-spin" />
              )}
              {deleteBtnLoading ? "Please Wait" : "Continue"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <div>
      {/* Table Actions - (Filters, Search & Mass Actions) */}
      <div className="flex items-center justify-between py-4 gap-2">
        {/* filtering through name */}
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex items-center gap-2">
          {/* Delete Selection */}
          <Button
            variant={"destructive"}
            disabled={deleteSelectionDisabled}
            className={"ml-auto"}
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash className="w-3 mr-2" />
            Delete
          </Button>
          <DeleteConfirmationModal />
          {/* Visibility DropDown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Eye className="w-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* The Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
