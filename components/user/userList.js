import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";

const InvoiceList = (props) => {
  const router = useRouter();
  const { data } = props.userList;
  
  const navigatePage = () => router.push({ pathname: '/account/user/add-new', query: { kkkk: "value" } });

  return (
    <div className="main__container">
      <div className="account__header">
        <div className="iaccount_header-logo">
          <h3>Manage Account Users</h3>
          <p>There are total  of 10 users for the account number 12345</p>
        </div>

        <button className="btn" onClick={navigatePage}>
          Add New Account User
        </button>
      </div>

      <div className="account__container">
        {/* ======= invoice item =========== */}
        {data?.map((user) => (
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

export default InvoiceList;
