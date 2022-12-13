import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService } from "../../services";
import {MODE_ADD, ACCOUNT_VALIDATION_SCHEMA} from "../../constants/accountConstants";


const AccountAddEdit = (props) => {
  const accountId = props.data.accountId;
  const router = useRouter();
  const accountName = useRef("");
  const accountDescription = useRef("");
  const address1 = useRef("");
  const address2 = useRef("");
  const address3 = useRef("");
  const city = useRef("");
  const country = useRef("");
  const state = useRef("");
  const zipCode = useRef("");
  const accountEIN = useRef("");
  const accountEmail = useRef("");
  const [accountPhone, setAccountPhone] = useState("");
  const [account, setAccount] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);

  //Check if the mode is ADD or EDIT

  //Account Validation START
  const formOptions = { resolver: yupResolver(ACCOUNT_VALIDATION_SCHEMA) };

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

    if(userService.isSuperAdmin()) {
      setPageAuthorized(true);
    }
    async function getAccountDetailsAPICall() {

      // Call only if the user is SUPER_ADMIN and accountId as zero
      if(userService.isSuperAdmin() && (props && props.data && props.data.mode != MODE_ADD)) {
        setPageAuthorized(true);
        const accountResponse = await accountService.accountDetail(props.data.accountId);
          const accountData =  {
              id: accountResponse.id.toString(),
              accountName: accountResponse.name,
              accountDescription: accountResponse.description,
              accountEIN: accountResponse.ein,
              accountEmail: accountResponse.email,
              accountStatus: accountResponse.status,
              accountPhone: accountResponse.phone,
              addressId: accountResponse.address[0].id,
              address1: accountResponse.address[0].address1,
              address2: accountResponse.address[0].address2,
              address3: accountResponse.address[0].address3,
              city: accountResponse.address[0].city,
              state: accountResponse.address[0].state,
              zipCode: accountResponse.address[0].zipCode,
              country: accountResponse.address[0].country
          };
  
          setAccount(accountData);
  
          // get user and set form fields
              const fields = ['accountName', "accountDescription", "accountStatus", "accountEIN","accountEmail","accountPhone", "address1", "address2", "address3","city","state","zipCode","accountPhone"];
              fields.forEach(field => setValue(field, accountData[field]));
      }
  
    }

    getAccountDetailsAPICall();
  }, []);
  
  function onSubmit(data) {
    return isAddMode
        ? createAccount(data)
        : updateAccount(accountId, data);
}

  // Create Account 
  const createAccount = async (formData) => {
    try {
        const res = await fetch("/api/account/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.accountName,
            description: formData.accountDescription,
            address: {
              create: [
                {
                  type: "A",
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
            ein: formData.accountEIN,
            email: formData.accountEmail,
            status: formData.accountStatus,
            phone: formData.accountPhone
          }), 
        });
        const data = await res.json();

        toast.success(data.message);
        router.push("/account/list");
      
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };



  // update invoice in database
  const updateAccount = async (accountId, formData) => {
    try {
      const res = await fetch(`/api/account/${accountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(accountId),
          name: formData.accountName,
          description: formData.accountDescription,
          ein: formData.accountEIN,
          email: formData.accountEmail,
          status: formData.accountStatus,
          phone: formData.accountPhone,
          address: {
            update: {
              where: {
                id: account.addressId,
              },
              data:
              {
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
            
          }
        }),
      });

      const data = await res.json();

      router.push(`/account/${accountId}/detail`);
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
                              <h3>New Account</h3>
                          ) : (
                            <h3>Update Account</h3>
                          )}
                
              </div>
      
              {/* ======== new account body ========= */}
              <div className="new__account-body">
                {/* ======= bill from ========== */}
                <div className="bill__from">
                  <p className="bill__title">Account Setup</p>
      
                  
      
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form__group">
                    <p>Account Name</p>
                    <input name="accountName" type="text" {...register('accountName')} className={`form-control ${errors.accountName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.accountName?.message}</div>
                  </div>
      
                  <div className="form__group">
                    <p>Account Description</p>
                    <input name="accountDescription" type="text" {...register('accountDescription')} className={`form-control ${errors.accountDescription ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.accountDescription?.message}</div>
                  </div>      
      
                  <div>
                      <p>Account Status</p>
                      <div className="form__group">
                        <select name="accountStatus" {...register('accountStatus')} className={`form-control ${errors.accountStatus ? 'is-invalid' : ''}`}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <div className="invalid-feedback">{errors.accountStatus?.message}</div>    
                      </div>            
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
                        <div className="form__group__state">
                          <select name="state" {...register('state')} className={`form-control ${errors.state ? 'is-invalid' : ''}`}>
                              <option value="">State</option>
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Miss">Miss</option>
                              <option value="Ms">Ms</option>
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
                        <div className="form__group__state">
                          <select name="country" {...register('country')} className={`form-control ${errors.country ? 'is-invalid' : ''}`}>
                              <option value="USA">USA</option>
                          </select>
                          <div className="invalid-feedback">{errors.country?.message}</div>                  
                        </div>                    
                      </div>
                      </div>
      
                      <div className="form__group inline__form-group">
                        <div>
                          <p>Account Email</p>
                          <input name="accountEmail" type="email" {...register('accountEmail')} className={`form-control ${errors.accountEmail ? 'is-invalid' : ''}`} />
                          <div className="invalid-feedback">{errors.accountEmail?.message}</div>
                        </div>
      
                        <div>
                          <p>Account Phone</p>
                          <input name="accountPhone" type="phone" {...register('accountPhone')} onChange={(e) => handlePhoneInput(e)} className={`form-control ${errors.accountPhone ? 'is-invalid' : ''}`} />
                          <div className="invalid-feedback">{errors.accountPhone?.message}</div>
                        </div>   
                      </div>      
                    </div>   
      
                  {/* ========= bill to ========== */}
                  <div className="bill__to">
                    <p className="bill__title">Bill to</p>
                    <div className="form__group">
                      <p>EIN</p>
                      <input name="accountEIN" type="text" {...register('accountEIN')} className={`form-control ${errors.accountEIN ? 'is-invalid' : ''}`} />
                      <div className="invalid-feedback">{errors.accountEIN?.message}</div>
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
                              <>Add Account</>
                          ) : (
                              <>Update Account</>
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

export default AccountAddEdit;
