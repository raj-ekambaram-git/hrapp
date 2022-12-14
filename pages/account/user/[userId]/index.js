import UserAddEdit from "../../../../components/account/userAddEdit";
import {MODE_EDIT} from "../../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";


const EditUser = (props) => {
  const router = useRouter();
  const [isVendor, setVendor] = useState(true);

  useEffect(() => {
    if(router.query && router.query.vendor) {
      setVendor(router.query.vendor)
    }
  }, [router.query]);

  const userId = props.data.userId;
  const requestData = {
    mode: MODE_EDIT,
    userId: userId,
    isVendor: isVendor
  }
  
    return (
      <div className="main__container">
          <UserAddEdit data={requestData}/>
      </div>
    );
  };
export default EditUser;



export async function getStaticPaths() {

  return {
    paths: [{ params: { userId: "5" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { userId } = context.params;
  return {
    props: {
      data: {
        userId: userId
      },
    },
    revalidate: 1,
  };
}