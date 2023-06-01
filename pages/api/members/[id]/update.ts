import { MemberUpdateProps } from "@/lib/validators";
import { service } from "@/service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "PUT") {
    const { id } = req.query;
    const parsedId = parseInt(id! as string);
    if (req.body && parsedId) {
      try {
        const parsedBody = MemberUpdateProps.parse(req.body);
        const [status, response] = await service.member.update(
          parsedId,
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
