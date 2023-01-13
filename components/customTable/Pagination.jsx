/* eslint-disable jsx-a11y/accessible-emoji */
import { Box, Button, Flex, HStack } from '@chakra-ui/react'
export const Pagination = ({ activePage, count, rowsPerPage, totalPages, setActivePage }) => {
    const beginning = activePage === 1 ? 1 : rowsPerPage * (activePage - 1) + 1
    const end = activePage === totalPages ? count : beginning + rowsPerPage - 1
  
    return (
      <>
      <Flex marginTop="3rem" alignItems="center" alignContent="center">
        <HStack>
          <Button disabled={activePage === 1} onClick={() => setActivePage(1)}>
            ⏮️ First
          </Button>
          <Button disabled={activePage === 1} onClick={() => setActivePage(activePage - 1)}>
            ⬅️ Previous
          </Button>
          <Button disabled={activePage === totalPages} onClick={() => setActivePage(activePage + 1)}>
            Next ➡️
          </Button>
          <Button disabled={activePage === totalPages} onClick={() => setActivePage(totalPages)}>
            Last ⏭️
          </Button>
          </HStack>
        <Box>
          Page {activePage} of {totalPages}
          </Box>
        <Box>
          Rows: {beginning === end ? end : `${beginning} - ${end}`} of {count}
          </Box>
        </Flex>        
      </>
    )
  }
  