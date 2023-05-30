import { service } from "@/service";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "DELETE") {
    const { id } = req.query;
    const parsedId = parseInt(id! as string);
    if (parsedId) {
      const memberId = parsedId;
      try {
        const [success, error] = await service.member.deleteMember(memberId);
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
