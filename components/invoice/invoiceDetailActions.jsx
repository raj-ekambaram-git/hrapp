import React, { useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Button,
  useToast
} from '@chakra-ui/react';
import { invoiceService, userService } from "../../services";
import { EMPTY_STRING, InvoiceConstants } from "../../constants";
import InvoiceTransactions from "./transaction/invoiceTransactions";
import ManageDocuments from "../document/manageDocuments";
import { Spinner } from "../common/spinner";




const InvoiceDetailActions = (props) => {
    const toast = useToast();
    const isAddMode = props.data.isAddMode;
    const status = props.data.status;
    const invoiceId = props.data.invoiceId;
    const [loading, setLoading] = useState(false);

  async function handleDownloadInvoice() {
    setLoading(true)
    const invoiceBuffer = await invoiceService.generateInvoice(invoiceId, userService.getAccountDetails().accountId)
    setLoading(false)
    if(!invoiceBuffer.error) {
      const blob = new Blob([invoiceBuffer]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'invoice_'+invoiceId+'.pdf';
      link.click();
  
    }
    
  }

  async function handleSendInvoiceEmail() {
    setLoading(true)
    const responseData = await invoiceService.sendInvoiceEmail(invoiceId, userService.getAccountDetails().accountId);
    if(responseData.error) {
      toast({
        title: 'Invoice Email.',
        description: 'Error sending invoice email.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }else {
      toast({
        title: 'Invoice Email.',
        description: responseData.message,
        status: 'success',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }
    setLoading(false)
  }
  
  

  return (

    <div>
          {(!isAddMode && ((status !== InvoiceConstants.INVOICE_STATUS.Draft || status !== InvoiceConstants.INVOICE_STATUS.Pending) && status !== EMPTY_STRING)) ? (
            <>
            <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
                {loading?<><Spinner/></>:<></>}
                <HStack>
                  <InvoiceTransactions invoiceId={invoiceId}/>
                  {(!isAddMode && (status !== EMPTY_STRING && (status !== InvoiceConstants.INVOICE_STATUS.Submitted || status !== InvoiceConstants.INVOICE_STATUS.Paid || status !== InvoiceConstants.INVOICE_STATUS.PartiallyPaid))) ? (
                    <>
                      <Box>
                        <Button size="xs" bgColor="header_actions"
                            onClick={() => handleDownloadInvoice()}
                            >{`Download Invoice`}
                          </Button>          
                      </Box>
                      <Box>
                        <Button size="xs" bgColor="header_actions"
                            onClick={() => handleSendInvoiceEmail()}
                            >{`Send Invoice Email`}
                          </Button>          
                      </Box>                      
                    </> 
                    ) : (
                      <></>
                    )}
                    <ManageDocuments/>
                </HStack>
            </Flex>   
            </>
          ) : (
            <></>
          )}                  
    </div>
  );
};

export default InvoiceDetailActions;
