// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const notes = req.body;
    
    const savedNotes = await prisma.notes.create({
      data: notes,
      include: {
        createdUser: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
    console.log("savedNotes::::"+JSON.stringify(savedNotes))
    res.status(200).json(savedNotes);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
