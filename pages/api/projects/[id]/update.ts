import { ProjectUpdateProps } from "@/lib/validators";
import { service } from "@/service";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "PUT") {
    const { id } = req.query;
    const parsedId = z.string().cuid().safeParse(id);
    if (req.body && parsedId.success) {
      const projectId = parsedId.data;
      try {
        const parsedBody = ProjectUpdateProps.parse(req.body);
        const [status, response] = await service.project.update(
          projectId,
          parsedBody
        );

        if (status) {
          res.status(200).json({ ...response!, error: undefined });
        } else
          res.status(500).json({
            error: response,
          });
      } catch (error) {
        console.error("Error:", error);
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
