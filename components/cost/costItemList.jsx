export { CostItemList };
  import { DeleteIcon } from '@chakra-ui/icons';
import {
    Stack,
    Table,
    Tr,
    Th,
    TableContainer,
    Tbody,
    Thead,
    HStack,
    Box,
    Td
  } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { util } from '../../helpers';
import { removeItemFromCostItemList, removeTSFromSelectedCost, setCostTotal } from '../../store/modules/Cost/actions';

function CostItemList(props) {
  const dispatch = useDispatch()

  const costTotal = useSelector(state => state.cost.costTotal);

  function deleteCostItem(removeIndex, costItemId, costItemTotal) {
    dispatch(removeItemFromCostItemList(removeIndex));   
    dispatch(removeTSFromSelectedCost(costItemId));   

    if(costItemTotal != undefined) {
        dispatch(setCostTotal(parseFloat(costTotal)-parseFloat(costItemTotal)));
    }else {
      dispatch(setCostTotal(parseFloat(costItemTotal)));
    }
  }
    return (
        <>
        <TableContainer>
          <Table variant="sortTable">
            <Thead>
              <Tr>
                <Th>

                </Th>
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
            {props.costItemList?.map((costItem, index) => (
                <Tr>
                  <Th>
                    <DeleteIcon onClick={() => deleteCostItem(index,costItem.notes.split("_")[0], costItem.amount)}/>
                  </Th>
                  <Th>
                    {costItem.type}
                  </Th>
                  <Th>
                    {util.getWithCurrency(costItem.amount)}
                  </Th>
                  <Th>
                    <Td>
                      {costItem.notes.split("_")?.map((note, index) => (
                        <>
                        {note}
                        </>
                      ))}                                                                        
                    </Td>     
                  </Th>

                </Tr>
              ))}                                        


            </Tbody>
          </Table>
        </TableContainer>

        </>
    );
}
