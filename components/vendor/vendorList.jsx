import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { accountService, userService } from "../../services";

const VendorList = (props) => {
  const router = useRouter();
  const { data } = props.vendorList;
  
  console.log("VendorList::"+JSON.stringify(data))
  const [vendorList, setVendorList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);


  useEffect(() => {
    if(userService.isValidAccount(data.accountId)) {
      setPageAuthorized(true);
      getVendorList(data.accountId);
    }

  }, []);
  
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getVendorList(accountId) {
      // setPageAuthorized(true);
      const responseData = await accountService.getVendorList(accountId);
      setVendorList(responseData);

  }

  
  const navigatePage = () => router.push({ pathname: '/account/vendor/add-new', query: { kkkk: "value" } });
  

  return (

    <div className="main__container">
      <div className="account__header">
        <div className="iaccount_header-logo">
          <h3>Manage Vendors</h3>
          <p>There are total  of 10 vendors for the account number 12345</p>
        </div>

        <button className="btn" onClick={navigatePage}>
          Add New Vendor
        </button>
      </div>

      <div className="account__container">
        {/* ======= invoice item =========== */}
        {vendorList?.map((vendor) => (
          <Link href={`/account/vendor/${vendor.id}/detail`}>
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
                <p className="account__created">{vendor.createdDate}</p>
              </div>

              <div>
                <p className="account__client">{vendor.type}</p>
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
                      : account.status === "Inactive"
                      ? "pending__status"
                      : "draft__status"
                  }`}
                >
                  {vendor.status}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VendorList;
