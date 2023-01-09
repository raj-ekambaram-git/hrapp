import ProjectList from "../../../components/project/projectList";
import React from "react";
import { useSelector } from "react-redux";

export default function VendorProjects(props) {
  const vendorId = useSelector(state => state.vendor.selectedVendorId);

  const data = {
    action: "vendorProjectList",
    vendorId: vendorId
  }

  return (
    <ProjectList projectList={{ data: data, isVendor: true }} /> 
  );
}
