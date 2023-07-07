import { z } from "zod";

export const MemberContext = z.object({
	params: z.object({
		id: z.string(),
	}),
});

export type MemberContext = z.infer<typeof MemberContext>;
