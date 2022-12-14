import UserList from "../../../components/user/userList";


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
}