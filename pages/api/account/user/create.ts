// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";
const bcrypt = require('bcryptjs');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = req.body;

    //get Salt for passowrd
    if(user.password != undefined) {
      const passwordSalt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(user.password, passwordSalt);
      user.passwordSalt = passwordSalt;
      user.password = passwordHash;

      console.log("passwordHash:::"+passwordHash);

      const savedUser = await prisma.user.create({
        data: user
      });
      res.status(200).json(savedUser);
  
    }else {
      res.status(400).json({ message: 'Something went wrong while saving account' })
    }

    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
