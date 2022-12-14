import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService } from "../../services";
import {MODE_ADD, USER_VALIDATION_SCHEMA, USER_ROLES} from "../../constants/accountConstants";
import {US_STATES} from "../../constants/commonConstants";


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
            const fields = ['firstName', "lastName", "userRole", "userEmail","userPhone","userAccountId", "userVendorId","timeSheetEnabled","userStatus","address1", "address2", "address3","city","state","zipCode"];
            fields.forEach(field => setValue(field, userData[field]));
    }

  }

  function onSubmit(data) {
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
            role: formData.userRole,
            email: formData.userEmail,
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
                address1: formData.address1,
                address2: formData.address2,
                address3: formData.address3,
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
    <div className="main__container">
      {isPageAuthprized ? (
            <div className="new__account">
              <div className="new__account-header">
              {isAddMode ? (
                              <h3>New {isVendor? "Vendor": "Account"} User</h3>
                          ) : (
                            <h3>Update {isVendor? "Vendor": "Account"} User</h3>
                          )}
                
              </div>
      
              {/* ======== new account body ========= */}
              <div className="new__account-body">
                {/* ======= bill from ========== */}
                <div className="bill__from">
                  <p className="bill__title">User Setup</p>
      
                  
      
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form__group">
                    <p>First Name</p>
                    <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                  </div>
      
                  <div className="form__group">
                    <p>Last Name</p>
                    <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                  </div>      
      
                  <div>
                      <p>User Status</p>
                      <div className="form__group">
                        <select name="userStatus" {...register('userStatus')} className={`form-control ${errors.userStatus ? 'is-invalid' : ''}`}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <div className="invalid-feedback">{errors.userStatus?.message}</div>    
                      </div>            
                  </div>

                  <div className="form__group inline__form-group">
                        <div>
                          <p>User Email (User ID)</p>
                          <input name="userEmail" type="email" {...register('userEmail')} className={`form-control ${errors.userEmail ? 'is-invalid' : ''}`} />
                          <div className="invalid-feedback">{errors.userEmail?.message}</div>
                        </div>
                  </div>

                  <div className="form__group inline__form-group">
                        <div>
                          <p>Password</p>
                          <input name="userPassword" type="password" {...register('userPassword')} className={`form-control ${errors.userPassword ? 'is-invalid' : ''}`} />
                          <div className="invalid-feedback">{errors.userPassword?.message}</div>
                        </div>
                  </div>
                  <div className="form__group inline__form-group">
                        <div className="fform__group form__group__inline_2">
                          <p>Role</p>
                          <select name="userRole" {...register('userRole')} className={`form-control ${errors.userRole ? 'is-invalid' : ''}`}>
                            {USER_ROLES?.map((userRole) => (
                                  <option value={userRole.roleID}>{userRole.roleName}</option>
                            ))}
                           </select>
                          <div className="invalid-feedback">{errors.userRole?.message}</div>
                        </div>
                        <div className="fform__group form__group__inline_2">
                          <p>TimeSheet Enabled?</p>
                          <select name="timeSheetEnabled" {...register('timeSheetEnabled')} className={`form-control ${errors.timeSheetEnabled ? 'is-invalid' : ''}`}>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                           </select>
                          <div className="invalid-feedback">{errors.timeSheetEnabled?.message}</div>
                        </div>
                        <div>
                          <p>Phone</p>
                          <input name="userPhone" type="text" {...register('userPhone')} className={`form-control ${errors.userPhone ? 'is-invalid' : ''}`} />
                          <div className="invalid-feedback">{errors.userPhone?.message}</div>
                        </div>                        
                  </div>

                  <div className="form__group inline__form-group">
                    {isPageSectionAuthorized ? (
                        <div>
                        <p>Account</p>
                          <div className="fform__group form__group__inline_2">
                            <select name="userAccountId" {...register('userAccountId')} className={`form-control ${errors.userAccountId ? 'is-invalid' : ''}`}>
                                <option value="">Select an Account</option>
                                {accountsList?.map((account) => (
                                  <option value={account.id}>{account.name}</option>
                                  ))}
                            </select>
                            <div className="invalid-feedback">{errors.userAccountId?.message}</div>                         
                          </div>
                        </div>
                    ) : (<></>)}
                    {userService.isAccountAdmin() ? (
                        <div>
                        <p>Vendor</p>
                        <div className="fform__group form__group__inline_4">
                          <select name="userVendorId" {...register('userVendorId')} className={`form-control ${errors.userVendorId ? 'is-invalid' : ''}`}>
                                <option value="">Select a Vendor</option>
                                {vendorList?.map((vendor) => (
                                  <option value={vendor.id}>{vendor.name}</option>
                                  ))}
                            </select>                      
                          <div className="invalid-feedback">{errors.userVendorId?.message}</div>
                        </div>
                      </div>   
                    ) : (
                      <></>
                    )}
                     
                  </div>                  

                  <div>
                    <p className="bill__title">Account Address</p>
                    
                    <div className="form__group">
                      <p>Address1</p>
                      <input name="address1" type="text" {...register('address1')} className={`form-control ${errors.address1 ? 'is-invalid' : ''}`} />
                      <div className="invalid-feedback">{errors.address1?.message}</div>
                    </div>  
      
                    <div className="form__group">
                      <p>Address2</p>
                      <input name="address2" type="text" {...register('address2')} className={`form-control ${errors.address2 ? 'is-invalid' : ''}`} />
                      <div className="invalid-feedback">{errors.address2?.message}</div>
                    </div>              
      
                    <div className="form__group">
                      <p>Address2</p>
                      <input name="address3" type="text" {...register('address3')} className={`form-control ${errors.address3 ? 'is-invalid' : ''}`} />
                      <div className="invalid-feedback">{errors.address3?.message}</div>
                    </div> 

                    <div className="form__group inline__form-group">
                      <div>
                        <p>City</p>
                        <input name="city" type="text" {...register('city')} className={`form-control ${errors.city ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.city?.message}</div>
                      </div>
                      <div>
                        <p>State</p>
                        <div className="fform__group form__group__inline_4">
                          <select name="state" {...register('state')} className={`form-control ${errors.state ? 'is-invalid' : ''}`}>
                              <option value="">State</option>
                              {US_STATES?.map((state) => (
                                  <option value={state.id}>{state.name}</option>
                              ))}
                          </select>
                          <div className="invalid-feedback">{errors.state?.message}</div>                
                        </div>
                      </div>
                      <div>
                        <p>ZipCode</p>
                        <input name="zipCode" type="text" {...register('zipCode')} className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.zipCode?.message}</div>
                      </div>
                      <div>
                        <p>Country</p>
                        <div className="fform__group form__group__inline_4">
                          <select name="country" {...register('country')} className={`form-control ${errors.country ? 'is-invalid' : ''}`}>
                              <option value="USA">USA</option>
                          </select>
                          <div className="invalid-feedback">{errors.country?.message}</div>                  
                        </div>                    
                      </div>
                    </div>
                  </div>   
                  <div className="new__account__btns">
                    <button className="edit__btn" onClick={() => router.push("/account/list")}>
                      Discard
                    </button>
                    <div>
                      <button disabled={formState.isSubmitting} className="btn btn-primary">
                          {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                          {isAddMode ? (
                              <>Add User</>
                          ) : (
                              <>Update User</>
                          )}
                          
                      </button>
                    </div>
                  </div>
                </form>            
                </div>
              </div>
            </div>
      ) : (
        <div className="not__authorized-header">
          Not authorized to view this page. Please contact administrator.
        </div>
      )}
    </div>
  );
};

export default UserAddEdit;
