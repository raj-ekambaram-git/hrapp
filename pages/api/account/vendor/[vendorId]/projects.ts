// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ProjectStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const vendorId = req.query.vendorId;
  const accountId = req.query.accountId;

console.log("Vendor ID::"+vendorId+"---AccountioD::"+accountId)
  
  try {
    if(vendorId != "" && accountId != "" && accountId != "NaN" && accountId != undefined && vendorId != undefined && vendorId != "NaN") {
      const projects = await prisma.project.findMany({
        where: {
            vendorId: {
              equals: parseInt(vendorId.toString())            
            },
            accountId: {
              equals: parseInt(accountId.toString())
            },
            status: {
              not: ProjectStatus.MarkForDelete
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true,
          projectResource: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });
      res.status(200).json(projects);
    } else if (accountId != "" && accountId != undefined && vendorId == "NaN"){
      console.log("2222")
      const projects = await prisma.project.findMany({
        where: {
            accountId: {
              equals: parseInt(accountId.toString())
            },
            status: {
              not: ProjectStatus.MarkForDelete
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true,
          projectResource: true
        }

      });
      res.status(200).json(projects);

    }else if (vendorId != "" && vendorId != undefined && accountId == "NaN") {
      console.log("2222")
      const projects = await prisma.project.findMany({
        where: {
            vendorId: {
              equals: parseInt(vendorId.toString())
            },
            status: {
              not: ProjectStatus.MarkForDelete
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true,
          projectResource: true
        }

      });

      res.status(200).json(projects);
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
