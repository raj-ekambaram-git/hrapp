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

      console.log("appConfigList::"+JSON.stringify(appConfigList))
      const alllowedExports = appConfigList.filter((appConfig) => (appConfig.key === ConfigConstants.CONFIG_KEYS.AllowedImports));
      console.log("allowedImports:::"+JSON.stringify(alllowedExports))
      if(alllowedExports && alllowedExports.length >0) {
        setAllowedExports(alllowedExports[0].value)
      }    
  
    }
  }, []);

  const loadAppConfig = async() => {
    const responseData = await configurationService.getAdminAppConfigList();
    console.log("responseData::"+JSON.stringify(responseData))
    dispatch(setConfigurations(responseData))
  }

  const handleExportbject = async (importObject) => {
    setExportObject(importObject.target.value)
    const metaData = await importExportService.getTableMetaData(importObject.target.value, userService.getAccountDetails().accountId)
    console.log("METADATA:::"+JSON.stringify(metaData))
    setColumnList(metaData)
  }

  const handleColumnSelection = async (selectedColumn) => {
    const foreigntTable = selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-foreignTable")?selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-foreignTable"):null
    console.log("dsdffsf foreigntTable::"+foreigntTable)
    if(foreigntTable) {
      console.log("foreigntTable::"+foreigntTable)
      const metaData = await importExportService.getTableMetaData(foreigntTable, userService.getAccountDetails().accountId)
      console.log("metaData::"+JSON.stringify(metaData))
    }else {
      console.log("Straignt Column")
      const selectItem = {key: selectedColumn.target.value}
      console.log("selectList::::"+JSON.stringify(selectList))
      if (selectList) {
        console.log("Existing Select ::"+JSON.stringify(selectItem))
        const newSelectList = [...selectList]
        newSelectList.push(selectItem)
        setSelectList(newSelectList)
      }else {
        console.log("NEW Select ::"+JSON.stringify(selectItem))
        setSelectList([selectItem])
      }
    }
  }

  function hanldeExport(newSize) {
    setSize(newSize);
    onOpen();
    setSelectList(null)
  }


  return (
    <div>
      <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
            <HStack>
                <Heading size="xs">
                    Export Data
                </Heading>

                <Button size="xs" bgColor="header_actions" 
                  onClick={() => hanldeExport("lg")}
                  key="lg"
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
                          <Stack marginBottom={5}>
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
                              {columnList?<>
                                <Box>
                                  <Select width="50%" id="columnSelect" onChange={(ev) => handleColumnSelection(ev)}>
                                      <option value="">Select</option>
                                      {columnList?.map((column) => (
                                        <option value={column.column_name} 
                                          data-foreignTable={column.foreign_table_name} >{column.foreign_table_name?column.foreign_table_name:column.column_name}</option>
                                      ))}
                                  </Select>
                                </Box>           
                                <Box>
                                  {selectList?.map((selectQuery, index) => 
                                      <SelectQuerySection selectQuery={selectQuery} indexVal={index}/>
                                  )}
                                </Box>                   
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
