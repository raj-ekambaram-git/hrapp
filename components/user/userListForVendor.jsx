import Link from "next/link";
import {
  Tr,
  Th,
  HStack,
  Button,
  Badge
  } from '@chakra-ui/react'
import { USER_ROLE_DESC } from "../../constants/accountConstants";

function UserListForVendor(props) {
  const usersList = props.usersList;
    return (
        <>
        {usersList?.map((user) => (        
          <Tr>
              <Th>
                {user.user?.id}
              </Th>
              <Th>
                {user.user?.firstName}
              </Th>
              <Th>
                {user.user?.lastName}
              </Th>
              <Th>
                {user.user?.email}
              </Th>
              <Th>
                {user.user?.role ? (<>{USER_ROLE_DESC[user.user?.role]}</>) : "N/A"}
              </Th>
              <Th>
                {user.vendor?.account?.name}
              </Th>
              <Th>
                {user.vendor ? (
                  <>{user.vendor?.name}</>
                ) : "N/A"}
              </Th>
              <Th>
                {user.user?.createdDate}
              </Th>
              <Th>
                <HStack>
                  <Link href={`/account/user/${user.user?.id}`} passref key={user.user?.id}>
                    <Button size="xs" bgColor="header_actions">
                      Details
                    </Button>
                  </Link>
                  <Badge color={`${
                      user.user?.status === "Active"
                        ? "paid_status"
                        : user.user?.status === "Inactive"
                        ? "pending_status"
                        : "pending_status"
                    }`}>{user.user?.status}</Badge>
                </HStack>
              </Th>
              
          </Tr>    
        ))} 
        </>
    );
}

export { UserListForVendor };