export { ExportTemplateData };
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
  Th,
  Tr,
  Flex,
  Heading,
  HStack,
  Badge,
  useToast
} from '@chakra-ui/react';
import { importExportService, userService } from "../../../services";
import { ConfigConstants, EMPTY_STRING } from "../../../constants";
import { ExportTemplateStatus } from "@prisma/client";
import Papa from "papaparse";
import { util } from "../../../helpers/util";
import { CustomTable } from "../../customTable/Table";

function ExportTemplateData() {
  const toast = useToast();
  const [size, setSize] = useState(EMPTY_STRING);
  const [exportTemplates, setExportTemplates] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const EXPORT_TEMPLATES_TABLE_COLUMNS = React.useMemo(() => ConfigConstants.EXPORT_TEMPLATE_LIST_META)


  async function handleExportTemplateData(newSize) {
    const responseData = await importExportService.getSavedExportTemplates(userService.getAccountDetails().accountId)
    if(responseData != undefined && responseData != EMPTY_STRING) {
      const updatedExportTemplates =  responseData.map((exportTemplate, index)=> {
        exportTemplate.exportAction =  exportTemplate.status === ExportTemplateStatus.Active?<><Button onClick={() => handleExportNow(exportTemplate.id)} size="xs"  bgColor="header_actions">Export</Button></>:<></>
        return exportTemplate;   
      });
      setExportTemplates(responseData)
    }
    setSize(newSize);
    onOpen();
  }

  const handleExportNow = async (templateId) => {
    const templateToExport = exportTemplates.filter((exportTemplate) => (exportTemplate.id == templateId));
    if(templateToExport && templateToExport.length>0 
        && templateToExport[0]?.queryMeta?.selectList && templateToExport[0]?.queryMeta?.selectList.length > 0
        && templateToExport[0]?.queryMeta?.tableNames && templateToExport[0]?.queryMeta?.tableNames.length > 0
        && templateToExport[0]?.queryMeta?.filterByList && templateToExport[0]?.queryMeta?.filterByList.length > 0) {

      const responseData = await importExportService.exportData(templateToExport[0]?.queryMeta?.tableNames, 
                                                      templateToExport[0]?.queryMeta?.selectList, 
                                                      templateToExport[0]?.queryMeta?.filterByList, 
                                                      templateToExport[0]?.queryMeta?.joins, 
                                                      userService.getAccountDetails().accountId)
      const data = Papa.unparse(responseData);
      if(!data.error && data) {
        const blob = new Blob([data]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "fileNamePrefix"+util.getFormattedDateWithTime(new Date())+templateToExport[0].fileType;
        link.click();
    
      } else {
        toast({
          title: 'Export Data.',
          description: 'No data to export for your selection, please update.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
      }
    }else {
      toast({
        title: 'Export Error.',
        description: 'Please select at least ONE select and filter by fields',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }

  }
    return (
      <div>
          <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
              <HStack>
                <Heading size="xs">
                    Export Data from saved templates
                </Heading>
                <Button size="xs" bgColor="header_actions" 
                    onClick={() => handleExportTemplateData("xl")}
                    key="xl"
                    m={1}
                    >{`Export Data`}
                </Button>
              </HStack>
              <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                    <DrawerOverlay />
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>
                                Export data from saved templates
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack spacing={8}>
                                <Box border="box_border">
                                  <CustomTable  variant="sortTable" columns={EXPORT_TEMPLATES_TABLE_COLUMNS} rows={exportTemplates} />
                                </Box>                                                  
                              </Stack>                             
                            </DrawerBody>
                        </DrawerContent>
              </Drawer>
            </Flex>

        </div>

    );
}
