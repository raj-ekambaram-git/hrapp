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
                  Resource
                </Th>
                <Th>
                  Hours
                </Th>
                <Th>
                  Dates
                </Th>

              </Tr>
            </Thead>
            <Tbody>                            
            {props.costItemList?.map((costItem, index) => (
                <Tr>
                  <Th>
                    <DeleteIcon color="red" onClick={() => deleteCostItem(index,costItem.notes.split("_")[0], costItem.amount)}/>
                  </Th>
                  <Th>
                    {costItem.type}
                  </Th>
                  <Th>
                    {util.getWithCurrency(costItem.amount)}
                  </Th>
                  <Th>
                      {costItem.notes.split("_")[2]?.split(":")[1]}                                                                       
                  </Th>
                  <Th>
                      {costItem.notes.split("_")[4]?.split(":")[1]}                                                                       
                  </Th>
                  <Th>
                      {util.getFormattedDate(costItem.notes.split("_")[5]?.split(":")[1])} - {util.getFormattedDate(costItem.notes.split("_")[6]?.split(":")[1])}                                                                                                                                          
                  </Th>                  
                </Tr>
              ))}                                        


            </Tbody>
          </Table>
        </TableContainer>

        </>
    );
}
