// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const projectId = req.query.projectId;
  const accountId = req.query.accountId;

console.log("projectId ID::"+projectId+"---AccountioD::"+accountId)
  
  try {
    if(projectId != "" && accountId != "" && accountId != "NaN" && accountId != undefined && projectId != undefined) {
      const invoices = await prisma.invoice.findMany({
        where: {
            projectId: {
              equals: parseInt(projectId.toString())            
            },
            accountId: {
              equals: parseInt(accountId.toString())
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true,
          project: {
            select: {
              name: true
            }
          }
        }
      });
      res.status(200).json(invoices);
    } else if (accountId != "" && accountId != undefined && projectId == ""){
      console.log("2222")
      const invoices = await prisma.invoice.findMany({
        where: {
            accountId: {
              equals: parseInt(accountId.toString())
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true
        }

      });
      res.status(200).json(invoices);

    }else if (projectId != "" && projectId != undefined && accountId == "NaN") {
      const invoices = await prisma.invoice.findMany({
        where: {
          projectId: {
              equals: parseInt(projectId.toString())
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true
        }

      });

      res.status(200).json(invoices);
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
