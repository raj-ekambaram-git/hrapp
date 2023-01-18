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
        userVendorId: userResonse.vendorId,
        userVendorName: userResonse.vendor?.name,
        timeSheetEnabled: userResonse.isTimeSheetEnabled,
        userStatus: userResonse.status,
        addressId: userResonse.address[0]?.id,
        addressName: userResonse.address[0]?.addressName,
        address1: userResonse.address[0]?.address1,
        address2: userResonse.address[0]?.address2,
        address3: userResonse.address[0]?.address3,
        city: userResonse.address[0]?.city,
        state: userResonse.address[0]?.state,
        zipCode: userResonse.address[0]?.zipCode,
        country: userResonse.address[0]?.country
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

    <div>
      {isPageAuthprized ? (
        <>
          <Card>
            <CardHeader bgColor="heading">
              <HStack spacing="50rem">
                <Box>
                  <Heading size='md'>Hi, {user.firstName} {user.lastName}!</Heading>
                </Box>
              </HStack>
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
    </div>    
  );
};

export default UserDetail;
