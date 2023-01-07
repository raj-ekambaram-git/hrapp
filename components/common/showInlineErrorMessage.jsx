export { ShowInlineErrorMessage };
import {
    Text
  } from '@chakra-ui/react'

function ShowInlineErrorMessage(props) {
    return (
        <>
            {props.showErrorMessage ? (
                <>
                <Text color="timesheet.entryError">{props.showErrorMessage}</Text>
                </>
            ) : (
                <>
                </>
            )}     
        </>
    );
}






  