import { prisma } from "@/lib/db";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const projects = await prisma.project.findMany();

  if (projects) res.status(200).json(projects);
  else res.status(404).json({});
};

export default handler;
