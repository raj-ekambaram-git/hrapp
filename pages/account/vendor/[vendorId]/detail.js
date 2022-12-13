import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import prisma from "../../../../lib/prisma";
import { userService } from '../../../../services';

const EditItem = (props) => {
  const vendor = props.data;
  const router = useRouter();

  console.log("99999999"+userService.getAccountDetails().accountId)
  
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
  
  const navigateVendorEditPage = () => router.push("/account/vendor/"+vendor.id);
  const navigateManageVendorUsersPage = () => router.push("/account/vendor/"+vendor.id+"/users");
  const navigateVendorInvoicesPage = () => router.push("/account/vendor/"+vendor.id+"/invoices");
  const manageVendorsForAccount = () => router.push("/account/"+userService.getAccountDetails().accountId+"/vendors");
  
  

  

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
          <h3>Vendor Details for {vendor.name}</h3> 
        </div>

        <div className="account__item">
              <div>
                <h5 className="account__id">
                  {vendor.id}
                </h5>
              </div>

              <div>
                <h5 className="account__client">{vendor.name}</h5>
              </div>
              <div>
                <h5 className="account__client">{vendor.type}</h5>
              </div>
              <div>
                <p className="account__created">{vendor.createdDate}</p>
              </div>

              <div>
                <p className="account__created">{vendor.email}</p>
              </div>

              <div>
                <h5 className="account__client">{vendor.ein}</h5>
              </div>

              <div>
                <button
                  className={`${
                    vendor.status === "Active"
                      ? "paid__status"
                      : vendor.status === "Inactive"
                      ? "pending__status"
                      : "draft__status"
                  }`}
                >
                  {vendor.status}
                </button>
              </div>
            </div>

        {/* ======== new invoice body ========= */}
        <div className="new__invoice-body">
          {/* ======= bill from ========== */}


          <div className="new__account__btns">  
            <div>
              <button className="edit__btn" onClick={manageVendorsForAccount}>
                Manage Vendors
              </button>
            </div>
            <div>
              <button className="mark__as-btn" onClick={navigateVendorEditPage}>
                Edit
              </button>
            </div>
            <div>
              <button className="mark__as-btn" onClick={navigateVendorInvoicesPage}>
                Vendor Ivoices
              </button>
            </div>         
            <div>
              <button className="mark__as-btn" onClick={navigateManageVendorUsersPage}>
                Manage Vendor Users
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

  console.log("LLLLLLLL"+JSON.stringify(context))
  userService.validateAccount(1);

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
        type: vendor.type,
        email: vendor.email,
        status: vendor.status,
        phone: vendor.phone,
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
