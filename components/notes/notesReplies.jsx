
import {
    Box,
    Card,
    CardBody,
    Stack,
    Divider,
    CardFooter,
    CardHeader,
    Textarea,
    Button
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EMPTY_STRING } from '../../constants';
import { ErrorMessage } from '../../constants/errorMessage';
import { util } from '../../helpers/util';
import { notesService, userService } from '../../services';
import { setReplies } from '../../store/modules/Notes/actions';
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";


function NotesReplies(props) {
    const dispatch = useDispatch();
    const [replyValue, setReplyValue] = useState(EMPTY_STRING);
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const [enableAddReply, setEnableAddReply] = useState(false);

    const noteReplies = useSelector(state => state.notes.replies);
    const notesType = useSelector(state => state.notes.notesType);
    const selecteRepliesNote = useSelector(state => state.notes.selecteRepliesNote);
    const noteId = props.noteId;

    async function handleReplySubmit() {
        if(replyValue != undefined && replyValue != EMPTY_STRING) {
            const responseData = await notesService.createReply(notesType?.type, notesType?.typeId, replyValue, userService.userValue?.id, noteId);
            if(!responseData.error) {
                dispatch(setReplies(responseData));
            }else {
                setShowErrorMessage(responseData.errorMessage)
            }
            setReplyValue(EMPTY_STRING);
        }else {
            setShowErrorMessage(ErrorMessage.REPLY_REQUIRED);
            return;
        }    
    }

    return (
        <>
            {selecteRepliesNote === noteId ? (<>
                <Stack spacing={2} marginBottom={3} marginTop={4} marginLeft={12} marginRight={4}>
                    <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                    <Box border={1}>
                        <Textarea border='1px' value={replyValue} onChange={(ev) => setReplyValue(ev.target.value)} placeholder="Add Reply"/>     
                    </Box>
                    <Box>
                        <Button colorScheme='red' onClick={handleReplySubmit}>Reply</Button>   
                    </Box>            
                </Stack>
                <Card variant="replies"> 
                    <CardHeader>
                        Replies
                    </CardHeader>
                        <CardBody>
                        {noteReplies?.map((reply) => (
                            <Box> 
                                {reply.repliesRelation?.length>0 ? (<>
                                    {reply.repliesRelation?.map((replyRelation) => (
                                        <>
                                        {}
                                        {noteId === replyRelation.id ? (<>
                                            <Card variant='replyDetails'>
                                                <CardBody>
                                                    {reply.notes}
                                                </CardBody>
                                                <Divider/>
                                                <CardFooter>
                                                    <Box>
                                                        Replied By&nbsp;<b>{reply.createdUser?.firstName} {reply.createdUser?.lastName}</b>&nbsp;on&nbsp; <b>{util.getFormattedDateWithTime(reply.lastUpdateDate)}</b>&nbsp;
                                                    </Box>   
                                                </CardFooter>    
                                            </Card>                                                                         
                                        </>) : (<></>)}
                                        </>
                                    ))}
                                </>) : (<></>)}
                            </Box>
                        ))}  
                    </CardBody> 
                </Card>                
            </>) : (<></>)}
        
        </>
    );
};

export default NotesReplies;




  