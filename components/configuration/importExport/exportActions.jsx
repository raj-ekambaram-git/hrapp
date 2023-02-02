import React from "react";
import {
  Stack,
  Select,
  HStack,
  Button,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  useToast
} from '@chakra-ui/react';
import { useRouter } from "next/router";
import { useState } from "react";
import { EMPTY_STRING } from "../../../constants";

const ExportActions = (props) => {
    const router = useRouter();
    const toast = useToast();
    const [fileType, setFileType] = useState();
    const [exportName, setExportName] = useState();
    const [showSaveExport, setShowSaveExport] = useState(false);
  
    const handleSaveAsTemplate = () => {
      if(exportName && exportName != EMPTY_STRING && fileType && fileType != EMPTY_STRING) {
        props.handleSaveAsTemplate(exportName, fileType)
      }else {
        toast({
          title: 'Save as Template error.',
          description: 'Please enter name and file type for your export template.',
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
      }
    }

    const handleExportNow = () => {
      props.handleExportData();
    }

  return (

    <div>
      <Stack spacing={7}>
           {showSaveExport?<>
              <HStack spacing={2}>
                <FormControl isRequired width="40%">
                    <FormLabel>Name</FormLabel>
                    <Input type="text"  value={exportName} onChange={(ev) =>setExportName(ev.target.value)}/>
                  </FormControl>          
                  <FormControl isRequired>
                    <FormLabel>File Type</FormLabel>
                    <Select width="30%" id="fileType" onChange={(ev) => setFileType(ev.target.value)}>
                          <option value="">Select File Type</option>
                          <option value="CSV">CSV</option>
                          <option value="PDF">PDF</option>                                      
                    </Select>                   
                  </FormControl>   
                </HStack>
              </>:<></>}        
              <Stack>
                <FormControl>
                    <FormLabel>Save as template?</FormLabel>
                    <Checkbox
                      onChange={(e) => setShowSaveExport(e.target.checked)}
                    />                
                </FormControl>    
                <HStack>
                  <Button size="xs" width="25%" bgColor="header_actions" 
                    onClick={() => handleExportNow()}
                    >{`Export Now`}
                  </Button>     
                  {showSaveExport?<>                  
                    <Button size="xs" width="25%" bgColor="header_actions" 
                      onClick={() => handleSaveAsTemplate()}
                      >{`Save as template`}
                    </Button>   
                  </>:<></>}     
                </HStack>                          
              </Stack>
      </Stack>        
    </div>
  );
};

export default ExportActions;
