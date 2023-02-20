import React, { useState, useEffect } from "react";
import {
  useDisclosure,
  Button,
  Table,
  Thead,
  Tbody,
  Box,
  TableContainer,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Th,
  Tr,
  useToast,
  Flex,
  HStack
} from '@chakra-ui/react';
import {
  DeleteIcon
} from '@chakra-ui/icons';
import { useDispatch, useSelector } from "react-redux";
import {fetchUserVendors, setUserVendors, removeUserVendorByIndex} from '../../../store/modules/User/actions'
import { invoiceService, userService } from "../../../services";
import { EMPTY_STRING } from "../../../constants/accountConstants";
import { ErrorMessage } from "../../../constants/errorMessage";
import { ShowInlineErrorMessage } from "../../common/showInlineErrorMessage";
import { InvoiceConstants } from "../../../constants";
import { util } from "../../../helpers";
import { CustomTable } from "../../customTable/Table";
import { InvoiceStatus } from "@prisma/client";
import { setSelectedInvoiceId } from "../../../store/modules/Invoice/actions";
import { useRouter } from "next/router";



const InvoiceDueSection = (props) => {
  const router = useRouter();
  const [size, setSize] = useState('');
  const [invoiceDues, setInvoiceDues] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {data} = props;
  const dispatch = useDispatch();
  const toast = useToast();
  const INVOICE_PAST_DUE_TABLE_COLUMNS = React.useMemo(() => InvoiceConstants.INVOICE_LIST_TABLE_META)

  const handleInvoiceDueCount = async (newSize) => {
    const responseData = await invoiceService.getInvoicePastDueDetails(userService.getAccountDetails().accountId, props.daysPast)
    updateInvoicesForDisplay(responseData)    
    setSize(newSize);
    onOpen();
  }

  function handleInvoiceDetailSelection(invoiceId) {
    dispatch(setSelectedInvoiceId(invoiceId))
    router.push("/account/invoice/detail");

  }

  function updateInvoicesForDisplay(responseData) {
    const updatedInvoiceList = responseData.map((invoice)=> {
      invoice.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleInvoiceDetailSelection(invoice.id)}>Details</Button>
      // invoice.deleteAction = <><HStack spacing={6}>{(invoice.status === InvoiceStatus.Draft)?(<DeleteIcon size="xs" onClick={() => handleInvoiceDeleteSelection(invoice.id)}/>):(<Box marginRight={3}></Box>)}<Box>{invoice.id}</Box></HStack></>
      // invoice.status = <Badge color={`${(invoice.status === "Paid" || invoice.status === "PartiallyPaid") ? "paid_status": invoice.status === "Pending" ? "pending_status": "pending_status"}`}>{invoice.status}</Badge>
      invoice.amount = util.getWithCurrency(invoice.total)
      invoice.balance = (parseFloat(invoice.total)-util.getZeroPriceForNull(invoice.paidAmount))
      invoice.paidAmount = util.getWithCurrency(invoice.paidAmount)
      invoice.formattedInvoiceDate = util.getFormattedDate(invoice.invoiceDate)
      invoice.formattedDueDate = util.getFormattedDate(invoice.dueDte)
      invoice.vendorName = invoice.vendor?.name
      invoice.accountName = invoice.account?.name
      invoice.projectName = invoice.project?.name
      return invoice;
    });
    setInvoiceDues(updatedInvoiceList)
  }

  useEffect(() => {
  }, []);


  return (

    <div>

          <Button size="xs" border="1px"
              onClick={() => handleInvoiceDueCount("xxl")}
              key="xxl"
              m={1}
              >{`Count: `+props.count}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Invoice Due  {props.headerData}
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing={8}>
                            <CustomTable  columns={INVOICE_PAST_DUE_TABLE_COLUMNS} rows={invoiceDues} />
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>


    </div>


  );
};

export default InvoiceDueSection;
