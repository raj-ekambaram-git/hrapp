
import {MODE_EDIT} from "../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ProjectAddEdit from "../../../components/project/projectAddEdit";
import { useSelector } from "react-redux";


const EditProject = (props) => {
  const router = useRouter();
  const [isVendor, setVendor] = useState(true);

  const projectId = useSelector(state => state.project.selectedProjectId);
  
  useEffect(() => {
    if(router.query && router.query.vendor) {
      setVendor(router.query.vendor)
    }
  }, [router.query]);

  console.log("Edit User::"+JSON.stringify(props))
  
  
  const requestData = {
    mode: MODE_EDIT,
    projectId: projectId,
    isVendor: isVendor,
    modalRequest: false
  }
  
    return (
      <div className="main__container">
          <ProjectAddEdit data={requestData}/>
      </div>
    );
  };
export default EditProject;
