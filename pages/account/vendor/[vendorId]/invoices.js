
import InvoiceList from "../../../../components/invoice/invoiceList";
import prisma from "../../../../lib/prisma";

export default function VendorInvoices(props) {
  const { data } = props;
  return (
    <InvoiceList invoiceList={{ data: data, requestMode: "VENDOR" }} /> 
   
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
        action: "vendorInvoiceList",
        vendorId: vendorId
      }
    },
    revalidate: 1,
  };


}

// export async function getStaticPaths() {

//   return {
//     paths: [{ params: { vendorId: "1" } }],
//     fallback: true,
//   };

// } 

// export async function getStaticProps(context) {
//   const { vendorId } = context.params;
//   const invoices = await prisma.invoice.findMany({
//     where: {
//       vendorId: {
//         equals: parseInt(vendorId)
//       }
//   },
//   orderBy: {
//     id: "desc"
//   },
//     include: {
//       vendor: true, // Return all fields
//       user: true
//     }
//   });
  
//   return {
//     props: {
//       data: invoices.map((invoice) => {
//         return {
//           id: invoice.id.toString(),
//           name: invoice.vendor.name,
//           createdDate: invoice.createdDate.toDateString(),
//           total: invoice.total.toString(),
//           paidAmount: invoice.paidAmount,
//           type: invoice.type,
//           resourceName: invoice.user.firstName+" "+invoice.user.lastName,
//           status: invoice.status,
//         };
//       }),
//     },
//     revalidate: 1,
//   };
// }