import { util } from "../../helpers/util";
import {
   Text
  } from '@chakra-ui/react';

export { NoteFooter };

function NoteFooter(props) {
    const note = props.note;
    return (
        <>
            By&nbsp;<b>{note.createdUser?.firstName} {note.createdUser?.lastName}</b>&nbsp;on&nbsp; <b>{util.getFormattedDateWithTime(note.lastUpdateDate)}</b>&nbsp;
            {note.replies?.length>0 ? (<>
                <Text aign="right">Replies</Text>
            </>) : (<></>)}
        </>
    );
}






  