// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Role, UserStatus, VendorUserStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../constants/accountConstants";
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const vendorId = req.query.vendorId;
  const accountId = req.query.accountId;
  const filterBy = req.query.filterBy;

console.log("Vendor ID::"+vendorId+"---AccountioD::"+accountId+"****filterBy::"+filterBy)
  
  try {
    if(vendorId != EMPTY_STRING && accountId != EMPTY_STRING && accountId != "NaN" && accountId != undefined && vendorId != undefined) {
      const users = await prisma.vendorUsers.findMany({
        where: {
            vendorId: {
              equals: parseInt(vendorId.toString())            
            },
            user: {
              accountId: {
                equals: parseInt(accountId.toString())
              }
            },
            status: {
              not: VendorUserStatus.MarkForDelete
            }
        },
        orderBy: {
          lastUpdateDate: "desc"
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              userRole: true,
              cost: true
            }
          },
          vendor: {
            select: {
              name: true,
              account: true
            }
          },
          
        }
      });
      res.status(200).json(users);
    } else if (accountId != EMPTY_STRING && accountId != undefined && (vendorId == EMPTY_STRING || vendorId == undefined)){
      if(filterBy && filterBy === "Admins") {
        const users = await prisma.user.findMany({
          where: {
              accountId: {
                equals: parseInt(accountId.toString())
              },
              status: {
                not: UserStatus.MarkForDelete,
                in: [UserStatus.Active, UserStatus.Approved]
              },
              userRole: {
                hasSome: [Role.ACCOUNT_ADMIN, Role.ACCOUNT_MANAGER, Role.ACCOUNT_VENDOR_REP]
              }
          },
          orderBy: {
            lastUpdateDate: "desc"
          },
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        });
        res.status(200).json(users);
      } else {
        const users = await prisma.user.findMany({
          where: {
              accountId: {
                equals: parseInt(accountId.toString())
              },
              status: {
                not: UserStatus.MarkForDelete
              }
          },
          orderBy: {
            lastUpdateDate: "desc"
          },
          include: {
            account: true
          }
  
        });
        res.status(200).json(users);
      }


    }else if (vendorId != EMPTY_STRING && vendorId != undefined && accountId == "NaN") {
      const users = await prisma.vendorUsers.findMany({
        where: {
            vendorId: {
              equals: parseInt(vendorId.toString())            
            },
        },
        orderBy: {
          lastUpdateDate: "desc"
        },
        include: {
          user: true,
          vendor: {
            select: {
              name: true,
              account: true
            }
          },
          
        }
      });
      res.status(200).json(users);
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
