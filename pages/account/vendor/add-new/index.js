import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userService } from '../../../../services';

const AddNew = (props) => {
  const router = useRouter();
  const acountDetails = userService.getAccountDetails;

  const name = useRef("");
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
  const vendorAddress1 = useRef("");
  const vendorAddress2 = useRef("");
  const vendorAddress3 = useRef("");
  const vendorCity = useRef("");
  const vendorState = useRef("");
  const vendorZipCode = useRef("");
  const vendorCountry = useRef("");  


  // submit data to the database
  const createVendor = async () => {
    try {
      if (
        name.current.value === "" ||
        description.current.value === "" ||
        email.current.value === "" ||
        type.current.value === "" ||
        phone.current.value === "" ||
        accountId.current.value === "" ||
        ein.current.value === "" ||
        status.current.value === "" ||
        accountContactName.current.value === "" ||
        accountContactEmail.current.value === "" ||
        accountContactPhone.current.value === "" ||
        vendorAddress1.current.value === "" ||
        vendorAddress2.current.value === "" ||
        vendorAddress3.current.value === "" ||
        vendorCity.current.value === "" ||
        vendorState.current.value === "" ||
        vendorZipCode.current.value === "" ||
        vendorCountry.current.value === ""  
        
      ) {
        toast.warning("All fields are required. Must provide valid data");
      } else {
        const res = await fetch("/api/account/vendor/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.current.value,
            description: description.current.value,
            email: email.current.value,
            type: type.current.value,
            phone: phone.current.value,
            accountId: userService.getAccountDetails().accountId,
            ein: ein.current.value,
            status: status.current.value,
            accountContactName: accountContactName.current.value,
            accountContactEmail: accountContactEmail.current.value,
            accountContactPhone: accountContactPhone.current.value,
            address: {
              create: [
                {
                  type: "V",
                  address1: vendorAddress1.current.value,
                  address2: vendorAddress2.current.value,
                  address3: vendorAddress3.current.value,
                  city: vendorCity.current.value,
                  state: vendorState.current.value,
                  zipCode: vendorZipCode.current.value,
                  country: vendorCountry.current.value,
                  accountId: userService.getAccountDetails().accountId,
                  status: "A"
                }
              ]
            }
          }),
        });
        const data = await res.json();

        toast.success(data.message);
        router.push("/account/"+userService.getAccountDetails().accountId+'/vendors');
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="main__container">
      <div className="new__account">
        <div className="new__account-header">
          <h3>New Vendor</h3>
        </div>

        {/* ======== new account body ========= */}
        <div className="new__account-body">
          {/* ======= bill from ========== */}
          <div className="bill__from">
            <p className="bill__title">Vendor Setup</p>
            <div className="form__group">
              <p>Name</p>
              <input type="text" ref={name} />
            </div>
            <div className="form__group">
              <p>Description</p>
              <input type="text" ref={description} />
            </div>           

            <div className="form__group">
              <p>Email</p>
              <input type="text" ref={email} />
            </div> 

            <div className="form__group">
              <p>Vendor Type</p>
              <input type="text" ref={type}  value="Staffing"/>
            </div> 

            <div className="form__group">
              <p>Phone</p>
              <input type="text" ref={phone} />
            </div> 


            <div className="form__group">
              <p>Vendor EIN</p>
              <input type="text" ref={ein} />
            </div> 

            <div className="form__group">
              <p>Vendor Status</p>
              <input type="text" ref={status} value="Active" />
            </div> 

            <div className="form__group">
              <p>Account Contact Name</p>
              <input type="text" ref={accountContactName} />
            </div> 

            <div className="form__group">
              <p>Account Contact Email</p>
              <input type="text" ref={accountContactEmail} />
            </div> 

            <div className="form__group">
              <p>Account Contact Phone</p>
              <input type="text" ref={accountContactPhone} />
            </div>                         

            <p className="bill__title">Vendor Address</p>
            <div className="form__group">
              <p>Address1</p>
              <input type="textarea" ref= {vendorAddress1} />
            </div>  

            <div className="form__group">
              <p>Address2</p>
              <input type="textarea" ref= {vendorAddress2} />
            </div>              

            <div className="form__group">
              <p>Address2</p>
              <input type="textarea" ref= {vendorAddress3} />
            </div> 

            <div className="form__group inline__form-group">
              <div>
                <p>City</p>
                <input type="text" ref= {vendorCity} />
              </div>
              <div>
                <p>State</p>
                <input type="text" ref= {vendorState} />
              </div>

              <div>
                <p>ZipCode</p>
                <input type="text" ref= {vendorZipCode} />
              </div>

              <div>
                <p>Country</p>
                <input type="text" ref= {vendorCountry} />
              </div>
            </div>
          </div>

          <div className="new__account__btns">
            <button className="edit__btn" onClick={() => router.push("/account/list")}>
              Discard
            </button>
            <div>
              <button
                className="mark__as-btn"
                onClick={() => createVendor("pending")}
              >
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNew;
