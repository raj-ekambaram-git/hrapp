import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from '../../../services';
import {EMPTY_STRING, MODE_ADD} from "../../../constants/accountConstants";
import {
  Box,
  Heading,
  Stack,
  Badge,
  Flex,
  HStack,
  Button,
  useDisclosure,
  Accordion,

} from '@chakra-ui/react';
import ProjectAddEditSection from "../../../components/project/projectAddEditSection";
import VendorDetailSection from "../../../components/vendor/detail/vendorDetailSection";
import VendorBankDetailSection from "../../../components/vendor/detail/vendorBankDetailSection";
import VendorContactDetailSection from "../../../components/vendor/detail/vendorContactDetailSection";
import VendorContactAddressSection from "../../../components/vendor/detail/vendorContactAddressSection";
import VendorAccountContactDetailSection from "../../../components/vendor/detail/vendorAccountContactDetailSection";
import VendorProjectsSection from "../../../components/vendor/detail/vendorProjectsSection";
import VendorUserAddSection from "../../../components/vendor/vendorUserAddSection";
import { useDispatch, useSelector } from "react-redux";
import { resetVendorUsers, setVendorUsers } from "../../../store/modules/Vendor/actions";
import { DocumentConstants, NotesConstants } from "../../../constants";
import NotesHistory from "../../../components/notes/notesHistory";
import { resetUsersByAccount } from "../../../store/modules/Account/actions";
import { resetNotesType, setNotesType } from "../../../store/modules/Notes/actions";
import VendorDetailActions from "../../../components/vendor/detail/vendorDetailActions";
import { setDocumentType } from "../../../store/modules/Document/actions";



const VendorDetail = (props) => {
  const vendorId = useSelector(state => state.vendor.selectedVendorId);

  const router = useRouter();
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [vendor, setVendor] = useState({});
  const [vendorAddress, setVendorAddress] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  const createProjectRequestData = {
    mode: MODE_ADD,
    vendorId: vendorId,
    isVendor: true,
    onClose: onClose,
    modalRequest: true
  }

    //To Enable Notes
    const notesData = {
      type: NotesConstants.NOTES_TYPE.Vendor,
      typeId: parseInt(vendorId),
      typeName: vendor.name
    }
    //To Enable Documents
    const documentData = {
      type: DocumentConstants.DOCUMENMT_TYPE.Vendor,
      typeId: parseInt(vendorId),
      typeName: vendor.name
    }

  // set default input data
  useEffect(() => {
    dispatch(resetVendorUsers());
    dispatch(resetUsersByAccount());
    dispatch(resetNotesType())
    getVendorDetails(vendorId, userService.getAccountDetails().accountId);
    dispatch(setNotesType(notesData));
    dispatch(setDocumentType(documentData))
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
      project: [],
      accountContactName: responseData.accountContactName,
      accountContactEmail: responseData.accountContactEmail,
      accountContactPhone: responseData.accountContactPhone,
      addressId: responseData.address[0].id,
      addressName: responseData.address[0].addressName,
      address1: responseData.address[0].address1,
      address2: responseData.address[0].address2,
      address3: responseData.address[0].address3,
      city: responseData.address[0].city,
      state: responseData.address[0].state,
      zipCode: responseData.address[0].zipCode,
      country: responseData.address[0].country
  };

  const vendorAddressData =  {
    addressId: responseData.address[0].id,
    addressName: responseData.address[0].addressName,
    address1: responseData.address[0].address1,
    address2: responseData.address[0].address2,
    address3: responseData.address[0].address3,
    city: responseData.address[0].city,
    state: responseData.address[0].state,
    zipCode: responseData.address[0].zipCode,
    country: responseData.address[0].country
};


  setVendorAddress(vendorAddressData)
  setVendor(responseData)
  if(responseData.vendorUsers != undefined && responseData.vendorUsers != EMPTY_STRING && responseData.vendorUsers?.length >0) {
    dispatch(setVendorUsers(responseData.vendorUsers))
  }
  


  }

  return (

    <div>
      {isPageAuthprized ? (
        <>

          <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="page.heading"
            bg="heading"
            color="white"
            marginBottom="page.heading_marginBottom"
            width="page.heading_width"
            borderRadius='9px'
          >
            <Heading size='md'>Vendor Details for {vendor.name}</Heading>
            <Box alignItems='right'>
              <HStack>
                  <Box>
                    <Button size="xs" colorScheme="yellow" onClick={() => router.back()}>
                      Go Back
                    </Button>
                  </Box>
                  <Box color="black">
                    <NotesHistory/>
                  </Box>
                  <VendorUserAddSection data={{vendorId: vendorId, vendorName: vendor.name}}/>
                  <ProjectAddEditSection data={createProjectRequestData}></ProjectAddEditSection>                  
              </HStack>                  
            </Box>                  
          </Flex>
          <VendorDetailActions data={{vendor}}/>
          <Flex>
              <Stack width="page.sub_heading_width">
                {/* <Accordion marginBottom="1rem" border="1px" width="60%"> */}

                <Accordion defaultIndex={[0]} variant="mainPage">
                  <VendorDetailSection data={{vendor}}/ >
                  <VendorBankDetailSection data={{vendor}}/>
                  <VendorContactDetailSection data={{vendor}}/>                 
                  <VendorContactAddressSection data={{vendorAddress}}/>
                  <VendorAccountContactDetailSection data={{vendor}}/>
                  <VendorProjectsSection data={{vendor}}/>
                 </Accordion>                
                <Box>
                  <Heading size='xs' textTramarginBottom="1rem">
                     Status
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

