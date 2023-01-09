
import {
  Tr,
  Th,
  HStack,
  Button,
  Badge
  } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { USER_ROLE_DESC } from "../../constants/accountConstants";
import { setSelectedUserId } from '../../store/modules/User/actions';



function UserListForAccount(props) {
  const dispatch = useDispatch();
  const router = useRouter();

  function handleUserEditSelection(userId){
    dispatch(setSelectedUserId(userId))
    router.push("/account/user/edit");

  }

  const usersList = props.usersList;
    return (
        <>
        {usersList?.map((user) => (        
          <Tr>
              <Th>
              {user.id}
              </Th>
              <Th>
                {user.firstName}
              </Th>
              <Th>
                {user.lastName}
              </Th>
              <Th>
                {user.email}
              </Th>
              <Th>
                {user.role ? (<>{USER_ROLE_DESC[user.role]}</>) : "N/A"}
              </Th>
              <Th>
                {user.account.name}
              </Th>
              <Th>
                {user.vendor ? (
                  <>{user.vendor.name}</>
                ) : "N/A"}
              </Th>
              <Th>
                {user.createdDate}
              </Th>
              <Th>
                <HStack>
                  <Button onClick={() => handleUserEditSelection(user.id)}>
                    Edit
                  </Button>                  
                  <Badge color={`${
                      user.status === "Active"
                        ? "paid_status"
                        : user.status === "Inactive"
                        ? "pending_status"
                        : "pending_status"
                    }`}>{user.status}</Badge>
                </HStack>
              </Th>
              
          </Tr>    
        ))} 
        </>
    );
}

export { UserListForAccount };