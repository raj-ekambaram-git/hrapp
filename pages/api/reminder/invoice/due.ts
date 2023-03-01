// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"


const jwt = require('jsonwebtoken');
import getConfig from 'next/config';
import { TimesheetStatus, UserStatus } from "@prisma/client";
import { emailService } from "../../../../services";
import prisma from "../../../../lib/prisma";
import { CommonConstants, EmailConstants } from "../../../../constants";
const { serverRuntimeConfig } = getConfig();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {invoiceId} = req.body;
    const {accountId} = req.body;
    const {daysBeforeDue} = req.body;


    console.log("accountId::"+JSON.stringify(accountId)+"****invoiceId::"+invoiceId)

    if(invoiceId && accountId  ) {


  
    }else {
      res.status(400).json({ message: 'Something went wrong while sending timesheet reminder' })
    }

    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while sending timesheet reminder' })
  }
}



function getInvoiceReminderEmailRequest(userRecord, timesheetName, firstDayOfWeek) {
  return {
    withAttachment: false,
    from: CommonConstants.fromEmail,
    to: userRecord.email,
    templateData: {
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      timesheetName: timesheetName,
      firstDayOfWeek: firstDayOfWeek
    },
    template_id: EmailConstants.emailTemplate.userWeeklyTSReminder
  }

}