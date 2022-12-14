import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import prisma from "../../../../lib/prisma";
import { accountService, userService } from '../../../../services';

const EditItem = (props) => {
  const vendorId = props.data.vendorId;

  const router = useRouter();
  
  const [vendor, setVendor] = useState({});
  
  const navigateVendorEditPage = () => router.push("/account/vendor/"+vendor.id);
  const navigateManageVendorUsersPage = () => router.push("/account/vendor/"+vendor.id+"/users");
  const navigateVendorInvoicesPage = () => router.push("/account/vendor/"+vendor.id+"/invoices");
  const manageVendorsForAccount = () => router.push("/account/"+userService.getAccountDetails().accountId+"/vendors");
  
  // set default input data
  useEffect(() => {
    getVendorDetails(vendorId, userService.getAccountDetails().accountId);
  }, []);


      /**
   * Function to get the list of accounts for a drop down
   */
  async function getVendorDetails(vendorId, accountId) {
    // setPageAuthorized(true);
    const responseData = await accountService.getVendorDetail(vendorId, accountId);
    setVendor(responseData);
  }

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

  return {
    props: {
      data: {
        vendorId: vendorId
      }
    },
    revalidate: 1,
  };

}
