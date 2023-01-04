import {
    VStack,
    Box
  } from '@chakra-ui/react';

export { TimesheetHeader };

function TimesheetHeader(props) {

    const day = props.day;
    const date = props.date;

    return (
        <VStack>
            <Box>
                {day}
            </Box>
            <Box>
                {date}
            </Box>                                            
        </VStack>

    );
}
