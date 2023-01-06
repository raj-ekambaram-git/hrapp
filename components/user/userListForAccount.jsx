import Link from "next/link";
import {
  Tr,
  Th,
  HStack,
  Button,
  Badge
  } from '@chakra-ui/react'
import { USER_ROLE_DESC } from "../../constants/accountConstants";

function UserListForAccount(props) {
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
                  <Link href={`/account/user/${user.id}`} passref key={user.id}>
                    <Button className="btn">
                      Details
                    </Button>
                  </Link>
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