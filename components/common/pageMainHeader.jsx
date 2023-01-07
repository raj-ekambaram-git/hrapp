export { PageMainHeader };
import {
    Flex,
    Heading,
    Box
  } from '@chakra-ui/react'
import NotesHistory from '../notes/notesHistory';
  

function PageMainHeader(props) {
    const heading = props.heading;
    const param1 = props.param1;
    const notesData = props.notesData
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
             {notesData?.type ? (
                <Box color="black">
                    <NotesHistory data={{notesType: notesData?.type, notesTypeId: notesData?.typeId, notesTypeTitle: notesData?.typeTile}}></NotesHistory>
                </Box>                                        
             ) : (<></>)}
            </Flex>       

        
        </>
    );
}






  