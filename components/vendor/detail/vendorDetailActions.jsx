import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button
} from '@chakra-ui/react';
import { useRouter } from "next/router";
import ManageDocuments from "../../document/manageDocuments";
import { VendorType } from "@prisma/client";
import { userService } from "../../../services";
import { ConfigConstants } from "../../../constants";
import AddEditVedorPaymentAccount from "../../configuration/payment/addEditVedorPaymentAccount";



const VendorDetailActions = (props) => {
    const router = useRouter();
    const navigateVendorEditPage = () => router.push("/account/vendor/edit");
    const navigateManageVendorUsersPage = () => router.push("/account/vendor/users");
    const navigateVendorInvoicesPage = () => router.push("/account/vendor/invoices");
    const navigateVendorProjectsPage = () => router.push("/account/vendor/projects");
    const manageVendorsForAccount = () => router.push("/account/vendors");

  

  return (

    <div>
          <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
                <HStack spacing={2}>
                  <Box>
                    <Button size="xs" bgColor="header_actions" onClick={navigateVendorEditPage}>
                      Edit
                    </Button>
                  </Box>
                  <Box>
                    <Button size="xs" bgColor="header_actions" onClick={manageVendorsForAccount}>
                     All Vendors
                    </Button>
                  </Box>   
                  <Box>
                    <Button size="xs" bgColor="header_actions" onClick={navigateManageVendorUsersPage}>
                      Users
                    </Button>
                  </Box>   
                  <Box>
                    <Button size="xs" bgColor="header_actions" onClick={navigateVendorProjectsPage}>
                      Projects
                    </Button>
                  </Box>                   
                  <Box>
                    <Button size="xs" bgColor="header_actions" onClick={navigateVendorInvoicesPage}>
                      Invoices
                    </Button>
                  </Box>     
                  <Box>
                    <ManageDocuments/>
                  </Box>           
                  {(props.data?.vendor?.type === VendorType.Supplier && userService.accountFeatureEnabled(ConfigConstants.FEATURES.PAYMENT_PROCESSOR) && userService.isPaymentAdmin)? <>
                    <Box>
                      <AddEditVedorPaymentAccount vendorId={props.data?.vendor?.id}/>
                    </Box>           
                  </>:<></>}  
                </HStack>
            </Flex>          
    </div>
  );
};

export default VendorDetailActions;
