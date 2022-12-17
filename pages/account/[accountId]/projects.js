
import ProjectList from "../../../components/project/projectList";

export default function Vendors(props) {
  const { data } = props;

  return (
    <ProjectList projectList={{ data: data, isVendor: false }} /> 
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
        action: "accountProjectList",
        accountId: accountId,
        vendorId: "NaN"
      }
    },
    revalidate: 1,
  };

  
}