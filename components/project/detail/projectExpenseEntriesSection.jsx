import React from "react";
import {
  TableContainer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Table,
  Tbody,
  Thead,
  Th,
  Tr
} from '@chakra-ui/react';
import {
    AddIcon
  } from '@chakra-ui/icons';
import { util } from "../../../helpers/util";
  

const ProjectExpenseEntriesSection = (props) => {
    const expenseEntries = props.data;
    const initialFocusRef = React.useRef();

  return (

    <div>

        <Popover
        initialFocusRef={initialFocusRef}
        placement='bottom'
        closeOnBlur={false}
        >
            <PopoverTrigger>
                <AddIcon/>
           </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    Entry Details
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    <TableContainer>
                        <Table>
                            <Thead>
                                <Tr bgColor="table_tile">
                                    <Th>
                                        Date
                                    </Th>
                                    <Th>
                                        Type
                                    </Th>
                                    <Th>
                                        Billable
                                    </Th>                                    
                                    <Th>
                                        Amount
                                    </Th>
                                    <Th>
                                        Notes
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                            {expenseEntries?.map((expenseEntry) => (
                                    <Tr>
                                        <Th>
                                            {util.getFormattedDate(expenseEntry.expenseDate)}
                                        </Th>
                                        <Th>
                                            {expenseEntry.type}
                                        </Th>
                                        <Th>
                                            {expenseEntry.billable?"Yes":"No"}
                                        </Th>                                        
                                        <Th>
                                            {util.getWithCurrency(expenseEntry.amount)}
                                        </Th>
                                        <Th>
                                            {expenseEntry.notes}
                                        </Th>                                                                                                            
                                    </Tr>     
                            ))}                                                                                                                                                                                        
                            </Tbody>
                        </Table>                        
                    </TableContainer>                       
                </PopoverBody>
            </PopoverContent>
        </Popover>        
    </div>


  );
};

export default ProjectExpenseEntriesSection;
