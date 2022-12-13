import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import prisma from "../../../lib/prisma";
import { accountService, userService } from "../../../services";

const AccountDetail = (props) => {
  const router = useRouter();
  const accountId = props.data.accountId;
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [account, setAccount] = useState({});
  
  const navigateEditPage = () => router.push("/account/"+account.id);
  const navigateManageAccountUsersPage = () => router.push("/account/"+account.id+"/users");
  const navigateManageVendorsPage = () => router.push("/account/"+account.id+"/vendors");

  
  
  // set default input data
  useEffect(() => {
      async function getAccountDetailsAPICall() {
        // Call only if the user is SUPER_ADMIN and accountId as zero
        if(userService.isSuperAdmin()) {
          setPageAuthorized(true);
          const accountResponse = await accountService.accountDetail(accountId);
            const accountData =  {
                id: accountResponse.id.toString(),
                name: accountResponse.name,
                description: accountResponse.description,
                ein: accountResponse.ein,
                email: accountResponse.email,
                accountStatus: accountResponse.status,
                phone: accountResponse.phone,
                addressId: accountResponse.address[0].id,
                address1: accountResponse.address[0].address1,
                address2: accountResponse.address[0].address2,
                address3: accountResponse.address[0].address3,
                city: accountResponse.address[0].city,
                state: accountResponse.address[0].state,
                zipCode: accountResponse.address[0].zipCode,
                country: accountResponse.address[0].country
            };
  
            setAccount(accountData)
        }
  
      }
      getAccountDetailsAPICall();
    
  }, []);

  return (
    <div className="main__container">
      {isPageAuthprized ? (
        <>
          <div className="new__invoice">
            <div className="new__invoice-header">
              <h3>Account Details for {account.name}</h3> 
            </div>

            <div className="account__item">
                  <div>
                    <h5 className="account__id">
                      {account.id}
                    </h5>
                  </div>

                  <div>
                    <h5 className="account__client">{account.name}</h5>
                  </div>

                  <div>
                    <p className="account__created">{account.createdDate}</p>
                  </div>

                  <div>
                    <p className="account__created">{account.email}</p>
                  </div>

                  <div>
                    <h5 className="account__client">{account.ein}</h5>
                  </div>

                  <div>
                    <button
                      className={`${
                        account.status === "Active"
                          ? "paid__status"
                          : account.status === "Inactive"
                          ? "pending__status"
                          : "draft__status"
                      }`}
                    >
                      {account.status}
                    </button>
                  </div>
                </div>

            {/* ======== new invoice body ========= */}
            <div className="new__invoice-body">
              {/* ======= bill from ========== */}


              <div className="new__account__btns">  
                <div>
                  <button className="edit__btn" onClick={() => router.push("/account/list")}>
                    Manage Accounts
                  </button>
                </div>
                <div>
                  <button className="mark__as-btn" onClick={navigateEditPage}>
                    Edit
                  </button>
                </div>
                <div>
                  <button className="mark__as-btn" onClick={navigateManageVendorsPage}>
                    Manage Vendors
                  </button>
                </div>            
                <div>
                  <button className="mark__as-btn" onClick={navigateManageAccountUsersPage}>
                    Manage Account Users
                    </button>
                </div>
              </div>

            </div>
          </div>        
        </>
      ) : (
        <div className="account__header">
          <div className="iaccount_header-logo">
            <h3>Not Authorized to view this page. Please contact administrator.</h3>
          </div>
        </div>

      )}
    </div>
  );
};

export default AccountDetail;



export async function getStaticPaths() {

  return {
    paths: [{ params: { accountId: "5" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { accountId } = context.params;
  return {
    props: {
      data: {
        accountId: accountId
      },
    },
    revalidate: 1,
  };
}
