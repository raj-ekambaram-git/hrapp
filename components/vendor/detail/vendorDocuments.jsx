import React, { useState } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  StackDivider,
  useDisclosure,
  Input,
  Box
} from '@chakra-ui/react'
import { documentService } from "../../../services";



const VendorDocuments = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState('');
  const [file, setFile] = useState();
  const [uploadingStatus, setUploadingStatus] = useState();
  const [uploadedFile, setUploadedFile] = useState();

  
  const uploadFile = async () => {
    setUploadingStatus("Uploading the file to AWS S3");
    
    const data = await documentService.getUploadURL(file.name, file.type);

    // const upload = await fetch(data, {
    //   method: 'PUT',
    //   body: file,
    //         headers: {
    //     "Content-Type": file.type,
    //   }
    // })

    const upload = await documentService.uploadFile(data, file, file.type);

    if (upload.ok) {
      console.log('Uploaded successfully!')
    } else {
      console.error('Upload failed.')
    }

  };

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }
  
  function selectFile(e) {
    console.log("SELECT FILE::"+e.target.files)
    setFile(e.target.files[0])

  }

  return (

    <div>
          <Button size="xs"
              bgColor="header_actions"
              onClick={() => handleClick("lg")}
              key="lg"
              m={1}
              >{`Documents`}
          </Button>      
          <Drawer onClose={onClose} isOpen={isOpen} size="xl">
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                Vendor Documents
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack divider={<StackDivider />} spacing='1'>
                                {/* <ProjectAddEdit data={data} modelRequest={onClose}></ProjectAddEdit>                  */}
                                <Box>Please select a file to upload</Box>
                                <Input type="file" onChange={(e) => selectFile(e)} />
                                {file && (
                                  <>
                                    <p>Selected file: {file.name}</p>
                                    <Button
                                      onClick={uploadFile}
                                      className=" bg-purple-500 text-white p-2 rounded-sm shadow-md hover:bg-purple-700 transition-all"
                                    >
                                      Upload a File!
                                    </Button>
                                  </>
                                )}
                                {uploadingStatus && <p>{uploadingStatus}</p>}
                                {uploadedFile && <img src={uploadedFile} />}                                
                              </Stack>
                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  

    </div>


  );
};

export default VendorDocuments;
