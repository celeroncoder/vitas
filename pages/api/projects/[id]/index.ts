import { service } from "@/service";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    const { id } = req.query;
    const parsedId = z.string().cuid().safeParse(id);
    if (parsedId.success) {
      const projectId = parsedId.data;
      try {
        const project = await service.project.getOne(projectId);
        if (project) res.status(200).json(project);
        else res.status(404).json({ error: "Project not found!" });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
          error: "Something Went Wrong! Please try again later...",
        });
      }
    } else
      res.status(400).json({
        error: "Invalid Project ID",
      });
  } else res.status(405);
}
