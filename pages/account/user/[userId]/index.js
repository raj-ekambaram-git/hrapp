import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import prisma from "../../../../lib/prisma";

const EditItem = (props) => {
  const user = props.data;
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accountId, setAccountId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [isTimeSheetEnabled, setTimeSheetEnabled] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [rate, setRate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  


  // update user in database
  const updateUser = async (userId, status) => {
    try {
      const res = await fetch(`/api/account/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(userId),
          firstName: firstName,
          lastName: lastName,
          role: role,
          email: email,
          status: status,
          phone: phone,
          accountId: accountId,
          vendorId: vendorId,
          isTimeSheetEnabled: false,
          address: {
            update: {
              where: {
                id: user.addressId,
              },
              data:
              {
                type: "U",
                address1: address1,
                address2: address2,
                address3: address3,
                city: city,
                state: state,
                zipCode: zipCode,
                country: country,
                status: "A"
              }
            }
            
          }
        }),
      });

      const data = await res.json();

      router.push(`/account/list`);
      toast.success(data.message);
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!");
    }
  };


  // set default input data
  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setRole(user.role);
    setEmail(user.email);
    setStatus(user.status);
    setPhone(user.phone);
    setAccountId(user.accountId);
    setVendorId(user.vendorId);
    setTimeSheetEnabled(user.isTimeSheetEnabled)
    setAddressId(user.addressId);
    setAddress1(user.address1);
    setAddress2(user.address2);

    setAddress3(user.address3);
    setCity(user.city);
    setState(user.state);
    setZipCode(user.zipCode);
    setCountry(user.country);
  }, [user]);

  return (
    <div className="main__container">
      <div className="new__invoice">
        <div className="new__invoice-header">
          <h3>Edit # {user.firstName} {user.lastName}</h3> 
        </div>

        {/* ======== new invoice body ========= */}
        <div className="new__invoice-body">
          {/* ======= bill from ========== */}
          <div className="bill__from">
            <p className="bill__title">Bill from</p>
            <div className="form__group">
              <p>First Name</p>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>


            <div className="form__group">
              <p>Last Name</p>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="form__group">
              <p>Role</p>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div className="form__group">
              <p>Email</p>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
                                    
            <div className="form__group">
              <p>Phone</p>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form__group">
              <p>Time Sheet Enabled</p>
              <input
                type="text"
                value={isTimeSheetEnabled}
                onChange={(e) => setTimeSheetEnabled(e.target.value)}
              />
            </div>            
            
            <div className="form__group">
              <p>Address1</p>
              <input
                type="text"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
            </div>

            <div className="form__group">
              <p>Address2</p>
              <input
                type="text"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>       

            <div className="form__group">
              <p>Address3</p>
              <input
                type="text"
                value={address3}
                onChange={(e) => setAddress3(e.target.value)}
              />
            </div>                 

            <div className="form__group inline__form-group">
              <div>
                <p>City</p>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <p>State</p>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div>
                <p>ZipCode</p>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
              <div>
                <p>Country</p>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>              
            </div>

          </div>

          <div className="new__invoice__btns" style={{ justifyContent: "end" }}>
            <div>
              <button
                className="mark__as-btn"
                onClick={() => updateUser(user.id, user.status)}
              >
                Save User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditItem;



export async function getStaticPaths() {

  return {
    paths: [{ params: { userId: "2" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { userId } = context.params;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(userId),
    },
    include: {
      address: true,
    }
  })


  return {
    props: {
      data: {
        id: user.id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email,
        phone: user.phone,
        accountStatus: user.status,
        addressId: user.address[0].id,
        address1: user.address[0].address1,
        address2: user.address[0].address2,
        address3: user.address[0].address3,
        city: user.address[0].city,
        state: user.address[0].state,
        zipCode: user.address[0].zipCode,
        country: user.address[0].country

      },
    },
    revalidate: 1,
  };
}
