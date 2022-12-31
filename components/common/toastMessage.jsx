import { useState, useEffect } from 'react';
import {
    useToast
  } from '@chakra-ui/react'
export { useToastSuccess, useToastError };


function useToastSuccess(title, description) {
    const toast = useToast();
    toast({
        title: "Title",
        description: description,
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
}


function useToastError({ title, description }) {
    const toast = useToast();
    toast({
        title: title,
        description: description,
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      });
}