import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  TableContainer,
  TableCaption,
} from '@chakra-ui/react';


const ProjectLocationSection = (props) => {
    const projectLocation = props.data.projectLocation;


    console.log("ProjectLocationSection::"+JSON.stringify(projectLocation))

  return (

    <div>
        <TableContainer  marginTop="2rem">
            <Table>
                <TableCaption></TableCaption>
                <Thead></Thead>
                <Tbody>
                <Tr >
                    <Th bgColor="table_tile" width="project.details.column1">
                        Project Location
                    </Th>
                    <Th>
                        {projectLocation.addressName} <br/>
                        {projectLocation.address1} <br/>
                        {projectLocation.address2 ? (
                            <>
                                {projectLocation.address2}<br/>
                            </>
                            ):(
                            <>
                            </>
                            )} 
                        {projectLocation.address3 ? (
                            <>
                                {projectLocation.address3}<br/>
                            </>
                            ):(
                            <>
                            </>
                            )} 
                        {projectLocation.city}, {projectLocation.state} {projectLocation.zipCode}  <br/>
                        {projectLocation.country} <br/>
                    </Th>
                </Tr>
                </Tbody>
            </Table>
        </TableContainer>    
    </div>


  );
};

export default ProjectLocationSection;
