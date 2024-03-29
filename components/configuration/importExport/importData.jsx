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
  CardHeader,
  CardBody,
  Card,
  ButtonGroup,
  Text,
} from '@chakra-ui/react';
import { VscRefresh } from 'react-icons/vsc';
import { useDispatch, useSelector } from "react-redux";
import { setConfigurations } from "../../../store/modules/Configuration/actions";
import { configurationService, importExportService, userService } from "../../../services";
import { ConfigConstants, EMPTY_STRING } from "../../../constants";
const allowedExtensions = ["csv"];
import Papa from "papaparse";
import {Spinner} from '../../common/spinner'
import { CustomTable } from "../../customTable/Table";
import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons";
import ImportRunrDetails from "./importRunrDetails";


const ImportData = (props) => {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToast();
  const [allowedImports, setAllowedImports] = useState([]);
  const [importObject, setImportObject] = useState();
  const [importName, setImportName] = useState();
  const [previoustImports, setPrevioustImports] = useState();
  const appConfigList = useSelector(state => state.configuration.allConfigurations);
  // This state will store the parsed data
  const [data, setData] = useState([]);        
  const [loading, setLoading] = useState(false);     
  // It will store the file uploaded by the user
  const [file, setFile] = useState(EMPTY_STRING);
  const PREV_IMPORT_LIST_TABLE_COLUMNS = React.useMemo(() => ConfigConstants.PREV_IMPORT_LIST_TABLE_META)


  useEffect(() => {
  }, []);

  const loadAppConfig = async() => {
    const responseData = await configurationService.getAdminAppConfigList();
    if(responseData) {
      const allowedImports = responseData.filter((appConfig) => (appConfig.key === ConfigConstants.CONFIG_KEYS.AllowedImports));
      if(allowedImports && allowedImports.length >0) {
        setAllowedImports(allowedImports[0].value)
      }    
    }
    dispatch(setConfigurations(responseData))
  }

  const handleImportObject = (importObject) => {
    setImportObject(importObject.target.value)
  }


  const handleImport = async(newSize) => {
    setLoading(true)
    setImportObject(null)
    setSize(newSize);
    onOpen();  
    if(userService.isSuperAdmin() || userService.isAccountAdmin() ) {
      if(!appConfigList || (appConfigList && appConfigList.length==0)) {
        loadAppConfig() 
      } 
      const allowedImports = appConfigList.filter((appConfig) => (appConfig.key === ConfigConstants.CONFIG_KEYS.AllowedImports));
      if(allowedImports && allowedImports.length >0) {
        setAllowedImports(allowedImports[0].value)
      }
      
      //Get Previoust Imports for this user
      const responseData = await importExportService.previousImports(userService.userValue.id, userService.getAccountDetails().accountId)
      processImportDataForDisplay(responseData)
    }    
    setLoading(false)
  }

  const refreshPreviousImports = async() => {
      //Get Previoust Imports for this user
      const responseData = await importExportService.previousImports(userService.userValue.id, userService.getAccountDetails().accountId)
      processImportDataForDisplay(responseData)
  }

  const processImportDataForDisplay = (responseData) => {
    const updatedList = responseData?.data?.map((importJob) => {
      importJob.status = importJob?.runStatus?.runStatus;
      if(importJob?.runStatus?.runStatus === "Failed") {
        // importJob.runDetails = importJob?.runStatus?.errorDetails?importJob?.runStatus?.errorDetails:"Load Failed, no error details available.";
        importJob.runDetails = <ImportRunrDetails runDetails={importJob?.runStatus?.errorDetails}/>;        
        
      } else {
        importJob.runDetails = <CheckCircleIcon boxSize={4} color="header_actions"/>;
      }
      importJob.finishedAt = importJob?.runStatus?.lastRunTime;
      importJob.importedFileName = importJob?.requestData?.importFilePath;
      return importJob;
    })
    setPrevioustImports(updatedList)
  }


  const importData = async() => {
    if(importName && file && importObject) {
      const responseData = await importExportService.importData(userService.userValue.id, userService.getAccountDetails().accountId, importObject, file, importName);
      if(responseData && responseData.statusCode == 501) {
        toast({
          title: 'Import Data Error.',
          description: 'Import name already exists, please try importing the data with different name.',
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
        return;
      } else if(responseData && responseData.statusCode == 200){
        toast({
          title: 'Import Data.',
          description: 'Successfully imported daa.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
        onClose()
      } else {
        toast({
          title: 'Import Data Error.',
          description: 'Import error, please try again later or contact administrator.',
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
        return;
      }
    } else {
      toast({
        title: 'Import Data Error.',
        description: 'All the fields are required.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

  } 

  const handleFileChange = (e) => {
    // Check if user has entered the file
    if (e.target.files.length) {
        const inputFile = e.target.files[0];         
        // Check the file extensions, if it not
        // included in the allowed extensions
        // we show the error
        console.log("inputFile::"+JSON.stringify(inputFile))
        const fileExtension = inputFile?.type.split("/")[1];
        if (!allowedExtensions.includes(fileExtension)) {
            toast({
              title: 'Upload File Error.',
              description: 'Please input a csv file.',
              status: 'error',
              position: 'top',
              duration: 6000,
              isClosable: true,
            })
            return;
        }
        // If input type is correct set the state
        setFile(inputFile);
    }
};

  return (

    <div>
      <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
            <HStack>
                <Heading size="xs">
                    Import bulk data using CSV
                </Heading>

                <ButtonGroup>
                  <Button size="xs" bgColor="header_actions" 
                    onClick={() => handleImport("xxl")}
                    m={1}
                    >{`Import`}
                  </Button>
                  <Button size="xs" bgColor="header_actions" 
                    onClick={() => handleImport("xxl")}
                    m={1}
                    >{`Previous Imports`}
                  </Button>                  
                </ButtonGroup>
              </HStack>                
              <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        {loading?<><Spinner/></>:<></>}
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Import Data
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing={9}>
                            <Stack>
                              <Heading size="xs">  
                                Supported Imports
                              </Heading>
                                <Box>
                                    <Select width="20%" id="importObject" onChange={(ev) => handleImportObject(ev)}>
                                        <option value="">Select an object</option>
                                        {allowedImports?.map((allowedImport) => (
                                          <option value={allowedImport}>{allowedImport}</option>
                                        ))}
                                  </Select>
                                </Box>
                            </Stack>
                            <Stack spacing={9}>
                              {importObject?<>
                                <HStack>
                                  <FormControl isRequired>
                                    <FormLabel>Import Name</FormLabel>
                                    <Input
                                        width="50%"
                                        onChange={(ev) => setImportName(ev.target.value)}
                                        id="csvInput"
                                        name="file"
                                        type="text"
                                    />
                                  </FormControl>                              
                                  <FormControl isRequired>
                                    <FormLabel>Enter CSV File</FormLabel>
                                    <Input
                                        width="50%"
                                        onChange={handleFileChange}
                                        id="csvInput"
                                        name="file"
                                        type="File"
                                    />
                                  </FormControl>
                                </HStack>
                                <ButtonGroup>
                                  <Button  size="xs"  width="5%" colorScheme="yellow" onClick={() => onClose()}>
                                    Cancel
                                  </Button>
                                  <Button  size="xs"  width="10%" bgColor="header_actions" onClick={() => importData()}>
                                    Import
                                  </Button>
                                </ButtonGroup>
                              </>:<></>}
                            </Stack>
                            {previoustImports?<>
                              <Stack>
                                  <Card variant="paymentTransactions">
                                    <CardHeader>
                                      <HStack spacing={8}>
                                        <Text>Previous Imports</Text>
                                        <Button colorScheme="yellow" size="xs" onClick={refreshPreviousImports} >Refresh</Button>
                                      </HStack>
                                      
                                    </CardHeader>
                                    <CardBody>
                                      <CustomTable columns={PREV_IMPORT_LIST_TABLE_COLUMNS} rows={previoustImports} />
                                    </CardBody>
                                  </Card>                                  
                              </Stack>
                            </>:<></>}
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>
        </Flex>

    </div>


  );
};

export default ImportData;
