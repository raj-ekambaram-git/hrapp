import React from "react";
import {
    TableContainer,
    TableCaption,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Text

  } from '@chakra-ui/react';

  const Notes = (props) => {
    const notes = props.data.notes;

    return (
        <div>
            <TableContainer marginTop="1rem">
                <Table>
                    <TableCaption></TableCaption>
                    <Thead>
                    </Thead>                
                    <Tbody>
                        <Tr>
                            <Th bgColor="table_tile" width="35%">
                                Notes ID
                            </Th>
                            <Th>
                                {notes.id}
                            </Th>      
                        </Tr>   
                        <Tr>
                            <Th bgColor="table_tile" width="35%">
                                Type
                            </Th>
                            <Th>
                                {notes.type}
                            </Th>      
                        </Tr> 
                        <Tr>
                            <Th bgColor="table_tile">
                                Notes 
                            </Th>
                            <Th >
                                <Text noOfLines={1}>
                                    {notes.notes}
                                </Text>
                                
                            </Th>      
                        </Tr> 
                        <Tr>
                            <Th bgColor="table_tile" width="35%">
                                Created
                            </Th>
                            <Th>
                                {notes.lastUpdateDate}
                            </Th>      
                        </Tr> 
                        <Tr>
                            <Th bgColor="table_tile" width="35%">
                                Created By
                            </Th>
                            <Th>
                                {notes.createdBy}
                            </Th>      
                        </Tr>                                                                                                 
                    </Tbody>    
                </Table>
            </TableContainer>                
        </div>
    );
};


export default Notes;