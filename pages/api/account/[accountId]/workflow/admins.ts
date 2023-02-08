// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Role, UserStatus, VendorStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const accountId = req.query.accountId;
  console.log("Account ::"+accountId)
  try {
      const workFlowAdmins = await prisma.user.findMany({
        where: {
            accountId: {
              equals: parseInt(accountId.toString())
            },
            userRole: {            
              hasSome: [Role.ACCOUNT_ADMIN, Role.ACCOUNT_VENDOR_REP]
            },
            status: {
              equals: UserStatus.Active
            }
        },
        select: {
          firstName: true,
          lastName: true
        }

      });
      res.status(200).json(workFlowAdmins);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting workFlowTasks' })
  }
}
