"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, csvToArray } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { Loader2, Upload } from "lucide-react";
import { Project } from "@prisma/client";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";
import {
  MemberCreateMultipleProps,
  MemberCreateRows,
  MemberFields,
} from "@/lib/validators";
import { z } from "zod";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

export const AddMembersCSV: React.FC<{ project: Project }> = ({ project }) => {
  const [open, setOpen] = useState(false);

  const reader = new FileReader();
  const [file, setFile] = useState<File>();
  const [csv, setCSV] = useState<string>();
  const [rows, setRows] = useState<{ [key: string]: string }[]>();
  const [cols, setCols] = useState<string[]>();
  const [disabled, setDisabled] = useState(true);

  const [mapping, setMapping] = useState<{ [key in MemberFields]?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const add = async () => {
    setLoading(true);
    let isEmpty = false;
    MemberFields.forEach((field) => {
      if (!mapping[field]) isEmpty = true;
    });

    if (!isEmpty && rows && cols) {
      // map
      let mappedRows: MemberCreateRows[] = [];

      mappedRows = rows.map((row) => {
        let mappedRow: any = {};
        for (const field of MemberFields) {
          mappedRow[field] = row[mapping[field]!];
        }
        return mappedRow;
      });

      const payload: z.infer<typeof MemberCreateMultipleProps> = {
        rows: mappedRows,
        projectId: project.id,
      };

      const res = await api.post("/members/createMany", payload);

      if (res.status == 201) {
        toast({
          title: `${res.data.count} Members Added!`,
          description: `Members were added from the csv with the specified column mapping successfully!`,
        });
      } else
        toast({
          title: "Some Error Occurred!",
          description: "Uh Oh! Some problem Occurred while adding the members",
        });
    } else
      toast({
        title: "Mapping Incomplete",
        description:
          "Please map each memeber field with a column to add multiple members.",
        variant: "destructive",
      });

    setLoading(false);
    setOpen(false);
    // TODO: replace this to invalidate or refetch the data-table data.
    router.refresh();
  };

  useEffect(() => {
    if (rows && cols) setDisabled(false);
  }, [rows, cols]);

  useEffect(() => {
    if (csv) {
      const [rows, cols] = csvToArray(csv);
      setRows(rows);
      setCols(cols);
    }
  }, [csv]);

  useEffect(() => {
    if (file) {
      reader.onload = (e) => {
        let res = e.target?.result;
        if (typeof res === "string") setCSV(res);
      };
      reader.readAsText(file);
    }
  }, [file]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          "group shadow-sm hover:shadow-lg duration-300",
          buttonVariants({
            variant: "default",
          })
        )}
      >
        <Upload className="w-4 mr-2" /> Add Members
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
          <DialogDescription>
            Upload a CSV file and map columns to the member fields, and mass
            create members in the project.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* file input */}
          <div className="flex flex-col gap-2">
            <Label>Upload CSV</Label>
            {/* // TODO: add input to enter the url of a google sheet (to support cloud based sheets) */}
            <Input
              onChange={(e) => setFile(e.target.files![0])}
              type="file"
              accept=".csv"
              multiple={false}
            />
            <p className="text-sm text-muted-foreground">
              Upload the file from which you want to add multiple members.
            </p>
          </div>

          {/* Mappers */}
          {!disabled && (
            <>
              <div>
                <Separator className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  Map the Column from the uploaded csv to member fields.
                </p>
              </div>

              {MemberFields.map((field) => (
                <div key={field} className="flex gap-4 items-center w-full">
                  <Label className="capitalize flex-[0.2]">{field}</Label>
                  <Select
                    onValueChange={(val) =>
                      setMapping((mapping) => {
                        mapping[field] = val;
                        return mapping;
                      })
                    }
                  >
                    <SelectTrigger className="w-[180px] flex-[0.8]">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      {cols?.map((col) => (
                        <SelectItem value={col} key={col}>
                          {col} (column)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            size="sm"
            variant={"secondary"}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={add} size="sm" disabled={loading || disabled}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Please Wait" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
