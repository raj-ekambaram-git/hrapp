import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from '../../../services';
import {
  Card,
  CardHeader,
  Box,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  HStack,
  useDisclosure,
  Accordion,
  Flex,
  Button,

} from '@chakra-ui/react'
import UserDetailSection from "../../../components/user/detail/userDetailSection";
import UserAccountDetailSection from "../../../components/user/detail/userAccountDetailSection";
import UserCredentialsSection from "../../../components/user/detail/userCredentialsSection";
import UserContactSection from "../../../components/user/detail/userContactSection";
import { useSelector, useDispatch } from "react-redux";
import { DocumentConstants } from "../../../constants";
import { setDocumentType } from "../../../store/modules/Document/actions";
import UserDetailActions from "../../../components/user/detail/userDetailActions";





const UserDetail = (props) => {
  // const userId = useSelector(state => state.user.loggedInUser?.id);
  const userId = userService?.userValue?.id;

  
  const router = useRouter();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [user, setUser] = useState({});
  const [userAddress, setUserAddress] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);



  // set default input data
  useEffect(() => {
    getUserDetails();
  }, []);



  async function getUserDetails() {
    setPageAuthorized(true);
    const userResonse = await accountService.userDetails(userId);
    const userData =  {
        id: userResonse.id.toString(),
        firstName: userResonse.firstName,
        lastName: userResonse.lastName,
        userRole: userResonse.role,
        userEmail: userResonse.email,
        userPhone: userResonse.phone,
        userAccountId: userResonse.accountId,
        userAccountName: userResonse.account?.name,
        userAccountType: userResonse.account?.type,
        userVendorId: userResonse.vendorId,
        userVendorName: userResonse.vendor?.name,
        timeSheetEnabled: userResonse.isTimeSheetEnabled,
        userStatus: userResonse.status,
        addressId: userResonse.address&&userResonse.address.length>0?userResonse.address[0]?.id:null,
        addressName: userResonse.address&&userResonse.address.length>0?userResonse.address[0]?.addressName:null,
        address1: userResonse.address&&userResonse.address.length>0?userResonse.address[0]?.address1:null,
        address2: userResonse.address&&userResonse.address.length>0?userResonse.address[0]?.address2:null,
        address3: userResonse.address&&userResonse.address.length>0?userResonse.address[0]?.address3:null,
        city: userResonse.address&&userResonse.address.length>0?userResonse.address[0]?.city:null,
        state: userResonse.address&&userResonse.address.length>0?userResonse.address[0]?.state:null,
        zipCode: userResonse.address&&userResonse.address.length>0?userResonse.address[0]?.zipCode:null,
        country: userResonse.address&&userResonse.address.length>0?userResonse.address[0]?.country:null,
        userVendors: userResonse.vendorUsers,
    };
    setUser(userData);


    const documentData = {
      type: DocumentConstants.DOCUMENMT_TYPE.User,
      typeId: parseInt(user.id),
      typeName: user.firstName
    }
    dispatch(setDocumentType(documentData))

  }

  return (

    <Box width="page.sub_heading_width">
      {isPageAuthprized ? (
        <>
          <Card>
            <CardHeader bgColor="heading">
              <Flex
                as="nav"
                align="center"
                justify="space-between"
                wrap="wrap"
                bg="heading"
                color="white"
                width="page.heading_width"
                borderRadius='9px'
              >
              <Heading size='md'>Hi, {user.firstName} {user.lastName}!</Heading>
              <HStack spacing={2}>
                <Box>
                  <Button size="xs" colorScheme="yellow" onClick={() => router.back()}>
                    Go Back
                  </Button>
                </Box>
              </HStack>                                   
              </Flex>                              
            </CardHeader>
            <UserDetailActions/>
            <CardBody>
              <Stack divider={<StackDivider />} spacing='1'>
                <Accordion defaultIndex={[0]} variant="mainPage">
                  <UserDetailSection data={{user}}/>
                  <UserCredentialsSection data={{user}}/>
                  <UserAccountDetailSection data={{user}}/>
                  <UserContactSection data={{user}}/>
                 </Accordion>                
              </Stack>
            </CardBody>
          </Card>             

    
        </>
      ) : (
        <div className="account__header">
          <div className="iaccount_header-logo">
            <h3>Not Authorized to view this page. Please contact administrator.</h3>
          </div>
        </div>

      )}
    </Box>    
  );
};

export default UserDetail;
