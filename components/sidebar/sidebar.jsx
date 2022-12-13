import React from "react";
import Image from "next/image";
import { userService } from '../../services';
import Link from "next/link";

const Sidebar = () => {

  const user = userService.userValue;

  if(userService.userValue) {
    return (
      <div className="sidebar">
      <div className="sidebar__container">
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <h2>Invoice App</h2>
          </div>
        </div>
        <div className="sidebar__menu">
          {userService.isSuperAdmin() ? (
              <div className="sidebar__menuitem">
                <Link href={`/account/list`} passref key={user.accuntId}>Accounts</Link>
              </div>
          ) : (
            <>
              <div className="sidebar__menuitem">
                <Link href={`/account/${userService.getAccountDetails().accountId}/vendors`} passref key={user.accountId}>Vendors</Link>
              </div>
              <div className="sidebar__menuitem">
                <Link href={`/account/${userService.getAccountDetails().accountId}/users`} passref key={user.accountId}>Users</Link>
              </div>
              <div className="sidebar__menuitem">
                <a href="/account/timesheet"> Timesheet</a>
              </div>      
              <div className="sidebar__menuitem">
                <Link href={`/account/${userService.getAccountDetails().accountId}/invoices`} passref key={user.accountId}>Invoices</Link>
              </div>    
            </>
          )}


          
        </div>

        <div className="sidebar__bottom">
          <Image src="/ava.png" alt="avatar" width="50" height="50" />
        </div>
      </div>
    </div>
  );    
  } 

};

export default Sidebar;
