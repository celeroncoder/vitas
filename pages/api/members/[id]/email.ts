import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { service } from "@/service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).end("Method not allowed.");

  try {
    const parsedId = z.string().safeParse(req.query.id);

    if (!parsedId.success)
      return res.status(400).json({ error: parsedId.error });

    const id = parseInt(parsedId.data);

    const [success, response] = await service.member.sendEmail(id, req);

    if (!success) return res.status(500).json(response);

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};
