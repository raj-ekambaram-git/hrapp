import React from "react";
import { Link } from "react-router-dom";
import "./styles/accountsNavbar.module.css";

const AccountsNavbar = () => {
  return (
    <div>
      <div>
        <div className="project_navbar">
          <div className="project_heading_div">
            <h1 className="project_heading"> Accounts </h1>
          </div>
          <div className="project_header_right">
            <div className="project_create_div">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsNavbar;
