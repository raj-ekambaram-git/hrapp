
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

  
}