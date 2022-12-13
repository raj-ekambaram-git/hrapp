import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";


const AddNew = (props) => {
  const router = useRouter();

console.log("11111111"+JSON.stringify(props))

console.log("222222"+JSON.stringify(router))

  const firstName = useRef("");
  const lastName = useRef("");
  const role = useRef("");
  const email = useRef("");
  const phone = useRef("");
  const accountId = useRef("");
  const vendorId = useRef("");
  const isTimeSheetEnabled = useRef("");
  const password = useRef("");
  const userAddress1 = useRef("");
  const userAddress2 = useRef("");
  const userAddress3 = useRef("");
  const userCity = useRef("");
  const userState = useRef("");
  const userZipCode = useRef("");
  const userCountry = useRef("");  
  const rate = useRef("NA");  
  const startDate = useRef("NA");  
  const endDate = useRef("NA");  


  // submit data to the database
  const createUser = async () => {
    try {
      if (
        firstName.current.value === "" ||
        lastName.current.value === "" ||
        role.current.value === "" ||
        email.current.value === "" ||
        phone.current.value === "" ||
        accountId.current.value === "" ||
        vendorId.current.value === "" ||
        isTimeSheetEnabled.current.value === "" ||
        password.current.value === "" ||
        userAddress1.current.value === "" ||
        userAddress2.current.value === "" ||
        userAddress3.current.value === "" ||
        userCity.current.value === "" ||
        userState.current.value === "" ||
        userZipCode.current.value === "" ||
        userCountry.current.value === ""  ||
        rate.current.value === ""  ||
        startDate.current.value === ""  ||
        endDate.current.value === "" 
        
      ) {
        toast.warning("All fields are required. Must provide valid data");
      } else {
        const res = await fetch("/api/account/user/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            role: role.current.value,
            email: email.current.value,
            phone: phone.current.value,
            accountId: 1,
            vendorId: 2,
            isTimeSheetEnabled: true,
            password: password.current.value,
            address: {
              create: [
                {
                  type: "U",
                  address1: userAddress1.current.value,
                  address2: userAddress2.current.value,
                  address3: userAddress3.current.value,
                  city: userCity.current.value,
                  state: userState.current.value,
                  zipCode: userZipCode.current.value,
                  country: userCountry.current.value,
                  accountId: 1,
                  status: "A"
                }
              ]
            },
            userAttributes: {
              create: [
                {
                  userAttributeKey: "rate",
                  userAttributeValue: rate.current.value
                },
                {
                  userAttributeKey: "startDate",
                  userAttributeValue: startDate.current.value
                },
                {
                  userAttributeKey: "endDate",
                  userAttributeValue: endDate.current.value
                }                                
              ]
            }
          }),
        });
        const data = await res.json();

        toast.success(data.message);
        router.push("/account/list");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="main__container">
      <div className="new__account">
        <div className="new__account-header">
          <h3>New User</h3>
        </div>

        {/* ======== new account body ========= */}
        <div className="new__account-body">
          {/* ======= bill from ========== */}
          <div className="bill__from">
            <p className="bill__title">Account Setup</p>
            <div className="form__group">
              <p>First Name</p>
              <input type="text" ref={firstName} />
            </div>
            <div className="form__group">
              <p>Last Name</p>
              <input type="text" ref={lastName} />
            </div>           

            <div className="form__group">
              <p>Email (userId)</p>
              <input type="text" ref={email} />
            </div> 

            <div className="form__group">
              <p>Password</p>
              <input type="password" ref={password} />
            </div> 

            <div className="form__group">
              <p>Role</p>
              <input type="text" ref={role}  value="ACCOUNT_ADMIN"/>
            </div> 

            <div className="form__group">
              <p>Phone</p>
              <input type="text" ref={phone} />
            </div> 

            <div className="form__group">
              <p>Account ID</p>
              <input type="text" ref={accountId} />
            </div> 

            <div className="form__group">
              <p>Vendor ID</p>
              <input type="text" ref={vendorId} />
            </div> 

            <div className="form__group">
              <p>TimeSheet Enabled</p>
              <input type="text" ref={isTimeSheetEnabled} />
            </div> 

            <p className="bill__title">User Address</p>
            <div className="form__group">
              <p>Address1</p>
              <input type="textarea" ref={userAddress1} />
            </div>  

            <div className="form__group">
              <p>Address2</p>
              <input type="textarea" ref={userAddress2} />
            </div>              

            <div className="form__group">
              <p>Address2</p>
              <input type="textarea" ref={userAddress3} />
            </div> 

            <div className="form__group inline__form-group">
              <div>
                <p>City</p>
                <input type="text" ref={userCity} />
              </div>
              <div>
                <p>State</p>
                <input type="text" ref={userState} />
              </div>

              <div>
                <p>ZipCode</p>
                <input type="text" ref={userZipCode} />
              </div>

              <div>
                <p>Country</p>
                <input type="text" ref={userCountry} />
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
                onClick={() => createUser("pending")}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNew;
