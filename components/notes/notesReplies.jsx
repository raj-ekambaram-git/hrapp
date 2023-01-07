
import {
    Box,
    Card,
    CardBody,
    Divider
  } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';

function NotesReplies(props) {
    const dispatch = useDispatch();
    const noteReplies = useSelector(state => state.notes.replies);
    const noteId = props.noteId;
    return (
        <>
            {noteReplies?.map((reply) => (
                <Box> 
                    {reply.repliesRelation?.length>0 ? (<>
                        {reply.repliesRelation?.map((replyRelation) => (
                            <>
                            {noteId === replyRelation.id ? (<>
                                <Card variant="replies"> 
                                    <CardBody>
                                        {reply.notes}
                                    </CardBody>
                                    <Divider/>
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




  