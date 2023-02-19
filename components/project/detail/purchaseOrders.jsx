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
  useToast,
  Switch,
  HStack
} from '@chakra-ui/react'
import {
  DeleteIcon
} from '@chakra-ui/icons';
import { useDispatch, useSelector } from "react-redux";
import { projectService, userService } from "../../../services";
import { ProjectConstants } from "../../../constants";
import { CustomTable } from "../../customTable/Table";
import AddEditPurchaseOrder from "./addEditPurchaseOrder";
import { PurchaseOrderStatus } from "@prisma/client";



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
      handlePurchaseOrderTableDisplay(responseData)
      setSize(newSize)
      onOpen()  
    }
  }

  const handleNewPOSubmit = (newPO) => {
    const newPOList = [...purchaseOrders]
    newPOList.push(newPO);
    handlePurchaseOrderTableDisplay(newPOList)
  }

  const handleStatusUpdate = async(purchaseOrderId, status, index) => {
    const poRequest = {
      id: purchaseOrderId,
      status: status
    }
    const responseData = await projectService.updatePOStatus(purchaseOrderId, poRequest, userService.getAccountDetails().accountId)
    const newPOList = [...purchaseOrders]
    newPOList[index] = responseData;
    handlePurchaseOrderTableDisplay(newPOList)
  }

  const handlePurchaseOrderTableDisplay = (poList) => {
    const updatedPOList = poList.map((po, index) => {

      if(po.status == PurchaseOrderStatus.Created) {
        po.status = <HStack><Badge color={`${(po.status == PurchaseOrderStatus.Created )? "paid_status": "pending_status"}`}>{po.status}</Badge> <Switch colorScheme='teal' size='sm' id='created' isChecked onChange={() => handleStatusUpdate(po.id, PurchaseOrderStatus.Active, index)} >Mark Active</Switch></HStack>;
      } else if (po.status == PurchaseOrderStatus.Active) {
        po.status = <HStack><Badge color={`${(po.status == "Active" )? "paid_status": "pending_status"}`}>{po.status}</Badge> <Switch marginLeft="10" colorScheme='teal' size='sm' id='created' isChecked onChange={() => handleStatusUpdate(po.id, PurchaseOrderStatus.Inactive, index)} >Mark Inactive</Switch></HStack>;
      } else if (po.status == PurchaseOrderStatus.Inactive) {
        po.status = <HStack><Badge color={`${(po.status == "Active" )? "paid_status": "pending_status"}`}>{po.status}</Badge> <Switch marginLeft="10" colorScheme='red' size='sm' id='created' isChecked onChange={() => handleStatusUpdate(po.id, PurchaseOrderStatus.Inactive, index)} >Mark Closed</Switch></HStack>;
      }
      
      return po;
    })
    setPurchaseOrders(updatedPOList)
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
