import { z } from "zod";

export const ProjectCreateProps = z.object({
  userId: z.string().min(3),
  name: z.string().min(3),
  displayName: z.string().min(3),
  displayUrl: z.string().optional(),
});
