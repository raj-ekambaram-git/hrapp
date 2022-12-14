
import VendorList from "../../../components/vendor/vendorList";

export default function Vendors(props) {
  const { data } = props;

  return (
    <VendorList vendorList={{ data: data }} /> 
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
        action: "accountVendorList",
        accountId: accountId
      }
    },
    revalidate: 1,
  };

  // userService.validateAccount(1);

  // const { accountId } = context.params;
  // const vendors = await prisma.vendor.findMany({
  //   where: {
  //       accountId: {
  //         equals: parseInt(accountId)
  //       }
  //   },
  //   orderBy: {
  //     id: "desc"
  //   }
  // });



  // return {
  //   props: {
  //     data: vendors.map((vendor) => {
  //       return {
  //         id: vendor.id.toString(),
  //         name: vendor.name,
  //         createdDate: vendor.createdDate.toDateString(),
  //         email: vendor.email,
  //         ein: vendor.ein,
  //         type: vendor.type,
  //         status: vendor.status,
  //       };
  //     }),
  //   },
  //   revalidate: 1,
  // };
}