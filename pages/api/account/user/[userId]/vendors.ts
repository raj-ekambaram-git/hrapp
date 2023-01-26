// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { VendorUserStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  enum VendorStatus {
    Approved = "Approved",
    Rejected = "Rejected",
    Active = "Active",
    Inactive = "Inactive",
    Fraud = "Fraud",
    MarkForDelete = "MarkForDelete"
  }

  const userId = req.query.userId;
  const accountId = req.query.accountId;

  console.log("userId ID::"+userId+"---AccountioD::"+accountId)
  
  try {
    if(userId != "" && accountId != "" && accountId != "NaN" && accountId != undefined && userId != undefined && userId != "NaN") {
      console.log("11111");
      const vendorUsers = await prisma.vendorUsers.findMany({
        where: {
            userId: {
              equals: parseInt(userId.toString())            
            },
            vendor: {
              accountId: {
                equals: parseInt(accountId.toString())
              },
              status: {
                in: [VendorStatus.Active, VendorStatus.Approved]
              }
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: {
            select: {
              name: true
            }
          },
        }
      });
      res.status(200).json(vendorUsers);
    } else if (accountId != "" && accountId != undefined && userId == "NaN"){
      console.log("2222");
      const vendorUsers = await prisma.vendorUsers.findMany({
        where: {
            userId: {
              equals: parseInt(userId.toString())            
            },
            vendor: {
              accountId: {
                equals: parseInt(accountId.toString())
              },
              status: {
                in: [VendorStatus.Active, VendorStatus.Approved]
              }
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: {
            select: {
              name: true
            }
          },
        }
      });
      res.status(200).json(vendorUsers);

    }else if (userId != "" && userId != undefined && accountId == "NaN") {
      console.log("33333333");
      const vendorUsers = await prisma.vendorUsers.findMany({
        where: {
            userId: {
              equals: parseInt(userId.toString())            
            },
            status: {
              not: VendorUserStatus.MarkForDelete
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
        }
      });

      res.status(200).json(vendorUsers);
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
