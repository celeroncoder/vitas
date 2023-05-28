import { prisma } from "@/lib/db";
import { ProjectCreateRequest } from "@/lib/validators";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  if (req.method == "POST") {
    if (req.body) {
      try {
        const parsedBody = ProjectCreateRequest.parse(req.body);
        const project = await prisma.project.create({
          data: { ...parsedBody },
        });

        if (project) {
          res.status(201).json({ ...project, error: undefined });
        } else
          res.status(500).json({
            error: "Uh Oh! Some error occurred while creating project.",
          });
      } catch (error) {
        console.error(error);
        res.status(400).json({
          error: "Invalid Request, couldn't parse request body.",
        });
      }
    } else
      res.status(400).json({
        error: "Request Body Not Found",
      });
  } else res.status(405);
}
