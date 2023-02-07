
export const documentUtil = {
  getVendorConfigData,
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