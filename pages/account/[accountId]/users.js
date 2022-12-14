import UserList from "../../../components/user/userList";
import prisma from "../../../lib/prisma";

export default function Home(props) {
  const { data } = props;

  return (
    <UserList userList={{ data: data, isVendor: false }} /> 
  );
}

export async function getStaticPaths() {

  return {
    paths: [{ params: { accountId: "5" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { accountId } = context.params;

  return {
    props: {
      data: {
        action: "accountUserList",
        accountId: accountId
      }
    },
    revalidate: 1,
  };

  // const users = await prisma.user.findMany({
  //   where: {
  //     accountId: {
  //         equals: parseInt(accountId)
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