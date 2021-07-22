import { useEffect, useMemo, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import orderBy from 'lodash/orderBy'
import filter from 'lodash/filter'
import isFunction from 'lodash/isFunction'
import find from 'lodash/find'
import trim from 'lodash/trim'
import trimStart from 'lodash/trimStart'

import {
  Column,
  Filter,
  ReturnTable,
  Sort,
  TableColumn,
  TableHeaderProps,
  TableProps,
  TableQuery,
} from './useTable.type'
import { sortByAccessor } from '../common/utils'

export const addTableQueryToColumns = <T>(columns: Column<T>[], tableQuery: TableQuery): Column<T>[] => {
  if (isEmpty(columns) || isEmpty(tableQuery) || (isEmpty(tableQuery.sorts) && isEmpty(tableQuery.filters)))
    return columns

  return columns.map((column) => {
    const sort = find(tableQuery.sorts, { accessor: column.accessor })
    const filter = find(tableQuery.filters, { accessor: column.accessor })

    return {
      ...column,
      sortOrder: sort?.sort,
      filterValue: trim(filter?.filterValue),
    }
  })
}

const filterData = <T>(data: T[], columns: Column<T>[]): T[] => {
  const filters = columns.filter((column) => !!column.filter && !!trim(column.filterValue))
  let result = data

  if (!isEmpty(filters)) {
    result = filter(data, (row: any) => {
      let match = false

      for (let i = 0; i < filters.length; i++) {
        const value = row[filters[i].accessor]
        const filterValue = trim(filters[i].filterValue).toLowerCase()

        switch (typeof value) {
          case 'string':
            match = value.toLowerCase().includes(filterValue)
            break
          case 'number':
            match = value === parseInt(filterValue)
            break
        }

        if (match === false) {
          break
        }
      }

      return match
    })
  }

  return result
}

const sortData = <T>(data: T[], columns: Column<T>[]): T[] => {
  let result = data

  if (!isEmpty(columns)) {
    const { fields, sortOrders } = columns
      .filter((column) => !isEmpty(column.sortOrder))
      .reduce(
        (accum, currentValue) => {
          accum.fields.push(currentValue.accessor)
          accum.sortOrders.push(currentValue.sortOrder)
          return accum
        },
        { fields: [] as string[], sortOrders: [] as any[] }
      )
    result = orderBy(data, fields, sortOrders)
  }

  return result
}

const getFilters = <T>(columns: TableColumn<T>[]): Filter[] => {
  let result: Filter[] = []

  if (!isEmpty(columns)) {
    result = filter(columns, (column) => !!column.filter && !!trim(column.filterValue))
      .map((column) => ({
        accessor: column.accessor,
        filterValue: trim(column.filterValue),
      }))
      .sort(sortByAccessor)
  }

  return result
}

const getSorts = <T>(columns: TableColumn<T>[]): Sort[] => {
  let result: Sort[] = []

  if (!isEmpty(columns)) {
    result = filter(columns, (column) => !isEmpty(column.sortOrder))
      .map((column) => ({
        accessor: column.accessor,
        sort: column.sortOrder,
      }))
      .sort(sortByAccessor)
  }

  return result
}

function useTable<T extends { [key: string]: any }>({ columns, data }: TableProps<T>): ReturnTable {
  const [headers, setHeaders] = useState<TableColumn<T>[]>(columns)

  const filters = useMemo(() => getFilters(headers), [headers])
  const sorts = useMemo(() => getSorts(headers), [headers])
  const filteredRows = useMemo<T[]>(() => filterData(data, headers), [data, headers])
  const rows = useMemo<T[]>(() => sortData(filteredRows, headers), [filteredRows, headers])
  const accessors = useMemo(() => headers.map((column) => column.accessor), [headers])
  const resultHeaders = useMemo(
    () =>
      headers.map((column, i) => {
        const colHeader = column.header
        let headerProps: TableHeaderProps
        let setFilter: any

        if (column.sort) {
          const onClick = () => {
            const sortOrder = isEmpty(column.sortOrder) ? 'desc' : column.sortOrder === 'desc' ? 'asc' : undefined
            headers[i] = { ...column, sortOrder }
            setHeaders([...headers])
          }

          headerProps = {
            onClick,
            style: { cursor: 'pointer' },
          }
        }

        if (isFunction(column.filter)) {
          setFilter = (value: string) => {
            headers[i] = { ...column, filterValue: trimStart(value).replace(/ {1,}/g, ' ') }
            setHeaders([...headers])
          }
        }

        return {
          getHeaderProps: () => {
            return { ...headerProps }
          },
          getClassName: (className: string) => {
            const classNames = [className, column.accessor]

            if (column.sort) {
              classNames.push('sortable')
            }

            return classNames.join(' ')
          },
          render: () => {
            return colHeader
          },
          sortOrder: column.sortOrder,
          filterValue: column.filterValue,
          setFilter,
          renderFilter:
            column.filter && isFunction(column.filter)
              ? () => {
                  return column.filter?.({
                    filterValue: column.filterValue,
                    setFilter,
                  })
                }
              : undefined,
        }
      }),
    [headers]
  )

  const resultRows = useMemo(
    () =>
      rows.map((item) => {
        const cells = Object.keys(item)
          .filter((key) => accessors.includes(key))
          .map((key) => {
            return {
              getCellProps: () => ({}),
              getClassName: (className: string) => {
                return `${className} ${key}`
              },
              render: () => {
                const column = find(columns, { accessor: key })

                return column && isFunction(column.render) ? column.render(item[key]) : item[key]
              },
            }
          })

        return {
          cells,
        }
      }),
    [accessors, columns, rows]
  )

  useEffect(() => {
    setHeaders(columns)
  }, [columns])

  return {
    headers: resultHeaders,
    rows: resultRows,
    sorts,
    filters,
  }
}

export default useTable
