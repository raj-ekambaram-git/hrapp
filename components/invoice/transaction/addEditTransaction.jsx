import React, { useState, useEffect } from "react";

import {
    Button,
  } from '@chakra-ui/react';

const AddEditTransaction = (props) => {

    return (

        <Button
        onClick={() => handleAddNewTransaction("lg")}
        key="xl"
        m={1}
        >{`Add New Transaction`}
    </Button>  
      

 
    );
};

export default AddEditTransaction;