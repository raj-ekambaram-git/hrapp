// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const project = req.body;
    
    // const savedAccount: Prisma.UserCreateInput = JSON.parse(req.body);
    const savedProject = await prisma.account.update({
      where: {
        id: project.id,
      },
      data: project
    });
    res.status(200).json(savedProject);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
