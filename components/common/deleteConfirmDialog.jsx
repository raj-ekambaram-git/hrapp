import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogOverlay, Button, useDisclosure, AlertDialogHeader } from "@chakra-ui/react"
import React, { useRef } from "react"

export default function DeleteConfirmDialog({ deleteHeader, isOpen, onClose, dialogRef, handleDeleteConfirmation }) {
  const cancelRef = useRef(null);

  return (
    <>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {deleteHeader}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' 
                    onClick={() => handleDeleteConfirmation(dialogRef)}
                    ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
