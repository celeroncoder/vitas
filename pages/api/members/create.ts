import { MemeberCreateProps } from "@/lib/validators";
import { service } from "@/service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    if (req.body) {
      try {
        const parsedBody = MemeberCreateProps.parse(req.body);
        const newMember = await service.member.create(parsedBody);

        if (newMember[0]) {
          res.status(201).json({ ...newMember[1]!, error: undefined });
        } else
          res.status(500).json({
            error: newMember[1],
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
