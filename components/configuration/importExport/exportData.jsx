import React, { useState, useEffect } from "react";
import {
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  useToast,
  Flex,
  Box,
  Heading,
  HStack,
  Select,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';

import { useDispatch, useSelector } from "react-redux";
import { setConfigurations } from "../../../store/modules/Configuration/actions";
import { configurationService, importExportService, userService } from "../../../services";
import { ConfigConstants, EMPTY_STRING } from "../../../constants";
import { SelectQuerySection } from "./selectQuerySection";


const ExportData = (props) => {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToast();
  const [allowedExports, setAllowedExports] = useState([]);
  const [columnList, setColumnList] = useState();
  const [selectList, setSelectList] = useState();
  const [exportObject, setExportObject] = useState();
  const appConfigList = useSelector(state => state.configuration.allConfigurations);

  useEffect(() => {
    if(userService.isSuperAdmin() || userService.isAccountAdmin() ) {
      //Get list of allowed objects
      // if(!appConfigList || (appConfigList && appConfigList.length === 0) ) {
        loadAppConfig()
      // }
      const alllowedExports = appConfigList.filter((appConfig) => (appConfig.key === ConfigConstants.CONFIG_KEYS.AllowedImports));
      if(alllowedExports && alllowedExports.length >0) {
        setAllowedExports(alllowedExports[0].value)
      }    
  
    }
  }, []);

  const loadAppConfig = async() => {
    const responseData = await configurationService.getAdminAppConfigList();
    dispatch(setConfigurations(responseData))
  }

  const handleExportbject = async (importObject) => {
    setExportObject(importObject.target.value)
    const metaData = await importExportService.getTableMetaData(importObject.target.value, userService.getAccountDetails().accountId)
    setColumnList(metaData)
  }

  const handleColumnSelection = async (selectedColumn) => {
    const foreigntTable = selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-foreignTable")?selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-foreignTable"):null
    if(foreigntTable) {
      const metaData = await importExportService.getTableMetaData(foreigntTable, userService.getAccountDetails().accountId)
    }else {
      const selectDataType = selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-dataType")?selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-dataType"):null
      const selectItem = selectedColumn.target.value
      if (selectList) {
        const newSelectList = [...selectList]
        newSelectList.push(selectItem)
        setSelectList(newSelectList)
      }else {
        setSelectList([selectItem])
      }
    }
  }

  function hanldeExport(newSize) {
    setSize(newSize);
    onOpen();
    setSelectList(null)
    setColumnList(null)
  }

  const handleExportData = async () => {
    const responseData = await importExportService.exportData(exportObject, selectList, userService.getAccountDetails().accountId)
    console.log("responseData::"+JSON.stringify(responseData))
  }

  const handleDeleteSelect = (removedIndex) => {
    const newSelectList = [...selectList]
    newSelectList.splice(removedIndex, 1);
    setSelectList(newSelectList)
  }


  return (
    <div>
      <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
            <HStack>
                <Heading size="xs">
                    Export Data
                </Heading>

                <Button size="xs" bgColor="header_actions" 
                  onClick={() => hanldeExport("xl")}
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
                            Export Data
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing={7}>
                            <Stack>
                              <Heading size="xs">  
                                Supported Exports
                              </Heading>
                              <Box>
                                  <Select width="50%" id="importObject" onChange={(ev) => handleExportbject(ev)}>
                                      <option value="">Select an object</option>
                                      {allowedExports?.map((allowedExport) => (
                                        <option value={allowedExport}>{allowedExport}</option>
                                      ))}
                                  </Select>
                              </Box>
                            </Stack>
                            {columnList?<>
                              <Stack>
                                <Heading size="xs">  
                                  Data to fetch
                                </Heading>
                                <Box>
                                  <Select width="50%" id="columnSelect" onChange={(ev) => handleColumnSelection(ev)}>
                                      <option value="">Select</option>
                                      {columnList?.map((column) => (
                                        <option value={column.column_name} 
                                          data-foreignTable={column.foreign_table_name}
                                          data-dataType={column.data_type} >{column.foreign_table_name?column.foreign_table_name:column.column_name}</option>
                                      ))}
                                  </Select>
                                </Box>    
                                </Stack>      
                                {selectList && selectList.length>0?<>
                                  <Stack spacing={4}>
                                    <Heading size="xs">  
                                      Selected Fields
                                    </Heading>        
                                    <HStack>                            
                                      {selectList?.map((selectQuery, index) => 
                                          <SelectQuerySection selectQuery={selectQuery} indexVal={index} handleDeleteSelect={handleDeleteSelect}/>
                                      )}
                                    </HStack>
                                  </Stack>
                                  <Button size="xs" width="25%" bgColor="header_actions" 
                                    onClick={() => handleExportData()}
                                    >{`Export`}
                                  </Button>                                  
                                </>:<></>}
                            </>:<></>}
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>
        </Flex>

    </div>


  );
};

export default ExportData;
