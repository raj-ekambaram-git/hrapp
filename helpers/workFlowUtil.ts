
export const workFlowUtil = {
  validateStepsDataFilled,
  checkDueDatesAreValid,
};

function checkDueDatesAreValid(steps) {

  if(steps) {
    let currentDate = new Date();
    return steps?.map((step) => {
      console.log("currentDate:::"+currentDate+"*****step.dueDate:::"+step.dueDate)
      if(step.dueDate && currentDate <= step.dueDate) {
        currentDate = step.dueDate;
        return true
      } else {
        return false
      }
    }).includes(false)
  }  
}

function validateStepsDataFilled(steps) {

  if(steps) {
    return steps?.map((step) => {
      if(step.task && step.assignedTo && step.dueDate) {
        return true
      } else {
        return false
      }
    }).includes(false)
  }  
}