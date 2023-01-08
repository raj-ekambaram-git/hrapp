
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
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EMPTY_STRING } from '../../constants';
import { util } from '../../helpers/util';


function NotesReplies(props) {
    const dispatch = useDispatch();
    const [replyValue, setReplyValue] = useState(EMPTY_STRING);

    const noteReplies = useSelector(state => state.notes.replies);
    const noteId = props.noteId;


    function handleReplySubmit() {

    }

    return (
        <>
            {noteReplies?.map((reply) => (
                <Box> 
                    {reply.repliesRelation?.length>0 ? (<>
                        {reply.repliesRelation?.map((replyRelation) => (
                            <>
                            {noteId === replyRelation.id ? (<>
                                <Stack spacing={2} marginBottom={3} marginTop={4} marginLeft={12} marginRight={4}>
                                    <Box border={1}>
                                        <Textarea border='1px' value={replyValue} onChange={(ev) => setReply(ev.target.value)} placeholder="Add Reply"/>     
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
                                        {reply.notes}
                                    </CardBody>
                                    <Divider/>
                                    <CardFooter>
                                        <Box>
                                            By&nbsp;<b>{reply.createdUser?.firstName} {reply.createdUser?.lastName}</b>&nbsp;on&nbsp; <b>{util.getFormattedDateWithTime(reply.lastUpdateDate)}</b>&nbsp;
                                        </Box>   
                                    </CardFooter>                                 
                                </Card>
                            </>) : (<></>)}
                            </>
                        ))}
                    </>) : (<></>)}
                </Box>
            ))}   
        </>
    );
};

export default NotesReplies;




  