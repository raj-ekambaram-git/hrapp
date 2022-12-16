import ProjectList from "../../../../components/project/projectList";
import prisma from "../../../../lib/prisma";
import React, { useState, useRef } from "react";
import { userService } from "../../../../services";

export default function VendorProjects(props) {
  const { data } = props;

  return (
        
    <ProjectList projectList={{ data: data, isVendor: true }} /> 

  );
}

export async function getStaticPaths() {

  return {
    paths: [{ params: { vendorId: "5" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { vendorId } = context.params;


  return {
    props: {
      data: {
        action: "vendorProjectList",
        vendorId: vendorId
      }
    },
    revalidate: 1,
  };


}