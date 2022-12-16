import {MODE_ADD} from "../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ProjectAddEdit from "../../../components/project/projectAddEdit";


const AddNewProject = (props) => {
  const router = useRouter();
  const [isVendor, setVendor] = useState(true);
  const [vendorId, setVendorId] = useState(true);

  useEffect(() => {
    setVendor(router.query.vendor);
    setVendorId(router.query.vendor);
  }, [router.query]);

const requestData = {
  mode: MODE_ADD,
  projectId: "",
  vendorId: vendorId,
  isVendor: isVendor,
  modalRequest: false
}

  return (
    <div className="main__container">
        <ProjectAddEdit data={requestData}/>
    </div>
  );
};

export default AddNewProject;


