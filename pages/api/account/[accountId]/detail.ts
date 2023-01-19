// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";
import { isAuthorized } from '../../../../helpers/api/api-auth-middleware';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // if(isAuthorized(req)) {
    try {
      const accountId = req.query?.accountId;
      const account = await prisma.account.findUnique({
        where: {
          id: parseInt(accountId.toString()),
        },
        include: {
          address: true,
        }
      })
      console.log("account:::"+JSON.stringify(account))
        res.status(200).json(account);
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'Something went wrong while updating' })
    }

  // }else {
  //   res.status(400).json({ status: 400, message: 'Invalid Authentication Credentials' });
  // }


}
