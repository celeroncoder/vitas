import { service } from "@/service";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

// get all projects
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  if (userId) {
    const projects = await service.project.getAll(userId);

    if (projects) res.json(projects);
    else
      res.json({
        status: 404,
        statusText: "Couldn't fetch your projects",
      });
  } else {
    res.json({ status: 401 });
  }
}
