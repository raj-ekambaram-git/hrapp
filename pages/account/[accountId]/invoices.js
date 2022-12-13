import { useRouter } from "next/router";
import prisma from "../../../lib/prisma";
import InvoiceList from "../../../components/Invoice/InvoiceList";

export default function Home(props) {
  const { data } = props;

  return (
    <InvoiceList invoiceList={{ data: data }} /> 
  );
}

export async function getStaticPaths() {

  return {
    paths: [{ params: { accountId: "1" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const invoices = await prisma.invoice.findMany({
    include: {
      vendor: true, // Return all fields
      user: true
    }
  });
  
  return {
    props: {
      data: invoices.map((invoice) => {
        return {
          id: invoice.id.toString(),
          name: invoice.vendor.name,
          createdDate: invoice.createdDate.toDateString(),
          total: invoice.total.toString(),
          paidAmount: invoice.paidAmount,
          type: invoice.type,
          resourceName: invoice.user.firstName+" "+invoice.user.lastName,
          status: invoice.status,
        };
      }),
    },
    revalidate: 1,
  };
}