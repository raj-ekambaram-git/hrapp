import React, { useState } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  Heading,
  DrawerBody,
  Stack,
  StackDivider,
  useDisclosure
} from '@chakra-ui/react'
import ProjectAddEdit from './projectAddEdit';


const ProjectAddEditSection = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState('');
  const {data} = props;

  console.log("DAAYYYY::"+JSON.stringify(data));

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }

  return (

    <div>
          <Button
              onClick={() => handleClick("lg")}
              key="lg"
              m={1}
              >{`Create New Project`}
          </Button>      
          <Drawer onClose={onClose} isOpen={isOpen} size="xl">
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                <Heading as="h1" size="lg" letterSpacing={'-.1rem'} marginBottom="1rem">
                                Create a Project
                                </Heading>
                                <Heading as="h3" size="md">
                                    for vendor
                                </Heading>
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack divider={<StackDivider />} spacing='1'>
                                <ProjectAddEdit data={data}></ProjectAddEdit>                 
                              </Stack>
                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  

    </div>


  );
};

export default ProjectAddEditSection;
