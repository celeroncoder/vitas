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
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button, buttonVariants } from "./ui/button";
import { ShadowNoneIcon, UploadIcon } from "@radix-ui/react-icons";
import { Project } from "@prisma/client";
import { Input } from "./ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "./ui/separator";
import {
	MemberCreateMultipleProps,
	MemberCreateRows,
	MemberFields,
} from "@/lib/validators";

import { api } from "@/lib/axios";
import { cn, csvToArray } from "@/lib/utils";

import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

const formSchema = z.object({
	file: z.instanceof(File),
	mapping: z.object({
		name: z.string(),
		username: z.string(),
		position: z.string(),
		email: z.string().nullable(),
	}),
});

const reader = new FileReader();

export const AddMembersCSVForm: React.FC<{ project: Project }> = ({
	project: initialProjectData,
}) => {
	const { data: project } = useQuery<Project>({
		queryKey: ["project", initialProjectData.id],
		async queryFn() {
			const res = await api.get(`/projects/${initialProjectData.id}`);
			return res.data;
		},
		initialData: initialProjectData,
	});

	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			mapping: {
				name: "",
				username: "",
				position: "",
				email: null,
			},
		},
	});

	const [rows, setRows] = useState<{ [key: string]: string }[]>();
	const [cols, setCols] = useState<string[]>();

	const { toast } = useToast();
	const router = useRouter();

	const reset = () => {
		form.reset();
		setCols(undefined);
		setRows(undefined);
	};

	const { mutateAsync } = useMutation<
		{ count: number },
		any,
		MemberCreateMultipleProps
	>({
		async mutationFn(payload) {
			const res = await api.post("/members/createMany", payload);
			return res.data;
		},
		onSuccess() {
			queryClient.invalidateQueries(["members", project.id]);
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (rows && cols) {
			try {
				let mappedRows: MemberCreateRows = [];

				mappedRows = rows.map((row) => {
					let mappedRow: MemberCreateRows[number] = {
						name: "",
						username: "",
						position: "",
						email: null,
					};

					for (const field of MemberFields) {
						const fieldValue = row[values.mapping[field] as keyof typeof row];
						if (fieldValue !== null && fieldValue !== undefined) {
							mappedRow[field] = fieldValue;
						}
					}

					return mappedRow;
				});

				const payload: MemberCreateMultipleProps = {
					rows: mappedRows,
					projectId: project.id,
				};

				const res = await mutateAsync(payload);

				if (res) {
					toast({
						title: `${res.count} Members Added!`,
						description: `Members were added from the csv with the specified column mapping successfully!`,
					});
				} else
					toast({
						title: "Some Error Occurred!",
						description:
							"Uh Oh! Some problem Occurred while adding the members",
					});
			} catch (err) {
				toast({
					title: "Some Error Occurred!",
					description: "Uh Oh! Some problem Occurred while adding the members",
					variant: "destructive",
				});
			} finally {
				reset();
				setOpen(false);
			}
		} else
			toast({
				title: "Mapping Incomplete",
				description:
					"Please map each memeber field with a column to add multiple members.",
				variant: "destructive",
			});
	};

	const readFile = () => {
		const file = form.watch("file");

		if (file) {
			reader.onload = (e) => {
				let res = e.target?.result;
				if (typeof res === "string") {
					const [rows, cols] = csvToArray(res);
					setRows(rows);
					setCols(cols);
				}
			};

			reader.readAsText(file);
		}
	};

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
				<UploadIcon className="w-4 mr-2" /> Add Members
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Members</DialogTitle>
					<DialogDescription>
						Upload a CSV file and map columns to the member fields, and mass
						create members in the project.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<section className="mb-2">
							<FormField
								control={form.control}
								name="file"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Upload File</FormLabel>
										<FormControl>
											<Input
												placeholder="Upload CSV File"
												{...field}
												type="file"
												accept=".csv"
												value={undefined}
												onChange={(e) => {
													e.target.files &&
														form.setValue("file", e.target.files[0]);
													readFile();
												}}
											/>
										</FormControl>
										<FormDescription>
											Upload the file from which you want to add multiple
											members.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</section>

						<section className="mb-2 animate-in duratio-300">
							<div>
								<Separator className="mb-2" />
								<p className="text-sm text-muted-foreground">
									Map the Column from the uploaded csv to member fields.
								</p>
							</div>

							{MemberFields.map((fieldName) => (
								<FormField
									key={fieldName}
									control={form.control}
									name={`mapping.${fieldName}`}
									render={({ field }) => (
										<FormItem className="flex items-center gap-2">
											<FormLabel className="mt-2 min-w-[100px] capitalize h-full">
												{fieldName}
											</FormLabel>
											<FormControl className="flex-1 my-0">
												<Select
													{...field}
													value={field.value || undefined}
													onValueChange={(val) =>
														form.setValue(`mapping.${fieldName}`, val)
													}
												>
													<SelectTrigger className="w-[180px] flex-[0.8]">
														<SelectValue placeholder="Choose" />
													</SelectTrigger>
													<SelectContent>
														{(!cols || cols.length <= 0) && (
															<SelectItem value={""} disabled>
																No Columns Found
															</SelectItem>
														)}
														{cols &&
															cols.length > 0 &&
															cols.map((col) => (
																<SelectItem value={col} key={col}>
																	{col} (column)
																</SelectItem>
															))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}
						</section>

						<DialogFooter>
							<Button
								size="sm"
								variant={"secondary"}
								type="reset"
								onClick={() => {
									setOpen(false);
									form.reset();
								}}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								size="sm"
								disabled={
									form.formState.isSubmitting || form.formState.dirtyFields.file
								}
							>
								{form.formState.isSubmitting && (
									<ShadowNoneIcon className="mr-2 w-3 animate-spin" />
								)}
								{form.formState.isSubmitting ? "Please Wait" : "Add"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
