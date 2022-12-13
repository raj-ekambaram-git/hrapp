import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";

const InvoiceList = (props) => {
  const router = useRouter();
  const { data } = props.invoiceList;
  
  const navigateAddNewInvoicePage = () => router.push("/account/invoice/add-new");

  return (
    <div className="main__container">
      <div className="invoice__header">
        <div className="invoice__header-logo">
          <h3>Account Invoices</h3>
          <p>There are total  invoices</p>
        </div>

        <button className="btn" onClick={navigateAddNewInvoicePage}>
          Add New Invoice
        </button>
      </div>

      <div className="invoice__container">
        {/* ======= invoice item =========== */}
        {data?.map((invoice) => (
          <Link href={`/account/invoice/${invoice.id}`} passref key={invoice.id}>
            <div className="invoice__item">
              <div>
                <h5 className="invoice__id">
                  {invoice.id}
                </h5>
              </div>

              <div>
                <h6 className="invoice__client">{invoice.name}</h6>
              </div>

              <div>
                <p className="invoice__created">{invoice.createdAt}</p>
              </div>

              <div>
                <p className="invoice__created">{invoice.resourceName}</p>
              </div>

              <div>
                <p className="invoice__created">{invoice.type}</p>
              </div>

              <div>
                <p className="invoice__created">{invoice.paidAmount}</p>
              </div>

              <div>
                <h3 className="invoice__total">${invoice.total}</h3>
              </div>

              <div>
                <button
                  className={`${
                    invoice.status === "paid"
                      ? "paid__status"
                      : invoice.status === "pending"
                      ? "pending__status"
                      : "draft__status"
                  }`}
                >
                  {invoice.status}
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
