import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { accountService, userService } from "../../services";

const UserList = (props) => {
  const router = useRouter();
  const { data } = props.userList;
  const { isVendor } = props.userList;
  console.log("UserList::"+JSON.stringify(data))
  const [usersList, setUsersList] = useState([]);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);


  useEffect(() => {

    if(isVendor) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        getUsersList(data.vendorId, data.accountId)
      }else {
        getUsersList(data.vendorId, userService.getAccountDetails().accountId)
      }
      
      
    }else {
      //Since this is just the account call only accountId
      if(userService.isSuperAdmin()) {
        getUsersList("", data.accountId)
      }else {
        getUsersList("", userService.getAccountDetails().accountId)
      }
      
     
    }

  }, []);
  
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getUsersList(vendorId, accountId) {
      // setPageAuthorized(true);
      const responseData = await userService.getUsersByVendor(vendorId, accountId);
      setUsersList(responseData);

    }

  
  const navigatePage = () => router.push({ pathname: '/account/user/add', query: { vendor: isVendor }});
  

  return (
    <div className="main__container">
      <div className="account__header">
        <div className="iaccount_header-logo">
          {isVendor ? (
            <h3>Manage Vendor Users</h3>
          ) : (
            <h3>Manage Account Users</h3>
          )}
          
          
          <p>There are total  of 10 users for the account number MM</p>
        </div>

        <button className="btn" onClick={navigatePage}>
          Add New Account User
        </button>
      </div>

      <div className="account__container">
        {/* ======= invoice item =========== */}
        {usersList?.map((user) => (
          <Link href={`/account/user/${user.id}`} passref key={user.id}>
            <div className="account__item">
              <div>
                <h5 className="account__id">
                  {user.id}
                </h5>
              </div>

              <div>
                <h5 className="account__client">{user.firstName}</h5>
              </div>

              <div>
                <h5 className="account__client">{user.lastName}</h5>
              </div>

              <div>
                <p className="account__created">{user.createdDate}</p>
              </div>

              <div>
                <p className="account__created">{user.email}</p>
              </div>

              <div>
                <button
                  className={`${
                    user.status === "Active"
                      ? "paid__status"
                      : user.status === "Inactive"
                      ? "pending__status"
                      : "draft__status"
                  }`}
                >
                  {user.status}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserList;
