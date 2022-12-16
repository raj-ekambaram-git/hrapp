import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from '../../../../services';
import {MODE_ADD} from "../../../../constants/accountConstants";
import {
  Card,
  CardHeader,
  Box,
  Heading,
  CardBody,
  Stack,
  Text,
  StackDivider,
  Badge,
  Flex,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import ProjectAddEditModal from "../../../../components/project/projectAddEditModal";

const VendorDetail = (props) => {
  const vendorId = props.data.vendorId;

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [vendor, setVendor] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  const navigateVendorEditPage = () => router.push("/account/vendor/"+vendor.id);
  const navigateManageVendorUsersPage = () => router.push("/account/vendor/"+vendor.id+"/users");
  const navigateVendorInvoicesPage = () => router.push("/account/vendor/"+vendor.id+"/invoices");
  const manageVendorsForAccount = () => router.push("/account/"+userService.getAccountDetails().accountId+"/vendors");
  
  const reloadPage = () => {
    setShow(false)
    reload();
  }

  const createProjectRequestData = {
    mode: MODE_ADD,
    vendorId: vendorId,
    isVendor: true,
    onClose: onClose,
    reloadPage: reloadPage
  }

  // set default input data
  useEffect(() => {
    getVendorDetails(vendorId, userService.getAccountDetails().accountId);
  }, []);


      /**
   * Function to get the list of accounts for a drop down
   */
  async function getVendorDetails(vendorId, accountId) {
    setPageAuthorized(true);

    let accoutIdToPas;
    if(userService.isSuperAdmin()) {
      accoutIdToPas = "NaN";
    }else {
      accoutIdToPas = accountId;
    }
    
    const responseData = await accountService.getVendorDetail(vendorId, accoutIdToPas);
    const vendorData =  {
      id: responseData.id.toString(),
      name: responseData.name,
      description: responseData.description,
      ein: responseData.ein,
      email: responseData.email,
      status: responseData.status,
      type: responseData.type,
      phone: responseData.phone,
      accountContactName: responseData.accountContactName,
      accountContactEmail: responseData.accountContactEmail,
      accountContactPhone: responseData.accountContactPhone,
      addressId: responseData.address[0].id,
      address1: responseData.address[0].address1,
      address2: responseData.address[0].address2,
      address3: responseData.address[0].address3,
      city: responseData.address[0].city,
      state: responseData.address[0].state,
      zipCode: responseData.address[0].zipCode,
      country: responseData.address[0].country
  };

  setVendor(vendorData)


  }

  return (

    <div>
      {isPageAuthprized ? (
        <>
          <Card>
            <CardHeader bgColor="heading">
              <HStack spacing="50rem">
                <Box>
                  <Heading size='md'>Vendor Details for {vendor.name}</Heading>
                </Box>
                <Box  alignItems='right'>
                  <Button className="btn" onClick={onOpen}>Create New Project</Button>
                  <Modal isOpen={isOpen} onClose={onClose} size="lg">
                    <ModalOverlay/>
                    <ProjectAddEditModal data={createProjectRequestData}></ProjectAddEditModal>
                  </Modal>  
                </Box>                  
              </HStack>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Details
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {vendor.description}
                  </Text>                
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    EIN
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {vendor.ein}
                  </Text>                
                </Box>                
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Vendor Contact Details
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {vendor.email}
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    {vendor.phone}
                  </Text>                  
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Vendor Contact Address
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {vendor.address1}
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    {vendor.address2}
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    {vendor.address3}
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    {vendor.city}, {vendor.state} {vendor.zipCode} 
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    {vendor.country}
                  </Text>                                                                                                            
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Vendor Account Contact Details
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {vendor.accountContactName}
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    {vendor.accountContactEmail}
                  </Text>                  
                  <Text pt='2' fontSize='sm'>
                    {vendor.accountContactPhone}
                  </Text>                      
                </Box>

                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Vendor Status
                  </Heading>
                  <Badge color={`${
                        vendor.status === "Active"
                          ? "paid_status"
                          : vendor.status === "Inactive"
                          ? "pending_status"
                          : "pending_status"
                      }`}>{vendor.status}
                  </Badge>              
                </Box>                
              </Stack>
            </CardBody>
          </Card>             

          <Flex marginTop="2rem">
                <HStack spacing={2}>
                  <Box>
                    <Button className="btn" onClick={navigateVendorEditPage}>
                      Edit
                    </Button>
                  </Box>
                  <Box>
                    <Button className="btn" onClick={manageVendorsForAccount}>
                     Account Vendors
                    </Button>
                  </Box>   
                  <Box>
                    <Button className="btn" onClick={navigateManageVendorUsersPage}>
                      Vendor Users
                    </Button>
                  </Box>   
                  <Box>
                    <Button className="btn" onClick={navigateVendorInvoicesPage}>
                      Vendor Invoices
                    </Button>
                  </Box>                                                      
                </HStack>
              </Flex>          
        </>
      ) : (
        <div className="account__header">
          <div className="iaccount_header-logo">
            <h3>Not Authorized to view this page. Please contact administrator.</h3>
          </div>
        </div>

      )}
    </div>    
  );
};

export default VendorDetail;



export async function getStaticPaths() {

  return {
    paths: [{ params: { vendorId: "1" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { vendorId } = context.params;

  return {
    props: {
      data: {
        vendorId: vendorId
      }
    },
    revalidate: 1,
  };

}
