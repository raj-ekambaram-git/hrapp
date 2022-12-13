import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import prisma from "../../../../lib/prisma";

const EditItem = (props) => {
  const vendor = props.data;
  const router = useRouter();

  
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [ein, setEIN] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [accountId, setAccountId] = useState("");
    const [accountContactName, setAccoutContactName] = useState("");
    const [accountContactEmail, setAccoutContactEmail] = useState("");
    const [accountContactPhone, setAccoutContactPhone] = useState("");
    
    const [addressId, setAddressId] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [address3, setAddress3] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");
    
  


  // update invoice in database
  const updateVendor = async (vendorId, status) => {
    try {
      const res = await fetch(`/api/account/vendor/${vendorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(vendorId),
          name: name,
          description: description,
          email: email,
          ein: ein,
          phone: phone,
          type: type,
          status: status,
          accountContactName: accountContactName,
          accountContactEmail: accountContactEmail,
          accountContactPhone: accountContactPhone,
          accountId: 2,
          address: {
            update: {
              where: {
                id: vendor.addressId,
              },
              data:
              {
                type: "V",
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
    setName(vendor.name);
    setDescription(vendor.description);
    setEIN(vendor.ein);
    setEmail(vendor.email);
    setPhone(vendor.phone);
    setType(vendor.type);
    setStatus(vendor.status);
    setAccountId(vendor.setAccountId);
    setAccoutContactName(vendor.accountContactName);
    setAccoutContactEmail(vendor.accountContactEmail);
    setAccoutContactPhone(vendor.accountContactPhone);
    setAddressId(vendor.addressId);
    setAddress1(vendor.address1);
    setAddress2(vendor.address2);
    setAddress3(vendor.address3);
    setCity(vendor.city);
    setState(vendor.state);
    setZipCode(vendor.zipCode);
    setCountry(vendor.country);
  }, [vendor]);

  return (
    <div className="main__container">
      <div className="new__invoice">
        <div className="new__invoice-header">
          <h3>Edit #{vendor.name}</h3> 
        </div>

        {/* ======== new invoice body ========= */}
        <div className="new__invoice-body">
          {/* ======= bill from ========== */}
          <div className="bill__from">
            <p className="bill__title">Bill from</p>
            <div className="form__group">
              <p>Vendor Name</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>


            <div className="form__group">
              <p>Vendor Description</p>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form__group">
              <p>Vendor EIN</p>
              <input
                type="text"
                value={ein}
                onChange={(e) => setEIN(e.target.value)}
              />
            </div>

            <div className="form__group">
              <p>Vendor Email</p>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form__group">
              <p>Vendor Phone</p>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form__group">
              <p>Vendor Status</p>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>            

            <div className="form__group">
              <p>Vendor Account ID</p>
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              />
            </div>    

            <div className="form__group">
              <p>Account Contact Name</p>
              <input
                type="text"
                value={accountContactName}
                onChange={(e) => setAccoutContactName(e.target.value)}
              />
            </div>    

            <div className="form__group">
              <p>Account Contact Email</p>
              <input
                type="text"
                value={accountContactEmail}
                onChange={(e) => setAccoutContactEmail(e.target.value)}
              />
            </div>    

            <div className="form__group">
              <p>Account Contact Phone</p>
              <input
                type="text"
                value={accountContactPhone}
                onChange={(e) => setAccoutContactPhone(e.target.value)}
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
                onClick={() => updateVendor(vendor.id, vendor.status)}
              >
                Save Account
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
    paths: [{ params: { vendorId: "1" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { vendorId } = context.params;

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: parseInt(vendorId),
    },
    include: {
      address: true,
    }
  })


  return {
    props: {
      data: {
        id: vendor.id.toString(),
        name: vendor.name,
        description: vendor.description,
        ein: vendor.ein,
        email: vendor.email,
        status: vendor.status,
        phone: vendor.phone,
        type: vendor.type,
        accountId: vendor.accountId.toString(),
        accountContactName: vendor.accountContactName,
        accountContactEmail: vendor.accountContactEmail,
        accountContactPhone: vendor.accountContactPhone,
        addressId: vendor.address[0].id,
        address1: vendor.address[0].address1,
        address2: vendor.address[0].address2,
        address3: vendor.address[0].address3,
        city: vendor.address[0].city,
        state: vendor.address[0].state,
        zipCode: vendor.address[0].zipCode,
        country: vendor.address[0].country

      },
    },
    revalidate: 1,
  };
}
