import type { NextApiRequest, NextApiResponse } from "next";
import { CardEmailTemplate } from "@/components/card-email-template";
import { CardEmailSendProps } from "@/lib/validators";
import { resend } from "@/lib/resend";
import { z } from "zod";
import { service } from "@/service";
import { getAuth } from "@clerk/nextjs/server";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const parsedId = z.string().safeParse(req.query.id);

    if (!parsedId.success)
      return res.status(400).json({ error: parsedId.error });

    const id = parseInt(parsedId.data);

    console.log("id", id);

    const member = await service.member.getOne(id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    const project = await service.project.getOne(member.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    console.log("project", project);

    // getting project owner name
    // const auth = getAuth(req);
    // if (!auth || !auth.user)
    //   return res.status(401).json({ error: "Unauthorized" });
    // const projectCreatorName =
    //   auth.user.firstName || auth.user.username || "Anonymous";

    // console.log("projectCreatorName", projectCreatorName);

    const props: CardEmailSendProps = {
      memberID: member.id.toString(),
      name: member.name,
      position: member.position,
      username: member.username,
      // projectCreatorName,
      projectCreatorName: "Anonymous",
      projectDisplayName: project.displayName,
      projectDisplayURL: project.displayUrl || "",
    };

    const data = await resend.sendEmail({
      from: "celeron@getid.celeroncoder.tech",
      to: "delivered@resend.dev",
      subject: `Welcome to ${project.displayName}`,
      react: CardEmailTemplate({ ...props }),
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};
