// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {documentRequest} = req.body;
    console.log("document:::"+JSON.stringify(documentRequest))
    const savedDocuemnt = await prisma.document.create({
      data: documentRequest,
      include: {
        createdUser: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
    console.log("savedDocuemnt::::"+JSON.stringify(savedDocuemnt))
    res.status(200).json(savedDocuemnt);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
