import UserList from "../../../../components/user/userList";
import prisma from "../../../../lib/prisma";
import React, { useState, useRef } from "react";
import { userService } from "../../../../services";

export default function Home(props) {
  const { data } = props;

  return (
        
    <UserList userList={{ data: data, isVendor: true }} /> 

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
        action: "vendorUserList",
        vendorId: vendorId
      }
    },
    revalidate: 1,
  };


  // const users = await prisma.user.findMany({
  //   where: {
  //       vendorId: {
  //         equals: parseInt(vendorId)
  //       },
  //       accountId: {
  //         equals: 2
  //       }
  //   },
  //   orderBy: {
  //     id: "desc"
  //   }
  // });

  // // console.log(JSON.stringify(users))
  // return {
  //   props: {
  //     data: users.map((user) => {
  //       return {
  //         id: user.id.toString(),
  //         firstName: user.firstName,
  //         lastName: user.lastName,
  //         createdDate: user.createdDate.toDateString(),
  //         email: user.email,
  //         status: user.status,
  //       };
  //     }),
  //   },
  //   revalidate: 1,
  // };
}