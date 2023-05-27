import { Client } from "node-appwrite";
import { env } from "@/env.mjs";

export const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint
  .setProject(env.APPWRITE_PROJECT_ID) // Your project ID
  .setKey(env.APPWRITE_PROJECT_ID); // Your secret API key
