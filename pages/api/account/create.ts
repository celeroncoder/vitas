import { AccountCreateProps, ProjectCreateProps } from "@/lib/validators";
import { service } from "@/service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    if (req.body) {
      try {
        const parsedBody = AccountCreateProps.parse(req.body);
        const newAccount = await service.account.create(parsedBody);

        if (newAccount[0]) {
          res.status(201).json({ ...newAccount[1]!, error: undefined });
        } else
          res.status(500).json({
            error: "Uh Oh! Some error occurred while creating account.",
          });
      } catch (error) {
        console.error(error);
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
