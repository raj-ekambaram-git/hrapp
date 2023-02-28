// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { emailService } from "../../../../../services";
import { CommonConstants, EmailConstants } from "../../../../../constants";
const jwt = require('jsonwebtoken');
import getConfig from 'next/config';
import prisma from "../../../../../lib/prisma";
import { util } from "../../../../../helpers";
import { TimesheetStatus, UserStatus } from "@prisma/client";
const { serverRuntimeConfig } = getConfig();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("req.body:::"+JSON.stringify(req.body))
    const {user} = req.body;



    console.log("user::"+JSON.stringify(user)+"****user.userId::"+user.userId + "***** user.accountId::"+ user.accountId)

    if(user.userId && user.accountId  ) {

      console.log("insdieee")
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      /**
       * #1 - Get the currrent week timeheet name
       * #2 - Check if the timesheet is present
       * #3 - If not present send the email
       * 
       */

      const userRecord = await prisma.user.findUnique({
        where: {
          id: parseInt(user.userId?.toString())
        },
      });

      if(userRecord && (userRecord.status === UserStatus.Active || userRecord.status === UserStatus.Approved)) {
        const calendar = await prisma.calendar.findUnique({
          where: {
            dateDimId: parseInt(yyyy+mm+dd)
          },
        });
  
        if(calendar && calendar.weekOfYearISO) {
  
          const timesheet = await prisma.timesheetEntries.findMany({
            where: {
              timesheet: {
                userId: parseInt(user.userId?.toString()),
                name: calendar.weekOfYearISO
              },
              status: {
                in: [TimesheetStatus.Submitted, TimesheetStatus.Approved, TimesheetStatus.Invoiced]
              }
  
            },
  
          });
  
          if(!timesheet || (timesheet && timesheet.length == 0)) {
            //Either timesheet not present or its just saved and not submitted
            const emailResponse = emailService.sendEmail(getTimesheetReminderEmailRequest(userRecord, calendar.weekOfYearISO, calendar.firstDayOfWeek));
            res.status(200).json(emailResponse);
          }
  
        } else {
          res.status(400).json({ message: 'Something went wrong while sending timesheet reminder. Calendar entry not found' })  
        }
      } else {
        res.status(400).json({ message: 'User not present or in active state' })  
      }
  
    }else {
      res.status(400).json({ message: 'Something went wrong while sending timesheet reminder' })
    }

    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while sending timesheet reminder' })
  }
}



function getTimesheetReminderEmailRequest(userRecord, timesheetName, firstDayOfWeek) {
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