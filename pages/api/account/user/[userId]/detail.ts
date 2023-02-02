// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId  = req.query?.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId.toString()),
      },
      include: {
        address: true,
        account: {
          select: {
            name: true,
            type: true
          }
        },
        projectResource: {
          select: {
            id: true,
            project: {
              select: {
                name: true,
                id: true,
                referenceCode: true
              }
            },
          }
        },
        vendorUsers:{
          select: {
            vendor: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
    console.log("USER DETAILS IN THE API::"+JSON.stringify(user));
      res.status(200).json(user);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
