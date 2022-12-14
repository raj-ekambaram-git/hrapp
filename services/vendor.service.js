import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';



const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const vendorService = {

    updateVendor,
    createVendor
 

};

function createVendor(formData) {
  return fetchWrapper.post(`${baseUrl}/account/vendor/create`, {
      name: formData.name,
      description: formData.description,
      address: {
        create: [
          {
            type: "V",
            accountId: parseInt(formData.accountId),
            addressName: formData.addressName,
            address1: formData.address1,
            address2: formData.address2,
            address3: formData.address3,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            status: "A"
          }
        ]
      },
      email: formData.email,
      type: formData.type,
      phone: formData.phone,
      accountId: parseInt(formData.accountId),
      ein: formData.ein,
      status: formData.status,
      accountContactName: formData.accountContactName,
      accountContactEmail: formData.accountContactEmail,
      accountContactPhone: formData.accountContactPhone

    })
    .then(vendor => {
      return vendor;
    })
    .catch(err => {
      console.log("Error Creating Vendor::"+err)
      return {errorMessage: err, error: true};
  });
}

function updateVendor(formData, vendorId, addressId) {

  return fetchWrapper.put(`${baseUrl}/account/vendor/`+vendorId, {
      id: parseInt(vendorId),
      name: formData.name,
      description: formData.description,
      address: {
        update: {
          where: {
            id: addressId,
          },
          data:
          {
            type: "V",
            addressName: formData.addressName,
            address1: formData.address1,
            address2: formData.address2,
            address3: formData.address3,
            accountId: parseInt(formData.accountId),
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            status: "A"
          }
        }
      },
      email: formData.email,
      type: formData.type,
      phone: formData.phone,
      accountId: parseInt(formData.accountId),
      ein: formData.ein,
      status: formData.status,
      accountContactName: formData.accountContactName,
      accountContactEmail: formData.accountContactEmail,
      accountContactPhone: formData.accountContactPhone

    })
    .then(vendor => {
      
      return vendor;
    })
    .catch(err => {
      console.log("Error Updating Vendor::"+err)
      return {errorMessage: err, error: true};
  });
}

