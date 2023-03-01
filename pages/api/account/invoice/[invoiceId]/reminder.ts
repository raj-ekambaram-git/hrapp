// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";
import getConfig from 'next/config';
import { fetchWrapper } from "../../../../../helpers";
const { serverRuntimeConfig } = getConfig();
const serverBaseUrl = `${serverRuntimeConfig.apiUrl}`;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const invoiceId = req.query?.invoiceId;
    const accountId = req.query?.accountId;
    const authHeader = {Authorization: req.headers.authorization}

    if(invoiceId && accountId) {

    } else {
      res.status(400).json({ message: 'Something went wrong while sending invoice reminder.' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
