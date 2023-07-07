import { z } from "zod";

export const ProjectContext = z.object({
	params: z.object({
		id: z.string().cuid(),
	}),
});
export type ProjectContext = z.infer<typeof ProjectContext>;
