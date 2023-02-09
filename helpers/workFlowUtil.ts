import { WorkFlowStepStatus } from "@prisma/client";
import { util } from "./util";

export const workFlowUtil = {
  validateStepsDataFilled,
  checkDueDatesAreValid,
};

function checkDueDatesAreValid(steps) {

  if(steps) {
    let currentDate = new Date((new Date()).toDateString());
    
    return steps?.map((step) => {
      console.log("STEP#:::"+step.stepNumber+"DUE DATE:::"+step.dueDate+"****STATUS::"+step.status+"****currentDate::"+currentDate)
      console.log("(step.dueDate && currentDate <= step.dueDate):::"+util.getFormattedDate(step.dueDate))
      if((util.getLocaleDate(step.dueDate) && currentDate <= util.getLocaleDate(step.dueDate)) || step.status === WorkFlowStepStatus.Complete ) {
        currentDate = util.getLocaleDate(step.dueDate);
        console.log('true...')
        return true
      } else {
        console.log("False")
        return false
      }
    }).includes(false)
  }  
}

function validateStepsDataFilled(steps) {

  if(steps) {
    return steps?.map((step) => {
      if(step.taskId && step.assignedTo && step.dueDate) {
        return true
      } else {
        return false
      }
    }).includes(false)
  }  
}