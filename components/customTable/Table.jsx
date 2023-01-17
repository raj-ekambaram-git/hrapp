
import { useState, useMemo } from 'react'
import { sortRows, filterRows, paginateRows } from './helpers'
import { Pagination } from './Pagination'
import { Input, Table, Tbody, Td, Th, Thead, Tr,Flex, TableContainer } from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

export const CustomTable = ({ columns, rows, disablePagination }) => {
  const [activePage, setActivePage] = useState(1)
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState({ order: 'desc', orderBy: 'id' })
  const rowsPerPage = 15

  const filteredRows = useMemo(() => filterRows(rows, filters), [rows, filters])
  const sortedRows = useMemo(() => sortRows(filteredRows, sort), [filteredRows, sort])
  const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage)

  const count = filteredRows.length
  const totalPages = Math.ceil(count / rowsPerPage)

  const handleSearch = (value, accessor) => {
    setActivePage(1)

    if (value) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [accessor]: value,
      }))
    } else {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters }
        delete updatedFilters[accessor]

        return updatedFilters
      })
    }
  }

  const handleSort = (accessor) => {
    setActivePage(1)
    setSort((prevSort) => ({
      order: prevSort.order === 'asc' && prevSort.orderBy === accessor ? 'desc' : 'asc',
      orderBy: accessor,
    }))
  }

  const clearAll = () => {
    setSort({ order: 'asc', orderBy: 'id' })
    setActivePage(1)
    setFilters({})
  }

  return (
    <>
    <TableContainer>
      <Table variant="sortTable">
        <Thead>
          <Tr height="10px">
            {columns.map((column) => {
              const sortIcon = () => {
                if (column.accessor === sort.orderBy) {
                  if (sort.order === 'asc') {
                    return <ChevronUpIcon ml={1} w={4} h={4} />
                  }
                  return <ChevronDownIcon ml={1} w={4} h={4} />
                } else {
                  return '️'
                }
              }
              return (
                <Th key={column.accessor}>
                    <Flex alignItems="center" onClick={() => handleSort(column.accessor)}>
                    {column.label}{sortIcon()}
                  </Flex>
                </Th>
              )
            })}
          </Tr>
          <Tr bgColor="white">
            {columns.map((column) => {
              return (
                <Th>
                  {column.disableSearch ? (<></>) : (<>
                    <Input size="xs"
                      key={`${column.accessor}-search`}
                      type="search"
                      placeholder={`Search ${column.label}`}
                      value={filters[column.accessor]}
                      onChange={(event) => handleSearch(event.target.value, column.accessor)}
                    />

                  </>)}
                </Th>
              )
            })}
          </Tr>
        </Thead>
        <Tbody>
          {calculatedRows.map((row) => {
            return (
              <Tr key={row.id}>
                {columns.map((column) => {
                  if (column.format) {
                    return <Td key={column.accessor}>{column.format(row[column.accessor])}</Td>
                  }
                //   return <Td key={column.accessor}>{column.render("Cell")}</Td>
                  return <Td key={column.accessor}>{row[column.accessor]}</Td>
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      </TableContainer>

      {(!disablePagination && count > 0) ? (
        <Pagination
          activePage={activePage}
          count={count}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          setActivePage={setActivePage}
        />
      ) : (!disablePagination && count == 0) ? (
        <p>No data found</p>
      ): (<></>)}

      {/* <div>
        <p>
          <Button onClick={clearAll}>Clear all</Button>
        </p>
      </div> */}
    </>
  )
}
