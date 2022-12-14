import Link from "next/link";
import { useRouter } from "next/router";
import { fetchWrapper } from "../../helpers/fetch-wrapper";
import prisma from "../../lib/prisma";
import { useDispatch } from 'react-redux';
import { accountService, userService } from "../../services";
import { useState, useEffect } from "react";



export default function Home(props) {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  

  //INFO: used for making initial api calls
  useEffect(() => {
    async function performAccountsAPICall() {
      // Call only if the user is SUPER_ADMIN and accountId as zero
      if(userService.isSuperAdmin()) {
        setPageAuthorized(true);
        const accountsListResponse = await accountService.accountsList();
        if (accountsListResponse) {

          const accounts = accountsListResponse.map((account) => {
            return {
              id: account.id.toString(),
              name: account.name,
              createdDate: account.createdDate.toDateString,
              email: account.email,
              ein: account.ein,
              status: account.status,
            };
          });

          setAccounts(accounts);
        }
      }else {
        //Show error message
      }

    }
    performAccountsAPICall();
  }, []);
  
  const navigatePage = () => router.push("/account/add-new");

  return (
    <div className="main__container">

      {isPageAuthprized ? (
        <>
        <div className="account__header">
        <div className="iaccount_header-logo">
          <h3>Accounts</h3>
          <p>There are total  invoices</p>
        </div>

        <button className="btn" onClick={navigatePage}>
          Add New Account 
        </button>
      </div>

      <div className="account__container">
        {/* ======= invoice item =========== */}
        
        {accounts?.map((account) => (
          <Link href={`/account/${account.id}/detail`} passref key={account.id}>
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
          </Link>
        ))}
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
}

export async function getStaticProps() {
  return {
    props: {
      data: {
        action: "accountsList"
      }
    },
    revalidate: 1,
  };
}