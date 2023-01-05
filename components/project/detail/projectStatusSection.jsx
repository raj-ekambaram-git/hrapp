import React from "react";
import {
  Box,
  Heading,
  Badge
} from '@chakra-ui/react';


const ProjectStatusSection = (props) => {
    const project = props.data.project;

  return (

    <div>
        
        <Box>
            <Heading size='xs' textTransform='uppercase' marginBottom="1rem">
            Project Status
            </Heading>
            <Badge color={`${
                (project.status === "Created" || project.status === "Open")
                    ? "paid_status"
                    : project.status === "Closed"
                    ? "pending_status"
                    : "pending_status"
                }`}>{project.status}
            </Badge>              
        </Box>    

    </div>


  );
};

export default ProjectStatusSection;
