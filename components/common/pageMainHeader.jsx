import React, { useState, useEffect } from "react";
export { PageMainHeader };
import {
    Flex,
    Heading,
    Box
  } from '@chakra-ui/react'
import { useDispatch } from 'react-redux';
import NotesHistory from '../notes/notesHistory';
import { setNotesType, resetNotesType } from "../../store/modules/Notes/actions";


function PageMainHeader(props) {
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
            >
            <Heading size='md'>{heading} {param1}</Heading>
            <Box color="black">
                <NotesHistory/>
            </Box>                                        
            </Flex>       

        
        </>
    );
}






  