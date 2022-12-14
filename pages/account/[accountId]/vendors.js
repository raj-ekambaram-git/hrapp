import Link from "next/link";
import { useRouter } from "next/router";
import prisma from "../../../lib/prisma";
import React, { useState, useRef } from "react";
import { userService } from '../../../services';

export default function Home(props) {
  const router = useRouter();
  const { data } = props;

  // const navigatePage = () => router.push("/account/user/add-new");

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
        {data?.map((vendor) => (
          <Link href={`/account/vendor/${vendor.id}/detail`} passref key={vendor.id}>
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
}

export async function getStaticPaths() {

  return {
    paths: [{ params: { accountId: "5" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {

  userService.validateAccount(1);

  const { accountId } = context.params;
  const vendors = await prisma.vendor.findMany({
    where: {
        accountId: {
          equals: parseInt(accountId)
        }
    },
    orderBy: {
      id: "desc"
    }
  });



  return {
    props: {
      data: vendors.map((vendor) => {
        return {
          id: vendor.id.toString(),
          name: vendor.name,
          createdDate: vendor.createdDate.toDateString(),
          email: vendor.email,
          ein: vendor.ein,
          type: vendor.type,
          status: vendor.status,
        };
      }),
    },
    revalidate: 1,
  };
}