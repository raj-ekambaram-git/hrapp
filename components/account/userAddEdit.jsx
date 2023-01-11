import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService } from "../../services";
import {MODE_ADD, USER_VALIDATION_SCHEMA, USER_ROLES_SUPERADMIN, USER_ROLES_LOOKUP} from "../../constants/accountConstants";
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
  useToast
} from '@chakra-ui/react'
import {PageNotAuthorized} from '../../components/common/pageNotAuthorized'
import {PageMainHeader} from '../../components/common/pageMainHeader'
import ManageVendors from "../user/vendor/manageVendors";
import { useDispatch, useSelector } from "react-redux";
import {fetchVendorsByAccount, resetVendorsByAccount} from '../../store/modules/Vendor/actions'
import { resetUserProjects, resetUserVendors, setUserProjects } from "../../store/modules/User/actions";
import { NotesConstants } from "../../constants";
import AllocateProject from "../user/project/allocateProject";




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
  const userRole = useRef("");
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
  const userRolesId = useRef("");
  

  const [accountPhone, setAccountPhone] = useState("");
  const [user, setUser] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);
  const [isVendor, setVendor] = useState(true);
  const [accountsList, setAccountsList] = useState([]);
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
  
  //Get Account Details only if its EditMode
  useEffect(() => {
    //Reset Everything here
    dispatch(resetUserVendors());
    dispatch(resetVendorsByAccount);
    dispatch(resetUserProjects);

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
            userRole: userResonse.role,
            userEmail: userResonse.email,
            userPhone: userResonse.phone,
            userAccountId: userResonse.accountId,
            userVendorId: userResonse.vendorId,
            timeSheetEnabled: userResonse.isTimeSheetEnabled,
            userStatus: userResonse.status,
            userRolesId: userResonse.userRoles[0]?.id,
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
        dispatch(setUserProjects(userResonse.projectResource))

        // get user and set form fields
            const fields = ['firstName', "lastName","userType", "userRole", "userEmail","userPhone","userAccountId", "userVendorId","timeSheetEnabled","userStatus","addressName","address1", "address2", "address3","city","state","zipCode","userRolesId"];
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
        const res = await fetch("/api/account/user/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            type: formData.userType,
            address: {
              create: [
                {
                  type: "U",
                  addressName: formData.addressName,
                  address1: formData.address1,
                  address2: formData.address2,
                  address3: formData.address3,
                  accountId: parseInt(formData.userAccountId),
                  vendorId: parseInt(formData.userVendorId),
                  city: formData.city,
                  state: formData.state,
                  zipCode: formData.zipCode,
                  country: formData.country,
                  status: "A"
                }
              ]
            },
            userRoles: {
              create: [
                {
                  role: formData.userRole
                }
              ]
            },
            role: formData.userRole,
            email: formData.userEmail.toLowerCase(),
            password: formData.userPassword,
            phone: formData.userPhone,
            accountId: parseInt(formData.userAccountId),
            vendorId: parseInt(formData.userVendorId),
            isTimeSheetEnabled: false,
            status: formData.userStatus,
            password: "defaultPassword"

          }), 
        });
        const data = await res.json();
        router.push("/account/users");
        toast({
          title: 'Add New User.',
          description: 'Successfully added new user.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
        
        
      
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
      console.log("Update User:::")
      const res = await fetch(`/api/account/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(userId),
          firstName: formData.firstName,
          lastName: formData.lastName,
          type: formData.userType,
          address: {
            update: {
              where: {
                id: user.addressId,
              },
              data:
              {
                type: "U",
                addressName: formData.addressName,
                address1: formData.address1,
                address2: formData.address2,
                address3: formData.address3,
                accountId: parseInt(formData.userAccountId),
                vendorId: parseInt(formData.userVendorId),
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
                status: "A"
              }
            }
          },
          userRoles: {
            update: {
              where: {
                id: user.userRolesId,
              },
              data:
              {
                role: formData.userRole
              }
            }
          },
          role: formData.userRole,
          email: formData.userEmail.toLowerCase(),
          password: formData.userPassword,
          phone: formData.userPhone,
          accountId: parseInt(formData.userAccountId),
          vendorId: parseInt(formData.userVendorId),
          status: formData.userStatus

        }),
      });

      const data = await res.json();
      router.push("/account/users");
      toast({
        title: 'Update User.',
        description: 'Successfully updated user.',
        status: 'success',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })
      
      
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
                          <Input type="text" {...register('firstName')}  id="firstName"  size="md"/>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>Last Name</FormLabel>
                            <Input type="text" id="lastName" {...register('lastName')}  size="md"/>
                        </FormControl>    
                      </Box>  
                      </HStack>
                      <HStack spacing="10rem">
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Emaail/UserId</FormLabel>
                            <Input type="text" id="userEmail"  size="md" {...register('userEmail')}/>
                          </FormControl>     
                        </Box>    
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>User Passowrd</FormLabel>
                            <Input type="password" id="userPassword"  size="md" {...register('userPassword')}/>
                          </FormControl>     
                        </Box>  
                      </HStack> 
                      <HStack spacing="10rem">
                        <Box>
                          <FormControl isRequired>
                              <FormLabel>User Phone</FormLabel>
                              <Input type="tel" id="userPhone"  size="md" {...register('userPhone')} />
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
                    <HStack spacing="16rem">
                      <Box>
                          <FormControl isRequired>
                            <FormLabel>User Role ::</FormLabel>
                            <Select width="100%" id="userRole" {...register('userRole')} >
                              {userService.isSuperAdmin() ? (
                                <>
                                  {USER_ROLES_SUPERADMIN?.map((userRole) => (
                                        <option value={userRole.roleID}>{userRole.roleName}</option>
                                  ))}                                
                                </>
                              ) : (
                                <>
                                  {USER_ROLES_LOOKUP?.map((userRole) => (
                                        <option value={userRole.roleID}>{userRole.roleName}</option>
                                  ))}                                
                                </>
                              )}

                            </Select>
                          </FormControl>     
                      </Box>  
                    </HStack>                                            
                  </Stack>
                </CardBody>
              </Card>
     
              <Card>
                <CardHeader>
                  <Heading size='xs'>User Account/Vendor Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack>
                      {isPageSectionAuthorized ? (
                        <>                      
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
                        </>
                      ) : (<></>)}     
                      {userService.isAccountAdmin() ? (
                        <>
                          {!isAddMode? (
                            <>
                              <ManageVendors data={{userId: userId, userFirstName: user.firstName, userLastName: user.lastName}}/>
                              {/* <AllocateProject data={{userId: userId, userFirstName: user.firstName, userLastName: user.lastName}}/> */}
                            </>
                          ): (<></>)}
                        </>
                      ) : ("")}
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <Heading size='xs'>User Addreses</Heading>
                </CardHeader>

                <CardBody>
                  <Stack maxWidth="page.single_input" spacing="1rem">
                    <FormControl isRequired>
                      <FormLabel>Address Name</FormLabel>
                      <Input type="text" id="addressName"  size="md" {...register('addressName')} />
                    </FormControl>                        
                    <FormControl isRequired>
                      <FormLabel>Address1</FormLabel>
                      <Input type="text" id="address1"  size="md" {...register('address1')} />
                    </FormControl>    
                    <HStack>
                      <FormControl>
                        <FormLabel>Address2</FormLabel>
                        <Input type="text" id="address2"  size="md" {...register('address2')} />
                      </FormControl>     
                      <FormControl>
                        <FormLabel>Address3</FormLabel>
                        <Input type="text" id="address3"  size="md" {...register('address3')} />
                      </FormControl>     
                    </HStack>                       
                    <HStack spacing="1rem">
                      <FormControl isRequired>
                        <FormLabel>City</FormLabel>
                        <Input type="text" id="city"  size="md" {...register('city')} />
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
                        <Input type="text" id="zipCode"  size="md" {...register('zipCode')} />
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
                  <Button className="btn" onClick={() => router.push("/accounts")}>
                      Discard
                    </Button>
                  </Box>
                  <Box>
                    <Button type="submit"  disabled={formState.isSubmitting}>
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                      {isAddMode ? (
                          <div>Add New {isVendor? "Vendor": "Account"} User</div>
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
