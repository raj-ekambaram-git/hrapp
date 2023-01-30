export { CostItemList };
import {
    Flex,
    Heading,
    Table,
    Tr,
    Th,
    TableContainer,
    Tbody,
    Thead
  } from '@chakra-ui/react'

function CostItemList(props) {
    return (
        <>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  Type
                </Th>
                <Th>
                  Amount
                </Th>
                <Th>
                  Notes
                </Th>
              </Tr>
            </Thead>
            <Tbody>                            
            {props.costItemList?.map((costItem) => (
                <Tr>
                  <Th>
                    {costItem.type}
                  </Th>
                  <Th>
                    {costItem.amount}
                  </Th>
                  <Th>
                    {costItem.notes}
                  </Th>

                </Tr>
              ))}                                        


            </Tbody>
          </Table>
        </TableContainer>

        </>
    );
}
