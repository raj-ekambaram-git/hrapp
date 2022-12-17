import { useRouter } from "next/router";
import prisma from "../../../lib/prisma";
import InvoiceList from "../../../components/Invoice/InvoiceList";

export default function Home(props) {
  const { data } = props;

  return (
    <InvoiceList invoiceList={{ data: data, requestMode: "ACCOUNT" }} /> 
  );
}

export async function getStaticPaths() {

  return {
    paths: [{ params: { accountId: "2" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { accountId } = context.params;
  return {
    props: {
      data: {
        action: "accountInvoiceList",
        accountId: accountId
      }
    },
    revalidate: 1,
  };


}