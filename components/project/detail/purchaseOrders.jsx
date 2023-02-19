import React, { useState } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  StackDivider,
  useDisclosure,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Badge,
  useToast
} from '@chakra-ui/react'
import {
  DeleteIcon
} from '@chakra-ui/icons';
import { useDispatch, useSelector } from "react-redux";
import { projectService, userService } from "../../../services";
import { ProjectConstants } from "../../../constants";
import { CustomTable } from "../../customTable/Table";
import AddEditPurchaseOrder from "./addEditPurchaseOrder";



const PurchaseOrders = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState('');
  const [purchaseOrders, setPurchaseOrders] = useState();
  const PURCHASE_ORDERS_TABLE_COLUMNS = React.useMemo(() => ProjectConstants.PURCHASE_ORDER_TABLE_META)

  const handleClick = async (newSize) => {
    if(props.projectId) {
      const responseData = await projectService.getPurchaseOrders(props.projectId, userService.getAccountDetails().accountId);
      setPurchaseOrders(responseData)
      setSize(newSize)
      onOpen()  
    }
  }

  const handleNewPOSubmit = (newPO) => {
    const newPOList = [...purchaseOrders]
    newPOList.push(newPO);
    setPurchaseOrders(newPOList)
  }


  
  return (

    <div>
          <Button size="xs"
              bgColor="header_actions"
              onClick={() => handleClick("xxl")}
              key="xxl"
              m={1}
              >{`Purchase Orders`}
          </Button>      
          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                Purchase Orders
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack divider={<StackDivider />} spacing='1'>
                                <AddEditPurchaseOrder projectId={props.projectId} onClose={onClose} handleNewPOSubmit={handleNewPOSubmit}/>
                                <CustomTable columns={PURCHASE_ORDERS_TABLE_COLUMNS} rows={purchaseOrders} />
                              </Stack>
                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  

    </div>


  );
};

export default PurchaseOrders;
