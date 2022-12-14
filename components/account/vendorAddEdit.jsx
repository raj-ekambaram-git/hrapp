import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService } from "../../services";
import {MODE_ADD, VENDOR_VALIDATION_SCHEMA, USER_ROLES} from "../../constants/accountConstants";
import {US_STATES} from "../../constants/commonConstants";


const VendorEdit = (props) => {
  
  const vendorId = props.data.vendorId;
  const router = useRouter();
  const description = useRef("");
  const email = useRef("");
  const type = useRef("");
  const phone = useRef("");
  const accountId = useRef("");
  const ein = useRef("");
  const status = useRef("");
  const accountContactName = useRef("");
  const accountContactEmail = useRef("");
  const accountContactPhone = useRef("");
  const address1 = useRef("");
  const address2 = useRef("");
  const address3 = useRef("");
  const city = useRef("");
  const country = useRef("");
  const state = useRef("");
  const zipCode = useRef("");
  const addressId = useRef("");

  const [vendor, setVendor] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);
  
  //User Validation START
  const formOptions = { resolver: yupResolver(VENDOR_VALIDATION_SCHEMA) };

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
    console.log("&77777777777")
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }
    setValue("accountId",userService.getAccountDetails().accountId);

    if(userService.isAccountAdmin()) {
      setPageAuthorized(true);
    }

    getVendorDetailsAPICall();

  }, []);


  async function getVendorDetailsAPICall() {

    // Call only if the user is SUPER_ADMIN and accountId as zero
    if((userService.isAccountAdmin()) && (props && props.data && props.data.mode != MODE_ADD)) {
      console.log("iunside eddididiees")
      const vendorResponse = await accountService.getVendorDetail(props.data.vendorId, userService.getAccountDetails().accountId);
        const vendorData =  {
            id: vendorResponse.id.toString(),
            name: vendorResponse.name,
            description: vendorResponse.description,
            email: vendorResponse.email,
            type: vendorResponse.type,
            phone: vendorResponse.phone,
            accountId: vendorResponse.accountId,
            ein: vendorResponse.ein,
            status: vendorResponse.status,
            accountContactName: vendorResponse.accountContactName,
            accountContactEmail: vendorResponse.accountContactEmail,
            accountContactPhone: vendorResponse.accountContactPhone,
            addressId: vendorResponse.address[0].id,
            address1: vendorResponse.address[0].address1,
            address2: vendorResponse.address[0].address2,
            address3: vendorResponse.address[0].address3,
            city: vendorResponse.address[0].city,
            state: vendorResponse.address[0].state,
            zipCode: vendorResponse.address[0].zipCode,
            country: vendorResponse.address[0].country
        };

        setVendor(vendorData);

        // get user and set form fields
            const fields = ['name', "description", "email", "type","phone","accountId", "ein","status","accountContactName","accountContactEmail","accountContactPhone","address1", "address2", "address3","city","state","zipCode"];
            fields.forEach(field => setValue(field, vendorData[field]));
    }

  }

  function onSubmit(data) {
    return isAddMode
        ? createVendor(data)
        : updateVendor(vendorId, data);
  }

  // Create Account 
  const createVendor = async (formData) => {
    try {
        const res = await fetch("/api/account/vendor/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            address: {
              create: [
                {
                  type: "V",
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
  const updateVendor = async (vendorId, formData) => {
    try {
      const res = await fetch(`/api/account/vendor/${vendorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(vendorId),
          name: formData.name,
          description: formData.description,
          address: {
            update: {
              where: {
                id: vendor.addressId,
              },
              data:
              {
                type: "V",
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
          email: formData.email,
          type: formData.type,
          phone: formData.phone,
          accountId: parseInt(formData.accountId),
          ein: formData.ein,
          status: formData.status,
          accountContactName: formData.accountContactName,
          accountContactEmail: formData.accountContactEmail,
          accountContactPhone: formData.accountContactPhone

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
                              <h3>New Vendor</h3>
                          ) : (
                            <h3>Update Vendor</h3>
                          )}
                
              </div>
      
              {/* ======== new account body ========= */}
              <div className="new__account-body">
                {/* ======= bill from ========== */}
                <div className="bill__from">
                  <p className="bill__title">Vendor Setup</p>
      
                  
      
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form__group">
                    <p>Vendor Name</p>
                    <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                  </div>
      
                  <div className="form__group">
                    <p>Vendor Description</p>
                    <input name="description" type="text" {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.description?.message}</div>
                  </div>      
      
                  <div className="form__group inline__form-group">
                    <div>
                      <p>Vendor Status</p>
                      <div className="form__group">
                        <select name="status" {...register('status')} className={`form-control ${errors.status ? 'is-invalid' : ''}`}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Error">Error</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <div className="invalid-feedback">{errors.status?.message}</div>    
                      </div>  
                    </div>
                    <div>
                      <p>Vendor Type</p>
                      <div className="form__group">
                        <select name="type" {...register('type')} className={`form-control ${errors.type ? 'is-invalid' : ''}`}>
                            <option value="Staffing">Staffing</option>
                            <option value="Product">Product</option>
                            <option value="Project">Project</option>
                        </select>
                        <div className="invalid-feedback">{errors.type?.message}</div>    
                      </div>            
                     </div>          
                  </div>


                  <div className="form__group inline__form-group">
                        <div className="form__group">
                          <p>Vendor Email</p>
                          <input name="email" type="email" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                          <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form__group">
                          <p>Vendor Phone</p>
                          <input name="phone" type="text" {...register('phone')} className={`form-control ${errors.phone ? 'is-invalid' : ''}`} />
                          <div className="invalid-feedback">{errors.phone?.message}</div>
                        </div>                        
                  </div>

                  <div className="form__group inline__form-group">
                        <div>
                          <p>EIN</p>
                          <input name="ein" type="text" {...register('ein')} className={`form-control ${errors.ein ? 'is-invalid' : ''}`} />
                          <div className="invalid-feedback">{errors.ein?.message}</div>
                        </div>                        
                  </div>

                  <div className="form__group inline__form-group">

                    <div className="form__group">
                      <p>Account Contact Name</p>
                      <input name="accountContactName" type="text" {...register('accountContactName')} className={`form-control ${errors.accountContactName ? 'is-invalid' : ''}`} />
                      <div className="invalid-feedback">{errors.accountContactName?.message}</div>
                    </div>  

                    <div className="form__group">
                      <p>Account Contact Email</p>
                      <input name="accountContactEmail" type="email" {...register('accountContactEmail')} className={`form-control ${errors.accountContactEmail ? 'is-invalid' : ''}`} />
                      <div className="invalid-feedback">{errors.accountContactEmail?.message}</div>
                    </div>  

                    <div className="form__group">
                      <p>Account Contact Phone</p>
                      <input name="accountContactPhone" type="text" {...register('accountContactPhone')} className={`form-control ${errors.accountContactPhone ? 'is-invalid' : ''}`} />
                      <div className="invalid-feedback">{errors.accountContactPhone?.message}</div>
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
                              <>Add Vendor</>
                          ) : (
                              <>Update Vendor</>
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

export default VendorEdit;
