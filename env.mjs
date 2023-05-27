import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    APPWRITE_PROJECT_ID: z.string(),
    APPWRITE_API_KEY_SECRET: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY_SECRET: process.env.APPWRITE_API_KEY_SECRET,
  },
});
