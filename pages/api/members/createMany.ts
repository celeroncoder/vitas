import { MemberCreateMultipleProps } from "@/lib/validators";
import { service } from "@/service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    if (req.body) {
      try {
        const parsedBody = MemberCreateMultipleProps.parse(req.body);

        const [status, newMembers] = await service.member.createMany(
          parsedBody.projectId,
          parsedBody.rows
        );

        if (status) {
          res.status(201).json({ ...newMembers!, error: undefined });
        } else
          res.status(500).json({
            error: newMembers,
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
