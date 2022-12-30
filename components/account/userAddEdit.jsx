import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService } from "../../services";
import {MODE_ADD, USER_VALIDATION_SCHEMA, USER_ROLES, USER_ROLES_SUPERADMIN} from "../../constants/accountConstants";
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
  StackDivider
} from '@chakra-ui/react'

const UserAddEdit = (props) => {
  
  const userId = props.data.userId;
  const router = useRouter();
  const firstName = useRef("");
  const lastName = useRef("");
  const userStatus = useRef("");
  const userEmail = useRef("");
  const userPassword = useRef("");
  const userRole = useRef("");
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

  const [accountPhone, setAccountPhone] = useState("");
  const [user, setUser] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);
  const [isVendor, setVendor] = useState(true);
  const [accountsList, setAccountsList] = useState([]);
  const [vendorList, setVendorList] = useState([]);

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


  //Get Account Details only if its EditMode
  useEffect(() => {
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
    // setPageAuthorized(true);
    const vendorListResponse = await accountService.getVendorList(accountId);
    setVendorList(vendorListResponse);
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
        const userData =  {
            id: userResonse.id.toString(),
            firstName: userResonse.firstName,
            lastName: userResonse.lastName,
            userRole: userResonse.role,
            userEmail: userResonse.email,
            userPhone: userResonse.phone,
            userAccountId: userResonse.accountId,
            userVendorId: userResonse.vendorId,
            timeSheetEnabled: userResonse.isTimeSheetEnabled,
            userStatus: userResonse.status,
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

        // get user and set form fields
            const fields = ['firstName', "lastName", "userRole", "userEmail","userPhone","userAccountId", "userVendorId","timeSheetEnabled","userStatus","addressName","address1", "address2", "address3","city","state","zipCode"];
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
            role: formData.userRole,
            email: formData.userEmail,
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

        toast.success(data.message);
        router.push("/account/"+userService.getAccountDetails().accountId+"/users");
        
      
    } catch (error) {
      toast.error("Something went wrong!");
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
          role: formData.userRole,
          email: formData.userEmail,
          password: formData.userPassword,
          phone: formData.userPhone,
          accountId: parseInt(formData.userAccountId),
          vendorId: parseInt(formData.userVendorId),
          status: formData.userStatus

        }),
      });

      const data = await res.json();
      
      router.push("/account/"+userService.getAccountDetails().accountId+"/users");
      toast.success(data.message);
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!");
    }
  };


  return (

    <div>
      {isPageAuthprized ? (
        <div> 
          <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg="heading"
            color="white"
            marginBottom="2rem"
            width="60%"
          >
            <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
              {isAddMode ? (
                  <div>New {isVendor? "Vendor": "Account"} User</div>
              ) : (
                <div>Update {isVendor? "Vendor": "Account"} User</div>
              )}              
            </Heading>
          </Flex>
          <Box width="60%">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>User Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>First Name</FormLabel>
                          <Input type="text" {...register('firstName')}  id="firstName"  size="md" />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>Last Name</FormLabel>
                            <Input type="text" id="lastName" {...register('lastName')}  size="md" />
                        </FormControl>    
                      </Box>  
                      <HStack spacing={8}>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>User Status</FormLabel>
                            <Select width="100%" id="userStatus" {...register('userStatus')} >
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
                            <FormLabel>User Role</FormLabel>
                            <Select width="100%" id="userRole" {...register('userRole')} >
                              {userService.isSuperAdmin() ? (
                                <>
                                  {USER_ROLES_SUPERADMIN?.map((userRole) => (
                                        <option value={userRole.roleID}>{userRole.roleName}</option>
                                  ))}                                
                                </>
                              ) : (
                                <>
                                  {USER_ROLES?.map((userRole) => (
                                        <option value={userRole.roleID}>{userRole.roleName}</option>
                                  ))}                                
                                </>
                              )}

                            </Select>
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Enable Timesheet</FormLabel>
                            <Select width="50%" id="timeSheetEnabled" {...register('timeSheetEnabled')} >
                              <option value="false">No</option>
                              <option value="true">Yes</option>
                            </Select>
                          </FormControl>     
                        </Box>                          
                      </HStack>                          
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Emaail/UserId</FormLabel>
                          <Input type="text" id="userEmail"  size="md" {...register('userEmail')}  />
                        </FormControl>     
                      </Box>    
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>User Passowrd</FormLabel>
                          <Input type="password" id="userPassword"  size="md" {...register('userPassword')}  />
                        </FormControl>     
                      </Box>  
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>User Phone</FormLabel>
                            <Input type="tel" id="userPhone"  size="md" {...register('userPhone')}  />
                          </FormControl>      
                      </Box>                                                                    
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>User Account/Vendor Details</Heading>
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
                          <Box>
                            <FormControl isRequired>
                              <FormLabel>Vendor</FormLabel>
                              <Select width="100%" id="userVendorId" {...register('userVendorId')} >
                                  <option value="">Select an Vendor</option>
                                  {vendorList?.map((vendor) => (
                                    <option value={vendor.id}>{vendor.name}</option>
                                  ))}
                            </Select>
                            </FormControl>     
                          </Box>
                        </>
                      ) : ("")}
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>User Addreses</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <Box>
                    <FormControl isRequired>
                        <FormLabel>Addrews Name</FormLabel>
                        <Input type="text" id="addressName"  size="md" {...register('addressName')} />
                      </FormControl>                        
                      <FormControl isRequired>
                        <FormLabel>Address1</FormLabel>
                        <Input type="text" id="address1"  size="md" {...register('address1')} />
                      </FormControl>     
                      <FormControl>
                        <FormLabel>Address2</FormLabel>
                        <Input type="text" id="address2"  size="md" {...register('address2')} />
                      </FormControl>     
                      <FormControl>
                        <FormLabel>Address3</FormLabel>
                        <Input type="text" id="address3"  size="md" {...register('address3')} />
                      </FormControl>     
                    </Box>
                    <HStack>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>City</FormLabel>
                          <Input type="text" id="city"  size="md" {...register('city')} />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>State</FormLabel>
                          <Select id="state" {...register('state')} >
                            <option value="">State</option>
                            {US_STATES?.map((state) => (
                                <option value={state.id}>{state.name}</option>
                                ))}
                          </Select>

                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>ZipCode</FormLabel>
                          <Input type="text" id="zipCode"  size="md" {...register('zipCode')} />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Country</FormLabel>
                          <Select id="country" {...register('country')} >
                            <option value="USA">USA</option>
                          </Select>
                        </FormControl>     
                      </Box>                                                                        
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
                    <Button type="submit">
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
        <> 
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          padding="1.5rem"
          bg="teal.500"
          color="white"
          marginBottom="2rem"
          width="100%"
        >
          <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
            Not authorized to view this page. Please contact administrator.
          </Heading>
        </Flex>        
      </>
      )}
    </div>

  );
};

export default UserAddEdit;
