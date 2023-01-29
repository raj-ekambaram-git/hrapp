import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService } from "../../services";
import {MODE_ADD, USER_VALIDATION_SCHEMA, USER_ROLES_SUPERADMIN, USER_ROLES_LOOKUP, USER_ROLE_DESC} from "../../constants/accountConstants";
import {US_STATES} from "../../constants/commonConstants";
import {
  HStack,
  Button,
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Card,
  CardHeader,
  CardBody,
  StackDivider,
  useToast,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react'
import {PageNotAuthorized} from '../../components/common/pageNotAuthorized'
import {PageMainHeader} from '../../components/common/pageMainHeader'
import ManageVendors from "../user/vendor/manageVendors";
import { useDispatch, useSelector } from "react-redux";
import {fetchVendorsByAccount, resetVendorsByAccount} from '../../store/modules/Vendor/actions'
import { resetUserProjects, resetUserVendors, setUserProjects } from "../../store/modules/User/actions";
import { DocumentConstants, NotesConstants } from "../../constants";
import ManageUserRoles from "../user/manageUserRoles";
import { setDocumentType } from "../../store/modules/Document/actions";
import UserDetailActions from "../user/detail/userDetailActions";




const UserAddEdit = (props) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const userId = props.data.userId;
  const router = useRouter();
  const firstName = useRef("");
  const lastName = useRef("");
  const userStatus = useRef("");
  const userEmail = useRef("");
  const userPassword = useRef("");
  const userType = useRef("");
  const timeSheetEnabled = useRef("");
  const userPhone = useRef("");
  const userAccountId = useRef("");
  const userVendorId = useRef("");
  const addressName = useRef("");
  const address1 = useRef("");
  const address2 = useRef("");
  const address3 = useRef("");
  const city = useRef("");
  const country = useRef("");
  const state = useRef("");
  const zipCode = useRef("");
  const addressId = useRef("");
  const cost = useRef("");
  

  const [accountPhone, setAccountPhone] = useState("");
  const [user, setUser] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);
  const [isVendor, setVendor] = useState(true);
  const [accountsList, setAccountsList] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [vendorList, setVendorList] = useState([]);

  const vendorListNew = useSelector(state => state.vendor.vendorsByAccount);

  //User Validation START
  const formOptions = { resolver: yupResolver(USER_VALIDATION_SCHEMA) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setValue, formState } = useForm(formOptions);
  const { errors } = formState;

  const handlePhoneInput = (e) => {
    // this is where we'll call the phoneNumberFormatter function
    const formattedPhoneNumber = util.formatPhoneNumber(e.target.value);
    // we'll set the input value using our setInputValue
    setValue(accountPhone, formattedPhoneNumber);
    // setAccountPhone(formattedPhoneNumber);
  };
  //Account Validation END


  //To Enable Notes
  const notesData = {
    type: NotesConstants.NOTES_TYPE.User,
    typeId: parseInt(userId),
    typeName: user.firstName
  }
  
  const documentData = {
    type: DocumentConstants.DOCUMENMT_TYPE.User,
    typeId: parseInt(userId),
    typeName: user.firstName
  }
  

  //Get Account Details only if its EditMode
  useEffect(() => {
    //Reset Everything here
    dispatch(resetUserVendors());
    dispatch(resetVendorsByAccount);
    dispatch(resetUserProjects);
    dispatch(setDocumentType(documentData))

    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }

    if(userService.isSuperAdmin() || userService.isAccountAdmin()) {
      setPageAuthorized(true);
    }

    if(userService.isSuperAdmin()) {
      setPageSectionAuthorized(true);
      getAccountsList();
    }
    if(userService.isAccountAdmin()) {
      //This gets called only when account user is logged and create
      getVendorList(userService.getAccountDetails().accountId);
    }
    
    getUserDetailsAPICall();
  }, []);

  async function getVendorList(accountId) {
    console.log("Inside getVendorList ::"+accountId)
    dispatch(fetchVendorsByAccount(accountId))
    setValue("userAccountId",userService.getAccountDetails().accountId);

  }  

  function handleUserRoles(userRole) {
    console.log("HANDLE USER ROLE...."+userRole.target.value+"***userRole.target.checked::"+userRole.target.checked)
    const newUserRoles = [...userRoles]
    if(userRole.target.checked) {
      if(!newUserRoles.includes(userRole.target.value)) {
        newUserRoles.push(userRole.target.value);
      }
    }else {
      const roleToRemoveIndex = newUserRoles.findIndex(x => x === userRole.target.value);
      newUserRoles.splice(roleToRemoveIndex, 1);
    }
    setUserRoles(newUserRoles)
    console.log("newUserRoles:::"+JSON.stringify(newUserRoles))
  }
  
  /**
   * Function to get the list of accounts for a drop down
   */
  async function getAccountsList() {
      // setPageAuthorized(true);
      setVendor(false);
      const accountListResponse = await userService.getAccountsList();
      setAccountsList(accountListResponse);

  }


  async function getUserDetailsAPICall() {

    // Call only if the user is SUPER_ADMIN and accountId as zero
    if((userService.isSuperAdmin() || userService.isAccountAdmin()) && (props && props.data && props.data.mode != MODE_ADD)) {
      const userResonse = await accountService.userDetails(props.data.userId);
      console.log("userResonse:::userResonse::"+JSON.stringify(userResonse))
        const userData =  {
            id: userResonse.id.toString(),
            firstName: userResonse.firstName,
            lastName: userResonse.lastName,
            userType: userResonse.type,
            userEmail: userResonse.email,
            userPhone: userResonse.phone,
            userRoles: userResonse.userRile,
            userAccountId: userResonse.accountId,
            userVendorId: userResonse.vendorId,
            timeSheetEnabled: userResonse.isTimeSheetEnabled,
            userStatus: userResonse.status,
            cost: userResonse.cost,
            addressId: userResonse.address[0].id,
            addressName: userResonse.address[0].addressName,
            address1: userResonse.address[0].address1,
            address2: userResonse.address[0].address2,
            address3: userResonse.address[0].address3,
            city: userResonse.address[0].city,
            state: userResonse.address[0].state,
            zipCode: userResonse.address[0].zipCode,
            country: userResonse.address[0].country
        };
        setUser(userData);
        console.log("userResonse.userRole::"+JSON.stringify(userResonse.userRole))
        setUserRoles(userResonse.userRole)
        dispatch(setUserProjects(userResonse.projectResource))

        // get user and set form fields
            const fields = ['firstName', "lastName","userType", "userEmail","userPhone","userAccountId", "userVendorId","timeSheetEnabled","userStatus","addressName","address1", "address2", "address3","city","state","zipCode", "userRole","cost"];
            fields.forEach(field => setValue(field, userData[field]));
    }

  }

  function onSubmit(data) {
    console.log("DDAAA::"+JSON.stringify(data))
    return isAddMode
        ? createUser(data)
        : updateUser(userId, data);
  }

  // Create Account 
  const createUser = async (formData) => {
    try {
      const responseData = await userService.createUser(formData, userRoles)
        if(responseData.error) {
          toast({
            title: 'Create User Error.',
            description: 'Not able to create user, plrease try again or contact administrator. Detail:'+responseData.errorMessage,
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })
        }else {
          router.push("/account/users");
          toast({
            title: 'Add New User.',
            description: 'Successfully added new user.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })
        }
        
        
      
    } catch (error) {
      toast({
        title: 'Create User Error.',
        description: 'Not able to create user, plrease try again or contact administrator.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }
  };



  // update invoice in database
  const updateUser = async (userId, formData) => {
    try {
      console.log("Update User:::"+JSON.stringify(userRoles)+"******user.addressId::"+user.addressId)
      const responseData = userService.updateUser(userId, formData,user.addressId, userRoles)

      if(responseData.error) {
        toast({
          title: 'Update User Error.',
          description: 'Not able to create user, plrease try again or contact administrator.Detail:'+responseData.errorMessage,
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })
      }else {
        router.push("/account/users");
        toast({
          title: 'Update User.',
          description: 'Successfully updated user.',
          status: 'success',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })
      }
      
      
    } catch (error) {
      console.log(error)
      toast({
        title: 'Update User Error.',
        description: 'Not able to create user, plrease try again or contact administrator.',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })
    }
  };


  return (

    <div>
      {isPageAuthprized ? (
        <div> 
          
          {isAddMode ? (
            <div>{isVendor?( <PageMainHeader heading="New Vendor User"/>):( <PageMainHeader heading="New Account User"/>)}</div>
          ) : (
            <div>{isVendor? (<PageMainHeader heading="Update Vendor User" notesData={notesData}/>): (<PageMainHeader heading="Update Account User" notesData={notesData}/>)}</div>
          )}              

          {(userService.isAccountAdmin() || userService.isSuperAdmin) ? (
            <>
              {!isAddMode? (
                <>
                <HStack>
                  <ManageVendors data={{userId: userId, userFirstName: user.firstName, userLastName: user.lastName}}/>
                  <UserDetailActions/>
                  {/* <AllocateProject data={{userId: userId, userFirstName: user.firstName, userLastName: user.lastName}}/> */}
                </HStack>
                </>
              ): (<></>)}
            </>
          ) : ("")}
          <Box width="page.sub_heading_width">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Card>
                <CardHeader>
                  <Heading size='xs'>User Details</Heading>
                </CardHeader>

                <CardBody>
                    <Stack spacing={4}>
                      <HStack spacing="10rem">
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>First Name</FormLabel>
                          <Input type="text" {...register('firstName')}  id="firstName"  />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>Last Name</FormLabel>
                            <Input type="text" id="lastName" {...register('lastName')}  />
                        </FormControl>    
                      </Box>  
                      </HStack>
                      <HStack spacing="10rem">
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Emaail/UserId</FormLabel>
                            <Input type="text" id="userEmail"   {...register('userEmail')}/>
                          </FormControl>     
                        </Box>    
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>User Passowrd</FormLabel>
                            <Input type="password" id="userPassword"   {...register('userPassword')}/>
                          </FormControl>     
                        </Box>  
                      </HStack> 
                      <HStack spacing="10rem">
                        <Box>
                          <FormControl isRequired>
                              <FormLabel>User Phone</FormLabel>
                              <Input type="tel" id="userPhone"   {...register('userPhone')} />
                            </FormControl>      
                        </Box>   
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Type</FormLabel>
                            <Select width="100%" id="userType" {...register('userType')} >
                              <option value="Employee">Employee</option>
                              <option value="Contractor">Contractor</option>
                              <option value="LeadContact">Lead Contact</option>
                            </Select>
                          </FormControl>     
                        </Box>                                                  
                      </HStack>
                      <HStack spacing="13.5rem">
                      <Box>
                          <FormControl isRequired>
                            <FormLabel>Enable Timesheet</FormLabel>
                            <Select width="100%" id="timeSheetEnabled" {...register('timeSheetEnabled')} >
                              <option value="false">No</option>
                              <option value="true">Yes</option>
                            </Select>
                          </FormControl>     
                        </Box>   
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>User Status</FormLabel>
                            <Select width="100%" id="userStatus" {...register('userStatus')} >
                            <option value="">Select Status</option>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Error">Error</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </Select>
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>
                              <FormLabel>Cost</FormLabel>
                              <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    color='dollor_input'
                                    fontSize='dollar_left_element'
                                    children='$'
                                />    
                                <Input type="number" id="cost"   {...register('cost')} />
                              </InputGroup>
                              
                            </FormControl>      
                        </Box>                           
                      </HStack>     
                  </Stack>
                </CardBody>
              </Card>   
              <Card>
                <CardHeader>
                  <Heading size='xs'>Roles</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack>
                      <Box>
                        {userRoles.map((role) => <p>{USER_ROLE_DESC[role]}</p>)}
                      </Box>
                      <ManageUserRoles selectedUserRoles={userRoles} onChange={handleUserRoles}/>
                    </HStack>                                            
                  </Stack>
                </CardBody>
              </Card>
              {isPageSectionAuthorized ? (
                <Card>
                  <CardHeader>
                    <Heading size='xs'>User Account/Vendor Details</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                      <HStack>
                           <Box>
                              <FormControl isRequired>
                                <FormLabel>Account</FormLabel>
                                <Select width="100%" id="userAccountId" {...register('userAccountId')} >
                                    <option value="">Select an Account</option>
                                    {accountsList?.map((account) => (
                                      <option value={account.id}>{account.name}</option>
                                    ))}
                              </Select>
                              </FormControl>     
                            </Box>
                      </HStack>
                    </Stack>
                  </CardBody>
                </Card>
              ) : (<></>)}     
              <Card>
                <CardHeader>
                  <Heading size='xs'>User Addreses</Heading>
                </CardHeader>

                <CardBody>
                  <Stack maxWidth="page.single_input" spacing="1rem">
                    <FormControl isRequired>
                      <FormLabel>Address Name</FormLabel>
                      <Input type="text" id="addressName"   {...register('addressName')} />
                    </FormControl>                        
                    <FormControl isRequired>
                      <FormLabel>Address1</FormLabel>
                      <Input type="text" id="address1"   {...register('address1')} />
                    </FormControl>    
                    <HStack>
                      <FormControl>
                        <FormLabel>Address2</FormLabel>
                        <Input type="text" id="address2"   {...register('address2')} />
                      </FormControl>     
                      <FormControl>
                        <FormLabel>Address3</FormLabel>
                        <Input type="text" id="address3"   {...register('address3')} />
                      </FormControl>     
                    </HStack>                       
                    <HStack spacing="1rem">
                      <FormControl isRequired>
                        <FormLabel>City</FormLabel>
                        <Input type="text" id="city"   {...register('city')} />
                      </FormControl>     
                      <FormControl isRequired>
                        <FormLabel>State</FormLabel>
                        <Select id="state" {...register('state')} >
                          <option value="">State</option>
                          {US_STATES?.map((state) => (
                              <option value={state.id}>{state.name}</option>
                              ))}
                        </Select>
                      </FormControl>     
                    </HStack>
                    <HStack spacing="1rem">
                      <FormControl isRequired>
                        <FormLabel>ZipCode</FormLabel>
                        <Input type="text" id="zipCode"   {...register('zipCode')} />
                      </FormControl>     
                      <FormControl isRequired>
                        <FormLabel>Country</FormLabel>
                        <Select id="country" {...register('country')} >
                          <option value="USA">USA</option>
                        </Select>
                      </FormControl>     
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
              <Flex marginBottom={4}>
                <HStack>
                  <Box>
                  <Button size="xs" colorScheme="yellow" onClick={() => router.back()}>
                      Cancel
                    </Button>
                  </Box>
                  <Box>
                    <Button size="xs" bgColor="header_actions"  type="submit"  disabled={formState.isSubmitting}>
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                      {isAddMode ? (
                          <div>Add {isVendor? "Vendor": "Account"} User</div>
                      ) : (
                        <div>Update {isVendor? "Vendor": "Account"} User</div>
                      )}              
                    </Button>
                  </Box>
                </HStack>
              </Flex>                   
            </Stack>
          </form>          
        </Box>

      </div>
      ) : (
        <PageNotAuthorized/>   
      )}
    </div>

  );
};

export default UserAddEdit;
