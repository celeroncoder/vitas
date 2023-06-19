import type { NextApiRequest, NextApiResponse } from "next";
import { CardEmailSendProps } from "@/lib/validators";
import { z } from "zod";
import { service } from "@/service";
import { getAuth } from "@clerk/nextjs/server";
import { knock } from "@/lib/knock";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).end("Method not allowed.");

  try {
    const parsedId = z.string().safeParse(req.query.id);

    if (!parsedId.success)
      return res.status(400).json({ error: parsedId.error });

    const id = parseInt(parsedId.data);

    const member = await service.member.getOne(id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    const project = await service.project.getOne(member.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const auth = getAuth(req);

    const projectOwnerName =
      auth?.user?.firstName || auth?.user?.username || "Anonymous";

    const props: CardEmailSendProps = {
      cardUrl: `${
        new URL(req.headers["origin"] || "http://localhost:3000").origin
      }/card/${member.id}`,
      member: {
        name: member.name,
      },
      projectDisplayName: project.displayName,
      projectOwnerName: projectOwnerName,
    };

    const { workflow_run_id } = await knock.workflows.trigger(
      "get-id-card-delivery",
      {
        data: props,
        recipients: [
          {
            id: member.id.toString(),
            email: member.email,
            name: member.name,
            collection: "members",
          },
        ],
      }
    );

    res.status(200).json({ workflow_run_id });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};
