// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const reply = req.body;
    
    
    const savedReply = await prisma.notes.update({
        where: {
          id: reply.id,
        },
        data: reply,
        include: {
          createdUser: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          replies: {
            orderBy: {
              id: "desc"
            },
            select: {
              repliesRelation:{
                select: {
                  id: true
                }
              },
              id: true,
              type: true,
              typeId: true,
              notes: true,
              lastUpdateDate: true,
              createdUser: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });
    console.log("savedReply::::"+JSON.stringify(savedReply))
    res.status(200).json(savedReply);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving reply' })
  }
}
