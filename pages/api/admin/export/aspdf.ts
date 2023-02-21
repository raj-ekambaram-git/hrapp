// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import puppeteer from 'puppeteer'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // if (req.method !== 'GET') {
  //   return res.status(405).json({ message: 'Method not allowed' });
  // }

  const accountId = req.query.accountId;
  console.log("AS PDF::: Account ::"+accountId)
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto('https://www.backofficeneeds.com')
    await page.emulateMediaType('screen')
  
    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close()

    console.log("pdfBuffer:::"+pdfBuffer)
    res.statusCode = 200;
    res.send(pdfBuffer)
  
    

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
