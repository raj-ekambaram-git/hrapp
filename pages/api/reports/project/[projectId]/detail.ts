// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../constants";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const projectId = req.query?.projectId;
    const accountId = req.query?.accountId;
    
    if(projectId != EMPTY_STRING && projectId != undefined && accountId != EMPTY_STRING && accountId != undefined && accountId != "NaN") {
      const vendors = await prisma.project.findMany({
        where: {
          id: {
            equals: parseInt(projectId.toString())            
          },
          accountId: {
            equals: parseInt(accountId.toString())
          }
        },
        include: {
          projectResource: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          invoice: {
            select: {
              total: true,
              paidAmount: true
            }
          },
          expense: {
            select: {
              total: true,
              paidAmount: true
            }
          }
        }
      })
      
        res.status(200).json(vendors[0]);
  
    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
