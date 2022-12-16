
import {MODE_EDIT} from "../../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ProjectAddEdit from "../../../../components/project/projectAddEdit";


const EditProject = (props) => {
  const router = useRouter();
  const [isVendor, setVendor] = useState(true);

  useEffect(() => {
    if(router.query && router.query.vendor) {
      setVendor(router.query.vendor)
    }
  }, [router.query]);

  console.log("Edit User::"+JSON.stringify(props))
  
  const projectId = props.data.projectId;
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



export async function getStaticPaths() {

  return {
    paths: [{ params: { projectId: "1" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  console.log("Static prosp::"+JSON.stringify(context))
  
  const { projectId } = context.params;
  return {
    props: {
      data: {
        projectId: projectId
      },
    },
    revalidate: 1,
  };
}