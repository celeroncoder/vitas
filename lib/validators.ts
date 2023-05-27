import { z } from "zod";

export const ProjectCreateRequestBodyValidator = z.object({
  userId: z.string(),
  name: z.string().min(3),
  displayName: z.string().min(3),
  displayUrl: z.string().optional(),
});
