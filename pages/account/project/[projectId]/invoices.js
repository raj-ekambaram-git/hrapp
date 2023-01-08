
import InvoiceList from "../../../../components/invoice/invoiceList";
import prisma from "../../../../lib/prisma";

export default function ProjectInvoices(props) {
  const { data } = props;
  return (
   <InvoiceList invoiceList={{ data: data, requestMode: "PROJECT" }} /> 
   
  );
}


export async function getStaticPaths() {

  return {
    paths: [{ params: { projectId: "5" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { projectId } = context.params;
  return {
    props: {
      data: {
        action: "projectInvoiceList",
        projectId: projectId
      }
    },
    revalidate: 1,
  };


}
