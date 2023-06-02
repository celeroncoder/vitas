import { MemberDeleteManyProps } from "@/lib/validators";
import { service } from "@/service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    if (req.body) {
      try {
        const parsedBody = MemberDeleteManyProps.parse(req.body);
        const [success, error] = await service.member.deleteMany(
          parsedBody.ids
        );
        if (success) {
          res.status(204).send({}); // DELETE HTTP STATUS CODE
        } else res.status(500).json({ error });
      } catch (error) {
        console.error("Error:", error);
        res.status(400).json({
          error: "Invalid Request, couldn't parse request body.",
        });
      }
    } else
      res.status(400).json({
        error: "Invalid Member ID",
      });
  } else res.status(405);
}
