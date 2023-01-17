import React, { useState, useEffect } from "react";
export { PageMainHeader };
import {
    Flex,
    Heading,
    Box,
    Button,
    HStack
  } from '@chakra-ui/react'
import { useDispatch } from 'react-redux';
import NotesHistory from '../notes/notesHistory';
import { setNotesType, resetNotesType } from "../../store/modules/Notes/actions";
import { useRouter } from "next/router";


function PageMainHeader(props) {
    const router = useRouter();
    const heading = props.heading;
    const param1 = props.param1;
    const dispatch = useDispatch();
    const notesData = props.notesData;

      // set default input data
  useEffect(() => {
    dispatch(resetNotesType())
    dispatch(setNotesType(notesData));
  }, []);

    return (
        <>
            <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="page.heading"
            bg="heading"
            color="white"
            marginBottom="page.heading_marginBottom"
            width="page.heading_width"
            borderRadius='9px'
            >
            <Heading size='md'>{heading} {param1}</Heading>
            <HStack spacing={2}>
              <Box>
                <Button size="xs" colorScheme="yellow" onClick={() => router.back()}>
                  Go Back
                </Button>
              </Box>
              <Box color="black">
                  <NotesHistory/>
              </Box>     
            </HStack>                                   
            </Flex>       

        
        </>
    );
}






  