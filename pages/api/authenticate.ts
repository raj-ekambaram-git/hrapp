const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import getConfig from 'next/config';
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../lib/prisma";


const { serverRuntimeConfig } = getConfig();



// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const login = req.body;
    
    // const savedAccount: Prisma.UserCreateInput = JSON.parse(req.body);
    // const savedAccount = await prisma.account.update({
    //   where: {
    //     id: account.id,
    //   },
    //   data: account
    // });
    
    // // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: "raj.ekambaram@yopmail.com" }, serverRuntimeConfig.secret, { expiresIn: '7d' });

    // return basic user details and token
    return res.status(200).json({
        id: 1,
        username: "raj@yopmail.com",
        firstName: "Raja",
        lastName: "Pandiyan",
        role: "ACCOUNT_ADMIN",
        accountId: 1,
        token
    });
    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
