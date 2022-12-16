import Link from "next/link";
import { useRouter } from "next/router";
import { accountService, userService } from "../../services";
import { useState, useEffect } from "react";
import {
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Box,
  Flex,
  Heading,
  TableContainer,
  TableCaption,
  Badge
} from '@chakra-ui/react'



export default function Home(props) {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  

  //INFO: used for making initial api calls
  useEffect(() => {
    async function performAccountsAPICall() {
      // Call only if the user is SUPER_ADMIN and accountId as zero
      if(userService.isSuperAdmin()) {
        setPageAuthorized(true);
        const accountsListResponse = await accountService.accountsList();
        if (accountsListResponse) {

          const accounts = accountsListResponse.map((account) => {
            return {
              id: account.id.toString(),
              name: account.name,
              createdDate: account.createdDate.toDateString,
              email: account.email,
              ein: account.ein,
              status: account.status,
            };
          });

          setAccounts(accounts);
        }
      }else {
        //Show error message
      }

    }
    performAccountsAPICall();
  }, []);
  
  const navigatePage = () => router.push("/account/add");

  return (

    
    <div>
      {isPageAuthprized ? (
        <div>
              <Flex
                as="nav"
                align="center"
                justify="space-between"
                wrap="wrap"
                padding="1.5rem"
                bg="heading"
                color="white"
                marginBottom="2rem"
                width="100%"
              >
                <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
                  Accounts
                </Heading>
              </Flex>
    
              <Flex marginBottom="2rem">
                <HStack>
                  <Box>
                    <Button className="btn" onClick={navigatePage}>
                      Add New Account 
                    </Button>
                  </Box>
                </HStack>
              </Flex>
    
    
                {/* <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay/>
                  <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      dasfaffafaf
                    </ModalBody>
    
                    <ModalFooter>
                      <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                      </Button>
                      <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>      */}
              <TableContainer>
              <Table>
              <TableCaption></TableCaption>
                <Thead>
                    <Tr bgColor="table_tile">
                      <Th>
                        Account ID
                      </Th>
                      <Th>
                        Account Name
                      </Th>
                      <Th>
                        Account Contact Email
                      </Th>
                      <Th>
                        Account EIN
                      </Th>
                      <Th>
                        Account Created
                      </Th>
                      <Th>
                        Account Status
                      </Th>
    
                    </Tr>   
                  </Thead>                
                  <Tbody>
                    {accounts?.map((account) => (
                      
                      
                      <Tr>
                            <Th>
                              {account.id}
                            </Th>
                            <Th>
                              {account.name}
                            </Th>
                            <Th>
                              {account.email}
                            </Th>
                            <Th>
                              {account.ein}
                            </Th>
                            <Th>
                              {account.createdDate}
                            </Th>
                            <Th>
                              <HStack>
                                <Link href={`/account/${account.id}/detail`} passref key={account.id}>
                                  <Button className="btn">
                                    Details
                                  </Button>
                                </Link>
                                <Badge color={`${
                                    account.status === "Active"
                                      ? "paid_status"
                                      : account.status === "Inactive"
                                      ? "pending_status"
                                      : "pending_status"
                                  }`}>{account.status}</Badge>
                              </HStack>
                            </Th>
                          
                        </Tr>

                    ))}
                </Tbody>    
              </Table>
              </TableContainer>
          </div>
      ) : (
        <> 
          <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg="teal.500"
            color="white"
            marginBottom="2rem"
            width="100%"
          >
            <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
              Not authorized to view this page. Please contact administrator.
            </Heading>
          </Flex>        
        </>
      ) }



      
      </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      data: {
        action: "accountsList"
      }
    },
    revalidate: 1,
  };
}