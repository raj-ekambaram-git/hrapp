import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  useToast, Heading, HStack, Slider, Stack, Switch, Text,
} from '@chakra-ui/react';
import { importExportService, schedulerService, userService } from "../../../services";
import { ScheduleJobConstants } from "../../../constants";
import { Spinner } from "../../common/spinner";
import { util } from "../../../helpers";
import { ExportTemplateType } from "@prisma/client";


const InvoiceDueReminder = (props) => {
  const toast =useToast()
  const [invoiceDueReminderEnabled, setInvoiceDueReminderEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState();

  useEffect(() => {
    populateReminders()

  }, []);


  const handleStatusUpdate = async() => {
    setLoading(true)
    const responseData = await schedulerService.updateStatus(ScheduleJobConstants.JOB_STATUS.Delete, ScheduleJobConstants.JOB_NAME_PREFIX.WEEKLY_TS_REMINDER+"_"+userService.getAccountDetails().accountId+"_"+userService.userValue.id, userService.userValue.id+"_"+userService.getAccountDetails().accountId+ScheduleJobConstants.JOB_GROUP_SUFFIX.INVOICE_DUE_REMINDER, userService.userValue.id, userService.getAccountDetails().accountId)    
    if(responseData.error) {
      toast({
        title: "Update Invoice Due Reminder",
        description: 'Error updating invoice due reminder, please try again later or contact administrator. Details:'+err.errorMessage,
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
      setLoading(false)
    } else {
      toast({
        title: "Update Invoice Due Reminder",
        description: 'Successfully updated the invoice due reminder.',
        status: 'success',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
      setInvoiceDueReminderEnabled(false)
    }

    setLoading(false)

  }



  const handleSaveJob =  async() => {   
        setLoading(true)  
        const nowPlustTwoMinutes = new Date();
        nowPlustTwoMinutes.setMinutes(nowPlustTwoMinutes.getMinutes() + 2);
        const jobDataRequest = {
            "jobRequestData": {
              "accountId": userService.getAccountDetails().accountId,
              "cronExpression": "0 00 07 ? * MON *",
              "jobGroup": userService.userValue.id+"_"+userService.getAccountDetails().accountId+ScheduleJobConstants.JOB_GROUP_SUFFIX.INVOICE_DUE_REMINDER,
              "name": ScheduleJobConstants.JOB_NAME_PREFIX.INVOICE_DUE_REMINDER,
              "templateId": template.id,
              "templateName": ScheduleJobConstants.INVOICE_DUE_REMINDER_TEMPLATE_NAME,
              "templateParams": [],
              "userId": userService.userValue.id
            },
            "scheduleTime": {
              "scheduledTime": nowPlustTwoMinutes,
              "zoneId": "UTC",
              "callerTimeZone": util.getLocaleTimeZone(),
            }
          }
        const responseData = await schedulerService.scheduleJob(jobDataRequest, userService.getAccountDetails().accountId)
        
        if(responseData.error) {
            toast({
                title: "Enable Invoice Due Reminder",
                description: 'Error enabling new reminder. Please try again later or contact administrator. Details:'+responseData.errorMessage,
                status: 'error',
                position: 'top',
                duration: 6000,
                isClosable: true,
            })
        } else {
            toast({
                title: "Enable Invoice Due Reminder",
                description: 'Successfully enabled new reminder.',
                status: 'success',
                position: 'top',
                duration: 6000,
                isClosable: true,
            })
            setInvoiceDueReminderEnabled(true)
        }    
        setLoading(false)
  }

  const populateReminders = async() => {
    setLoading(true)
    const templateData = await importExportService.getSavedExportTemplateByName(ScheduleJobConstants.INVOICE_DUE_REMINDER_TEMPLATE_NAME, ExportTemplateType.System);
    if(templateData) {
      setTemplate(templateData)
      const responseData = await schedulerService.checkUInvoiceDueReminder(userService.userValue.id, userService.getAccountDetails().accountId);
      if(responseData && responseData.data && responseData.data?.length>0) {
        setInvoiceDueReminderEnabled(true)
      }
    }


    setLoading(false)
  }
  return (

    <>
        <Stack spacing={5} marginBottom={6}>
            <Card>
                <CardBody>
                    {loading?<><Spinner /></>:<></>}
                      <Heading size="sm" marginBottom={4}>
                          <HStack>
                            <Text>Invoice Due Reminders</Text>   
                          </HStack>                               
                      </Heading>                                 

                    <HStack>
                      {invoiceDueReminderEnabled?<>
                        <Text fontSize="14px">Stromg sending invoice due reminder for your clients </Text>
                        <Switch colorScheme='red' size='sm' id='pending' isChecked onChange={() => handleStatusUpdate()}>Disable</Switch>
                      </>:<>
                        <Text fontSize="14px">Send invoice due reminder for your clients </Text>
                        <Switch colorScheme='teal' size='sm' id='pending' isChecked onChange={() => handleSaveJob()}>Enable</Switch>
                      </>}

                    </HStack>
                </CardBody>
            </Card>
      </Stack>   
    </>


  );
};

export default InvoiceDueReminder;
