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
import ExportActions from "./exportActions";
import { ExportTemplateStatus, ExportTemplateType, ExportType } from "@prisma/client";
import Papa from "papaparse";
import { util } from "../../../helpers/util";

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
  const [childFilterByList, setChildFilterByList] = useState();
  const [exportObject, setExportObject] = useState();
  const [joins, setJoins] = useState();
  const [tableNames, setTableNames] = useState();
  const [parentObjName, setParentObjName] = useState();  
  const appConfigList = useSelector(state => state.configuration.allConfigurations);
  const FILTER_BY_TYPE = "filterBy";
  const SELECT_TYPE = "selectBy";

  useEffect(() => {
  }, []);

  const loadAppConfig = async() => {
    const responseData = await configurationService.getAdminAppConfigList();
    if(responseData) {
      const alllowedExports = responseData.filter((appConfig) => (appConfig.key === ConfigConstants.CONFIG_KEYS.AllowedExports));
      if(alllowedExports && alllowedExports.length >0) {
        setAllowedExports(alllowedExports[0].value)
      }     
    }
    dispatch(setConfigurations(responseData))
  }

  const handleExportbject = async (importObject) => {
    setExportObject(importObject?.target?.value)
    setParentObjName(importObject?.target?.value.toLowerCase())
    setTableNames([importObject?.target?.value])
    const metaData = await importExportService.getTableMetaData(importObject.target.value, userService.getAccountDetails().accountId)
    setColumnList(metaData)
  }

  function hanldeExport(newSize) {
    if(userService.isSuperAdmin() || userService.isAccountAdmin() ) {
      if(!appConfigList || (appConfigList && appConfigList.length==0)) {
        loadAppConfig() 
      } 
      const alllowedExports = appConfigList.filter((appConfig) => (appConfig.key === ConfigConstants.CONFIG_KEYS.AllowedExports));
      if(alllowedExports && alllowedExports.length >0) {
        setAllowedExports(alllowedExports[0].value)
      }    
  
    }    
    setSize(newSize);
    onOpen();
    setSelectList(null)
    setColumnList(null)
    setFilterByList(null)
    setChildColumnList(null)
    setParentObjName(null)
    setJoins(null)
    setTableNames(null)
    setChildFilterByList(null)
  }

  const handleExportData = async () => {
    if(tableNames && tableNames.length>0 && selectList && selectList.length>0 && filterByList && filterByList.length>0) {
      const responseData = await importExportService.exportData(tableNames, selectList, filterByList, joins, userService.getAccountDetails().accountId)
      const data = Papa.unparse(responseData);
      if(!data.error && data) {
        const blob = new Blob([data]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = exportObject+util.getFormattedDateWithTime(new Date())+".csv";
        link.click();
    
      }else {
        toast({
          title: 'Export Data.',
          description: 'No data to export for your selection, please update.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
      }
  
      
    } else {
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

  const handleSaveAsTemplate = async (exportName, fileType, fileName) => {
    if(tableNames && tableNames.length>0 && selectList && selectList.length>0 && filterByList && filterByList.length>0) {
      const requestData = {
        type: ExportTemplateType.User,
        name: exportName,
        fileName: fileName,
        accountId: userService.getAccountDetails().accountId,
        queryMeta: {
          tableNames: tableNames,
          selectList: selectList,
          filterByList: filterByList,
          joins: joins
        },
        fileType: fileType,
        status: ExportTemplateStatus.Active
      }
        const responseData = await importExportService.saveExportAsTeplate(requestData)
        if(responseData.error) {
          toast({
            title: 'Export Error.',
            description: 'Error saving the export template, please try again or contact administrator..',
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })
        }else {
          toast({
            title: 'New Export Template.',
            description: 'Successfully added new export template.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })
          onClose()
        }
    } else {
      toast({
        title: 'Export Error.',
        description: 'Please select at least ONE select and filter by field.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }
    
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


  const handleSelectAndFilterBy = async (selectType, selectedFilter, isPrimary)=> {
    if(isPrimary) {
      if(selectType === FILTER_BY_TYPE) {
        setChildFilterByList(null)
      }else {
        setChildColumnList(null)
      }
      
    }
    const foreigntTable = selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-foreignTable")?selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-foreignTable"):null
    const selectDataType = selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-dataType")?selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-dataType"):null
    const tableName = selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-tableName")?selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-tableName"):null
    if(foreigntTable) {
      const metaData = await importExportService.getTableMetaData(foreigntTable, userService.getAccountDetails().accountId)
      if(selectType === FILTER_BY_TYPE) {
        setChildFilterByList(metaData)    
      }else {
        setChildColumnList(metaData)      
      }
      
      const joinItem = (tableName.toLowerCase()==="user"?"usr":tableName.toLowerCase())+"."+selectedFilter.target.value+"="+(foreigntTable.toLowerCase()==="user"?"usr":foreigntTable.toLowerCase())+".id"
      if(joins) {
        const nweJoins = [...joins]
        nweJoins.push(joinItem)
        setJoins(nweJoins)
      }else {
        setJoins([joinItem])
      }        
    }else {
      // const selectDataType = selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-dataType")?selectedFilter.target.options.item(selectedFilter.target.selectedIndex).getAttribute("data-dataType"):null
      if(selectType === FILTER_BY_TYPE) {
        const selectItem = {key: (tableName.toLowerCase()==="user"?"usr":tableName.toLowerCase())+"."+selectedFilter.target.value, dataType: selectDataType}
        if (filterByList) {
          const newFilterByList = [...filterByList]
          newFilterByList.push(selectItem)
          setFilterByList(newFilterByList)
        }else {
          setFilterByList([selectItem])
        }  
      }else {
        const selectItem = (tableName.toLowerCase()==="user"?"usr":tableName.toLowerCase())+"."+selectedFilter.target.value
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

    if(tableNames && !tableNames.includes(tableName)) {
      const newTableNames = [...tableNames]
      newTableNames.push(tableName)
      setTableNames(newTableNames)
    }

    if(foreigntTable && tableNames && !tableNames.includes(foreigntTable)) {
      const newTableNames = [...tableNames]
      newTableNames.push(foreigntTable)
      setTableNames(newTableNames)
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
                    Export data now or save the template for future exports
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
                                    <Select width="50%" id="columnSelect" onChange={(ev) => handleSelectAndFilterBy(SELECT_TYPE,ev, true)}>
                                        <option value="">Select</option>
                                        {columnList?.map((column) => (
                                          <option value={column.column_name} 
                                            data-foreignTable={column.foreign_table_name}
                                            data-tableName={column.table_name}
                                            data-dataType={column.data_type} >{column.foreign_table_name?column.foreign_table_name:column.column_name}</option>
                                        ))}
                                    </Select>
                                    {childColumnList && childColumnList.length>0?<>
                                      <Select width="50%" id="columnSelect" onChange={(ev) => handleSelectAndFilterBy(SELECT_TYPE, ev, false)}>
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
                                      <HStack>
                                          <Select width="50%" id="columnSelect" onChange={(ev) => handleSelectAndFilterBy(FILTER_BY_TYPE, ev, true)}>
                                              <option value="">Select</option>
                                              {columnList?.map((column) => (
                                                    <option value={column.column_name} 
                                                    data-foreignTable={column.foreign_table_name}
                                                    data-tableName={column.table_name}
                                                    data-dataType={column.data_type} >{column.foreign_table_name?column.foreign_table_name:column.column_name}</option>
                                                // column.indexName?<>
                                                //     <option value={column.column_name} 
                                                //         data-foreignTable={column.foreign_table_name}
                                                //         data-dataType={column.data_type} >{column.foreign_table_name?column.foreign_table_name:column.column_name}</option>
                                                //   </>:<></>
                                              ))}
                                          </Select>
                                          {childFilterByList && childFilterByList.length>0?<>
                                            <Select width="50%" id="columnFilterBySelect" onChange={(ev) => handleSelectAndFilterBy(FILTER_BY_TYPE, ev, false)}>
                                                <option value="">Select</option>
                                                {childFilterByList?.map((column) => (
                                                  <option value={column.column_name} 
                                                    data-foreignTable={column.foreign_table_name}
                                                    data-tableName={column.table_name}
                                                    data-dataType={column.data_type} >{column.foreign_table_name?column.foreign_table_name:column.column_name}</option>
                                                ))}
                                            </Select>
                                          </>:<></>}     
                                      </HStack>                                                                   
                              </Stack>
                              <ExportActions handleExportData={handleExportData} handleSaveAsTemplate={handleSaveAsTemplate}/>
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
