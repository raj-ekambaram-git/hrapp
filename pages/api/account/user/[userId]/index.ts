// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";
const bcrypt = require('bcryptjs');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = req.body;
    console.log("Inside the update user:::"+JSON.stringify(user));
    //get Salt for passowrd
    if(user.password != undefined) {
      const passwordSalt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(user.password, passwordSalt);
      user.passwordSalt = passwordSalt;
      user.password = passwordHash;

      console.log("passwordHash:::"+passwordHash);
    }
      const savedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: user
      });
      res.status(200).json(savedUser);
  
    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
