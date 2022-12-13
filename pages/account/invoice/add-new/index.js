import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";


const AddNew = () => {
  const router = useRouter();

  const vendorId = useRef("");
  const type = useRef("");
  const cycle = useRef("");
  const accountId = useRef("");
  const quantity = useRef("");
  const rate = useRef("");
  const dueDate = useRef("");
  const transactionId = useRef("");
  const notes = useRef("");
  const total = useRef("");
  const paymentTerms = useRef("");
  const userId = useRef("");


  // submit data to the database
  const createInvoice = async (status) => {
    try {
      if (
        vendorId.current.value === "" ||
        type.current.value === "" ||
        cycle.current.value === "" ||
        accountId.current.value === "" ||
        quantity.current.value === "" ||
        rate.current.value === "" ||
        dueDate.current.value === "" ||
        transactionId.current.value === "" ||
        notes.current.value === "" ||
        total.current.value === "" ||
        paymentTerms.current.value === "" ||
        userId.current.value === ""
      ) {
        
        toast.warning("All fields are required. Must provide valid data");
      } else {
        const res = await fetch("/api/account/invoice/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorId: 1,
            userId: 2,
            accountId: 2, 
            type: type.current.value,
            cycle: cycle.current.value,
            quantity: 1,
            rate: rate.current.value,
            transactionId: transactionId.current.value,
            notes: notes.current.value,
            total: total.current.value,
            paymentTerms: paymentTerms.current.value,
            status: "Pending"
          }),
        });
        const data = await res.json();

        toast.success(data.message);
        router.push("/account/invoices");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="main__container">
      <div className="new__invoice">
        <div className="new__invoice-header">
          <h3>New Invoice</h3>
        </div>

        {/* ======== new invoice body ========= */}
        <div className="new__invoice-body">
          {/* ======= bill from ========== */}
          <div className="bill__from">
            <p className="bill__title">Bill from</p>
            <div className="form__group">
              <p>Vendor ID</p>
              <input type="text" ref={vendorId} />
            </div>

            <div className="form__group inline__form-group">
              <div>
                <p>Invoice Type</p>
                <input type="text" ref={type} value="Staffing"/>
              </div>

              <div>
                <p>Cycle</p>
                <input type="text" ref={cycle} value="BiWeekly" />
              </div>


              <div>
                <p>AccountId</p>
                <input type="text" ref={accountId} />
              </div>
            </div>
          </div>

          {/* ========= bill to ========== */}
          <div className="bill__to">
            <p className="bill__title">Bill to</p>
            <div className="form__group">
              <p>Quantity</p>
              <input type="text" ref={quantity} />
            </div>

            <div className="form__group">
              <p>Rate</p>
              <input type="text" ref={rate} />
            </div>

            <div className="form__group">
              <p>Due Date</p>
              <input type="email" ref={dueDate} />
            </div>

            <div className="form__group inline__form-group">
              <div>
                <p>Transaction Details</p>
                <input type="text" ref={transactionId} />
              </div>

              <div>
                <p>Notes</p>
                <input type="text" ref={notes} />
              </div>

              <div>
                <p>Total</p>
                <input type="text" ref={total} />
              </div>
            </div>

            <div className="form__group inline__form-group">

              <div className="inline__group">
                <p>Payment Terms</p>
                <input type="text" ref={paymentTerms} value="Net45"/>
              </div>
            </div>

            <div className="form__group">
              <p>Usern</p>
              <input type="text" ref={userId} />
            </div>
          </div>


          <div className="new__invoice__btns">
            <button className="edit__btn" onClick={() => router.push("/")}>
              Discard
            </button>
            <div>
              <button
                className="draft__btn"
                onClick={() => createInvoice("draft")}
              >
                Save as Draft
              </button>

              <button
                className="mark__as-btn"
                onClick={() => createInvoice("pending")}
              >
                Send & Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNew;
