/* eslint-disable jsx-a11y/accessible-emoji */
import { Box, Button, Flex, HStack,Text } from '@chakra-ui/react'
import { ArrowRightIcon, ArrowLeftIcon, ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

export const Pagination = ({ activePage, count, rowsPerPage, totalPages, setActivePage }) => {
    const beginning = activePage === 1 ? 1 : rowsPerPage * (activePage - 1) + 1
    const end = activePage === totalPages ? count : beginning + rowsPerPage - 1
  
    return (
      <>
      <Box alignContent="left">
        <HStack spacing={3} marginTop="3rem" marginLeft="25rem" marginBottom="5rem">
          <Button size="xs" bgColor="header_actions" disabled={activePage === 1} onClick={() => setActivePage(1)}>
            <HStack>
                <ArrowLeftIcon/> <Text fontWeight="bolder" >First</Text>
            </HStack>            
          </Button>
          <Button size="xs" bgColor="header_actions" disabled={activePage === 1} onClick={() => setActivePage(activePage - 1)}>
            <HStack>
                <ArrowBackIcon/> <Text fontWeight="bolder" >Previous</Text>
            </HStack>
          </Button>
          <Button size="xs" bgColor="header_actions" disabled={activePage === totalPages} onClick={() => setActivePage(activePage + 1)}>
            <HStack>
                <ArrowForwardIcon/> <Text fontWeight="bolder" >Next</Text>
            </HStack>
          </Button>
          <Button size="xs" bgColor="header_actions" disabled={activePage === totalPages} onClick={() => setActivePage(totalPages)}>
            <HStack>
                <ArrowRightIcon/> <Text fontWeight="bolder" >Last</Text>
            </HStack>
          </Button>
          <Box>
             Page {activePage} of {totalPages}
          </Box>
          <Box>
            Rows: {beginning === end ? end : `${beginning} - ${end}`} of {count}
          </Box>
        </HStack>
      </Box>
      </>
    )
  }
  