import { ProjectCreateProps } from "@/lib/validators";
import { service } from "@/service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    if (req.body) {
      try {
        const parsedBody = ProjectCreateProps.parse(req.body);
        const newProject = await service.project.create(parsedBody);

        if (newProject[0]) {
          res.status(201).json({ ...newProject[1]!, error: undefined });
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
