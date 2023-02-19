// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const projectId = req?.query?.projectId;
  const accountId = req?.query?.accountId;

console.log("projectId ID::"+projectId+"---AccountioD::"+accountId)
  
  try {
    if(projectId && projectId) {
      const purchaseOrders = await prisma.purchaseOrder.findMany({
        where: {
          project: {
            accountId: parseInt(accountId.toString())
          },
          projectId: parseInt(projectId.toString())
        },
        orderBy: {
          id: "desc"
        },
      });

      console.log("PROJECT purchaseOrders:: :"+JSON.stringify(purchaseOrders))
      res.status(200).json(purchaseOrders);
    }  else {
      res.status(400).json({ message: 'Something went wrong while getting project purchaseOrders' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting purchaseOrders' })
  }
}
