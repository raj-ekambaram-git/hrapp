// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const document = req.body?.document;
    // const savedAccount: Prisma.UserCreateInput = JSON.parse(req.body);
    const updatedDocument = await prisma.document.update({
      where: {
        id: document.id,
      },
      data: document,
      include: {
        createdUser: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
    res.status(200).json(updatedDocument);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
