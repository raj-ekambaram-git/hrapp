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
import { importExportService, userService } from "../../../services";
import { util } from "../../../helpers/util";

function ExportSystemTemplateData(props) {
  const toast = useToast();
  const [size, setSize] = useState(EMPTY_STRING);
  const [queryInput, setQueryInput] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSystemExportTemplateData = (newSize) => {
    setSize(newSize);
    onOpen();
  }

  const setKeyValue = (keyName, value, index) => {
    const queryKeyValue = {};
    queryKeyValue[keyName] = value;
    // const newQueryInput = [...queryInput]
    // newQueryInput.push(queryKeyValue)
    setQueryInput(queryKeyValue)
  }

  const handleSystemExportNow = async () => {
      const systemExportRequest = {
        reportType: props.exportTemplateMeta?.queryMeta?.type,
        templateName: props.exportTemplateMeta?.template,
        templateCSS: props.exportTemplateMeta?.queryMeta?.templateCSS,             
      }

      if(queryInput) {
        var keys = Object.keys(queryInput)
        systemExportRequest[keys[0]] = queryInput[keys[0]]
        const responseData = await importExportService.exportSystemReport(systemExportRequest, userService.getAccountDetails().accountId);
        console.log("responseData:::"+JSON.stringify(responseData))
        if(!responseData.error) {
          const blob = new Blob([responseData]);
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = props.exportTemplateMeta?.fileName+util.getFormattedDateWithTime(new Date())+"."+props.exportTemplateMeta?.fileType?.toLowerCase();
          link.click();
      
        }
      }

  }
    return (
      <>          
              <Button size="xs" bgColor="header_actions" 
                  onClick={() => handleSystemExportTemplateData("xl")}
                  key="xl"
                  m={1}
                  >{`Export`}
              </Button>
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
                                        <Input  placeholder=" " type={field.type==="number"?"number":"text"}  width="25%" onChange={(ev) =>setKeyValue(field.key, ev.target.value, index)}/>
                                        <FormLabel>{field.name}</FormLabel>
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
        </>

    );
}
