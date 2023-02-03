export { ExportSystemTemplateData };
import React, { useState } from "react";
import {
  useDisclosure,
  Button,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  Flex,
  HStack,
  useToast,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react';
import { EMPTY_STRING } from "../../../constants";

function ExportSystemTemplateData(props) {
  const toast = useToast();
  const [size, setSize] = useState(EMPTY_STRING);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSystemExportTemplateData = (newSize) => {
    setSize(newSize);
    onOpen();
  }

  const setKeyValue = (keyName, value, index) => {

  }

  const handleSystemExportNow = () => {

  }
    return (
      <div>
          <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
              <HStack>
                <Button size="xs" bgColor="header_actions" 
                    onClick={() => handleSystemExportTemplateData("xl")}
                    key="xl"
                    m={1}
                    >{`Export`}
                </Button>
              </HStack>
              <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            {props.exportTemplateMeta.name}
                        </DrawerHeader>
                        <DrawerBody>
                          <Box border="box_border" >
                            <Stack spacing={8} padding={4}>
                                {props.exportTemplateMeta?.queryMeta?.fields?.map((field, index) => 
                                  <HStack>
                                    <FormControl isRequired={field.required?true:false}>
                                        <FormLabel>{field.name}</FormLabel>
                                        <Input type={field.type==="number"?"number":"text"}  width="25%" onChange={(ev) =>setKeyValue(field.key, ev.target.value, index)}/>
                                    </FormControl>   
                                  </HStack>
                                )}
                                <Button size="xs" bgColor="header_actions" width="15%"
                                    onClick={() => handleSystemExportNow()}
                                    >{`Export Now`}
                                </Button>
                            </Stack>   
                          </Box>                                                       
                        </DrawerBody>
                    </DrawerContent>
              </Drawer>
            </Flex>

        </div>

    );
}
