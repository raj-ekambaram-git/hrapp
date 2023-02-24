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
const allowedExtensions = ["csv"];
import Papa from "papaparse";

const ImportData = (props) => {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToast();
  const [allowedImports, setAllowedImports] = useState([]);
  const [importObject, setImportObject] = useState();
  const appConfigList = useSelector(state => state.configuration.allConfigurations);
  // This state will store the parsed data
  const [data, setData] = useState([]);        
  // It will store the file uploaded by the user
  const [file, setFile] = useState(EMPTY_STRING);


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
  function handleImport(newSize) {
    if(userService.isSuperAdmin() || userService.isAccountAdmin() ) {
      if(!appConfigList || (appConfigList && appConfigList.length==0)) {
        loadAppConfig() 
      } 
      const allowedImports = appConfigList.filter((appConfig) => (appConfig.key === ConfigConstants.CONFIG_KEYS.AllowedImports));
      if(allowedImports && allowedImports.length >0) {
        setAllowedImports(allowedImports[0].value)
      }     
 
    }    


    setSize(newSize);
    onOpen();
  }

  const handleParseAndLoad = async () => {
         
    if (!file){
      toast({
        title: 'Upload File Error.',
        description: 'Enter a valid file.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
      return;
    };
    console.log("222 filefile::"+JSON.stringify(file))
    // const responseData = await importExportService.importData(file, file.type)
        // Initialize a reader which allows user
        // to read any file or blob.
        const reader = new FileReader();
         
        // Event listener on reader when the file
        // loads, we parse it and set the data.
        reader.onload = async ({ target }) => {
            const csv = Papa.parse(target.result, { header: true });
            const parsedData = csv?.data;
            const columns = Object.keys(parsedData[0]);
            console.log("parsedData:::"+JSON.stringify(parsedData))
            console.log("columns:::"+columns)
            setData(parsedData);
            const responseData = await importExportService.importTimesheetData(parsedData)
            
        };
        reader.readAsText(file);    

        

        console.log("DATTAA::"+JSON.stringify(data))
  }
 

  const handleFileChange = (e) => {
    console.log("handleFileChange")
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

                <Button size="xs" bgColor="header_actions" 
                  onClick={() => handleImport("xl")}
                  key="xl"
                  m={1}
                  >{`Import`}
                </Button>
              </HStack>                
              <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Import Data
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack marginBottom={5}>
                            <Heading size="xs">  
                              Supported Imports
                            </Heading>
                              <Box>
                                  <Select width="50%" id="importObject" onChange={(ev) => handleImportObject(ev)}>
                                      <option value="">Select an object</option>
                                      {allowedImports?.map((allowedImport) => (
                                        <option value={allowedImport}>{allowedImport}</option>
                                      ))}
                                </Select>
                              </Box>
                          </Stack>
                          <Stack spacing={8}>
                            {importObject?<>
                              <Box>
                                <FormControl isRequired>
                                  <FormLabel>Enter CSV File</FormLabel>
                                  <Input
                                      onChange={handleFileChange}
                                      id="csvInput"
                                      name="file"
                                      type="File"
                                  />
                                </FormControl>
                              </Box>
                              <Button  size="sm" width="30%" bgColor="button.primary.color" onClick={() => handleParseAndLoad()}>
                                Import
                              </Button>
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
