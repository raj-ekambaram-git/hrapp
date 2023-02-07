
export const documentUtil = {
  getVendorConfigData,
  getProjectConfigData,
};


function getVendorConfigData(vendorDetails) {
  const configData = []
  //Get Vendor Name
  if(vendorDetails.name) {
    configData.push({"key": "***vendorName***", "type": "textTabs", "valueAccepted": true, "value": vendorDetails.name})  
  }
  if(vendorDetails.email) {
    configData.push({"key": "***vendorEmail***", "type": "textTabs", "valueAccepted": true, "value": vendorDetails.email})  
  }
  if(vendorDetails.phone) {
    configData.push({"key": "***vendorPhone***", "type": "textTabs", "valueAccepted": true, "value": vendorDetails.phone})  
  }
  if(vendorDetails.accountContactName) {
    configData.push({"key": "***accountContactName***", "type": "textTabs", "valueAccepted": true, "value": vendorDetails.accountContactName})  
  }
  if(vendorDetails.accountContactEmail) {
    configData.push({"key": "***accountContactEmail***", "type": "textTabs", "valueAccepted": true, "value": vendorDetails.accountContactEmail})  
  }
  if(vendorDetails.accountContactPhone) {
    configData.push({"key": "***accountContactPhone***", "type": "textTabs", "valueAccepted": true, "value": vendorDetails.accountContactPhone})  
  }
  if(vendorDetails.address && vendorDetails.address.length > 0) {
    let  addressStr = vendorDetails.address[0].address1+ ", "
    addressStr = vendorDetails.address[0].address2?addressStr+vendorDetails.address[0].address2+", ":""
    addressStr = vendorDetails.address[0].address3?addressStr+vendorDetails.address[0].address3+", ":""
    addressStr = vendorDetails.address[0].city?addressStr+vendorDetails.address[0].city+", ":""
    addressStr = vendorDetails.address[0].state?addressStr+vendorDetails.address[0].state+", ":""
    addressStr = vendorDetails.address[0].zipCode?addressStr+vendorDetails.address[0].zipCode+", ":""
    addressStr = vendorDetails.address[0].country?addressStr+vendorDetails.address[0].country:""

    configData.push({"key": "***vendorAddress***", "type": "textTabs", "valueAccepted": true, "value": addressStr})  
  }
  

  return configData;
}


function getProjectConfigData(projectDetails) {
  console.log("projectDetails:::"+JSON.stringify(projectDetails))
  const configData = []
  //Get Vendor Name
  if(projectDetails.name) {
    configData.push({"key": "***projectName***", "type": "textTabs", "valueAccepted": true, "value": projectDetails.name})  
  }
  if(projectDetails.contactName) {
    configData.push({"key": "***projectContactName***", "type": "textTabs", "valueAccepted": true, "value": projectDetails.contactName})  
  }
 
  if(projectDetails.contactEmail) {
    configData.push({"key": "***projectContactEmail***", "type": "textTabs", "valueAccepted": true, "value": projectDetails.contactEmail})  
  }
  if(projectDetails.contactPhone) {
    configData.push({"key": "***projectPhone***", "type": "textTabs", "valueAccepted": true, "value": projectDetails.contactPhone})  
  }
  if(projectDetails.vendor?.accountContactName) {
    configData.push({"key": "***accountContactName***", "type": "textTabs", "valueAccepted": true, "value": projectDetails.vendor?.accountContactName})  
  }
  if(projectDetails.vendor?.accountContactEmail) {
    configData.push({"key": "***accountContactEmail***", "type": "textTabs", "valueAccepted": true, "value": projectDetails.vendor?.accountContactEmail})  
  }
  if(projectDetails.vendor?.accountContactPhone) {
    configData.push({"key": "***accountContactPhone***", "type": "textTabs", "valueAccepted": true, "value": projectDetails.vendor?.accountContactPhone})  
  }
  if(projectDetails.address && projectDetails.address.length > 0) {
    let  addressStr = projectDetails.address[0].address1+ ", "
    addressStr = projectDetails.address[0].address2?addressStr+projectDetails.address[0].address2+", ":""
    addressStr = projectDetails.address[0].address3?addressStr+projectDetails.address[0].address3+", ":""
    addressStr = projectDetails.address[0].city?addressStr+projectDetails.address[0].city+", ":""
    addressStr = projectDetails.address[0].state?addressStr+projectDetails.address[0].state+", ":""
    addressStr = projectDetails.address[0].zipCode?addressStr+projectDetails.address[0].zipCode+", ":""
    addressStr = projectDetails.address[0].country?addressStr+projectDetails.address[0].country:""

    configData.push({"key": "***projectAddress***", "type": "textTabs", "valueAccepted": true, "value": addressStr})  
  }
  

  return configData;
}