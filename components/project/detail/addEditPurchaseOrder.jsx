import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Box,
    Stack,
    HStack,
    useToast,
    Input,
    Text,
    Card,
    CardBody,
    CardFooter,
    Select,
    CardHeader,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
  } from '@chakra-ui/react';
import {Spinner } from '../../common/spinner';
import { EMPTY_STRING } from "../../../constants";
import { projectService, userService } from "../../../services";
import { PurchaseOrderStatus } from "@prisma/client";

const AddEditPurchaseOrder = (props) => {
    const toast = useToast();    
    const [openAdd, setOpenAdd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [poNumber, setPoNumber] = useState();
    const [amount, setAmount] = useState();


    useEffect(() => {
        resetValues()
    }, []);

    const resetValues = () => {
        setPoNumber(EMPTY_STRING)
        setAmount(EMPTY_STRING)
    }

    const handleAddPurchaseOrder = () => {
        setOpenAdd(true)
    }

    const handleSubmitAddPurchaseOrder = async() => {
        if(poNumber && amount) {
            const createPORequest = {
                projectId: props.projectId,
                number: poNumber,
                amount: amount,
                status: PurchaseOrderStatus.Created
            }
            const responseData = await projectService.createPurchaseOrder(createPORequest, userService.getAccountDetails().accountId)
            if(responseData.error) {
                toast({
                    title: 'Add Purchase Order Error.',
                    description: 'Error creating new purchase order, please try again later or contact adminsistrator.',
                    status: 'error',
                    position: 'top',
                    duration: 9000,
                    isClosable: true,
                  })
                  return;
            } else {
                props.handleNewPOSubmit(responseData)
                setOpenAdd(false)
                resetValues()
                toast({
                    title: 'Add Purchase Order Error.',
                    description: 'Successfully create new purchase order.',
                    status: 'success',
                    position: 'top',
                    duration: 3000,
                    isClosable: true,
                  })                  
            }
        } else {
            toast({
                title: 'Add Purchase Order Error.',
                description: 'All the fields are required to create a purchase order.',
                status: 'error',
                position: 'top',
                duration: 9000,
                isClosable: true,
              })
              return;
        }
    }


    return (
        <>
        <Stack spacing={5} marginBottom={4} marginTop={5}>    
                {loading? (
                  <>
                  <Spinner/>
                  </>
                ) : (<></>)}
            {openAdd?<>
                <Card variant="document">
                    <CardHeader>
                        Add Purchase Order
                    </CardHeader>
                    <CardBody>
                        <Stack spacing={9}>
                            <HStack >
                                <FormControl isRequired>
                                    <FormLabel>PO Number</FormLabel>
                                    <Input type="text" width="50%" value={poNumber} id="poNumber" onChange={(ev) => setPoNumber(ev.target.value)}  />
                                </FormControl>    
                                <FormControl isRequired>
                                    <FormLabel>PO Amount</FormLabel>               
                                    <InputGroup>                            
                                        <InputLeftElement
                                            pointerEvents='none'
                                            color='dollor_input'
                                            fontSize='dollar_left_element'
                                            children='$'
                                        />     
                                        <Input type="number" value={amount} width="50%" onChange={(ev) => setAmount(ev.target.value)}/>
                                    </InputGroup>    
                                </FormControl>                                                                                                       
                            </HStack>
                        </Stack>                                                                          
                    </CardBody>
                    <CardFooter>
                        <HStack>
                            <Button size="xs"
                                colorScheme="yellow"
                                onClick={() => props.onClose()}
                                >{`Cancel`}
                            </Button>              
                            <Button size="xs"
                                bgColor="header_actions"
                                onClick={() => handleSubmitAddPurchaseOrder()}
                                >{`Add Purchase Order`}
                            </Button>       
                        </HStack>                             
                    </CardFooter>
                </Card>                    
            </>:<>
                <HStack>
                    <Button size="xs"
                        width="5%"
                        colorScheme="yellow"
                        onClick={() => props.onClose()}
                        >{`Cancel`}
                    </Button>              
                    <Button size="xs"
                            width="15%"
                        bgColor="header_actions"
                        onClick={() => handleAddPurchaseOrder()}
                        >{`Add Purchase Order`}
                    </Button>       
                </HStack>                 
            </>}
                       
        </Stack>                    
        </>
    );
};

export default AddEditPurchaseOrder;