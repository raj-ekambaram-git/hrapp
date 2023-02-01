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
} from '@chakra-ui/react';

import { useDispatch, useSelector } from "react-redux";
import { setConfigurations } from "../../../store/modules/Configuration/actions";
import { configurationService, importExportService, userService } from "../../../services";
import { ConfigConstants, EMPTY_STRING } from "../../../constants";
import { SelectQuerySection } from "./selectQuerySection";
import { FilterBySection } from "./filterBySection";


const ExportData = (props) => {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToast();
  const [allowedExports, setAllowedExports] = useState([]);
  const [columnList, setColumnList] = useState();
  const [childColumnList, setChildColumnList] = useState();
  const [selectList, setSelectList] = useState();
  const [filterByList, setFilterByList] = useState();
  const [exportObject, setExportObject] = useState();
  const [joins, setJoins] = useState();
  const [parentObjName, setParentObjName] = useState();  
  const appConfigList = useSelector(state => state.configuration.allConfigurations);

  useEffect(() => {
    if(userService.isSuperAdmin() || userService.isAccountAdmin() ) {
      //Get list of allowed objects
      // if(!appConfigList || (appConfigList && appConfigList.length === 0) ) {
        loadAppConfig()
      // }
      const alllowedExports = appConfigList.filter((appConfig) => (appConfig.key === ConfigConstants.CONFIG_KEYS.AllowedExports));
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
    setExportObject(importObject?.target?.value)
    setParentObjName(importObject?.target?.value.toLowerCase())
    const metaData = await importExportService.getTableMetaData(importObject.target.value, userService.getAccountDetails().accountId)
    setColumnList(metaData)
  }

  const handleColumnSelection = async (selectedColumn) => {
    const foreigntTable = selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-foreignTable")?selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-foreignTable"):null
    const selectDataType = selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-dataType")?selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-dataType"):null
    const tableName = selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-tableName")?selectedColumn.target.options.item(selectedColumn.target.selectedIndex).getAttribute("data-tableName"):null
    if(foreigntTable) {
      const metaData = await importExportService.getTableMetaData(foreigntTable, userService.getAccountDetails().accountId)
      console.log("metaDatametaData::"+JSON.stringify(metaData))
      setChildColumnList(metaData)
      const joinItem = parentObjName.toLowerCase()+"."+selectedColumn.target.value+"="+tableName.toLowerCase()+"."+selectedColumn.target.value
      if(joins) {
        const nweJoins = [...joins]
        nweJoins.push(joinItem)
        setJoins(newSelectList)
      }else {
        setJoins([joinItem])
      }
    }else {
      const selectItem = tableName.toLowerCase()+"."+selectedColumn.target.value
      setParentObjName(tableName)
      // const selectItem = selectedColumn.target.value
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
    setFilterByList(null)
    setChildColumnList(null)
  }

  const handleExportData = async () => {
    console.log("JOINSSS ::"+JSON.stringify(joins))
    const responseData = await importExportService.exportData(exportObject, selectList, filterByList, userService.getAccountDetails().accountId)
    console.log("responseData::"+JSON.stringify(responseData))
  }
  
  const handleDeleteSelect = (removedIndex) => {
    const newSelectList = [...selectList]
    newSelectList.splice(removedIndex, 1);
    setSelectList(newSelectList)
  }

  const handleDeleteFilterBy = (removedIndex) => {
    const newFilterByList = [...filterByList]
    newFilterByList.splice(removedIndex, 1);
    setFilterByList(newFilterByList)
  }


  const handleFilterBy = async (selectedFilter)=> {
    const foreigntTable = selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-foreignTable")?selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-foreignTable"):null
    if(foreigntTable) {
      const metaData = await importExportService.getTableMetaData(foreigntTable, userService.getAccountDetails().accountId)
    }else {
      const selectDataType = selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-dataType")?selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-dataType"):null
      const selectItem = {key: selectedFilter.target.value, dataType: selectDataType}
      if (filterByList) {
        const newFilterByList = [...filterByList]
        newFilterByList.push(selectItem)
        setFilterByList(newFilterByList)
      }else {
        setFilterByList([selectItem])
      }
    }

  }

  const handleFIlterByInput = (filterByVal, indexVal, key) => {
    
    const newFilterByList = [...filterByList]
    if(key === "operator") {
      newFilterByList[indexVal]["operator"] = filterByVal
    }else if (key === "value") {
      newFilterByList[indexVal]["value"] = filterByVal
    }
    
    setFilterByList(newFilterByList)

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
                                  <HStack>
                                    <Select width="50%" id="columnSelect" onChange={(ev) => handleColumnSelection(ev)}>
                                        <option value="">Select</option>
                                        {columnList?.map((column) => (
                                          <option value={column.column_name} 
                                            data-foreignTable={column.foreign_table_name}
                                            data-tableName={column.table_name}
                                            data-dataType={column.data_type} >{column.foreign_table_name?column.foreign_table_name:column.column_name}</option>
                                        ))}
                                    </Select>
                                    {childColumnList && childColumnList.length>0?<>
                                      <Select width="50%" id="columnSelect" onChange={(ev) => handleColumnSelection(ev)}>
                                          <option value="">Select</option>
                                          {childColumnList?.map((column) => (
                                            <option value={column.column_name} 
                                              data-foreignTable={column.foreign_table_name}
                                              data-tableName={column.table_name}
                                              data-dataType={column.data_type} >{column.foreign_table_name?column.foreign_table_name:column.column_name}</option>
                                          ))}
                                      </Select>
                                  </>:<></>}
                                  </HStack>
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
                                  
                                  <Stack spacing={4}>
                                    <Heading size="xs">  
                                        Filter By
                                      </Heading>        
                                      <Stack spacing={4}>                            
                                        {filterByList?.map((filterBy, index) => 
                                            <FilterBySection filterBy={filterBy} indexVal={index} handleDeleteFilterBy={handleDeleteFilterBy} handleFIlterByInput={handleFIlterByInput}/>
                                        )}
                                      </Stack>                                      
                                      <Select width="50%" id="columnSelect" onChange={(ev) => handleFilterBy(ev)}>
                                          <option value="">Select</option>
                                          {columnList?.map((column) => (
                                                <option value={column.column_name} 
                                                data-foreignTable={column.foreign_table_name}
                                                data-dataType={column.data_type} >{column.foreign_table_name?column.foreign_table_name:column.column_name}</option>
                                            // column.indexName?<>
                                            //     <option value={column.column_name} 
                                            //         data-foreignTable={column.foreign_table_name}
                                            //         data-dataType={column.data_type} >{column.foreign_table_name?column.foreign_table_name:column.column_name}</option>
                                            //   </>:<></>
                                          ))}
                                      </Select>
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
