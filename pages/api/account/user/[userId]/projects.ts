// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ProjectStatus, TimesheetStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.query?.userId;
  const accountId = req.query?.accountId;
  const filter = req.query?.filter;
  const whereClasuse = {
      userId: {
        equals: parseInt(userId.toString())            
      },
      project: {
        accountId: {
          equals: parseInt(accountId.toString())
        },
        status: {
          in: [ProjectStatus.Open, ProjectStatus.Closed, ProjectStatus.Settled]
        },
      },
  }

  if(filter && filter === "billable") {
    whereClasuse["billable"] = true;
  }
console.log("userId ID::"+userId+"---AccountioD::"+accountId+"***filter::"+filter+"*****whereClasuse::"+JSON.stringify(whereClasuse))
  
  try {
    if(userId != "" && accountId != "" && accountId != "NaN" && accountId != undefined && userId != undefined && userId != "NaN") {
      const projects = await prisma.projectResource.findMany({
        where: whereClasuse,
        orderBy: {
          id: "desc"
        },
        include: {
          project: {            
            include: {
              projectResource: {
                select: {
                  cost: true,
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                    }
                  }
                }
              }
            }
          },
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
      res.status(200).json(projects);
    } else if (accountId != "" && accountId != undefined && userId == "NaN"){
      console.log("2222");
      const projects = await prisma.projectResource.findMany({
        where: whereClasuse,
        orderBy: {
          id: "desc"
        },
        include: {
          project: true,
        }
      });
      res.status(200).json(projects);

    }else if (userId != "" && userId != undefined && accountId == "NaN") {
      const projects = await prisma.projectResource.findMany({
        where: whereClasuse,
        orderBy: {
          id: "desc"
        },
        include: {
          project: true,
        }
      });

      res.status(200).json(projects);
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
