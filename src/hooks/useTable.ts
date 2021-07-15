import { useMemo, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import orderBy from 'lodash/orderBy'
import filter from 'lodash/filter'
import isFunction from 'lodash/isFunction'
import find from 'lodash/find'
import debounce from 'lodash/debounce'

import {
  Column,
  Filter,
  ReturnTable,
  Sort,
  TableColumn,
  TableHeaderProps,
  TableProps,
  TableQuery,
} from './useTable.types'

export const addTableQueryToColumns = <T>(columns: Column<T>[], tableQuery: TableQuery): Column<T>[] => {
  if (isEmpty(columns) || isEmpty(tableQuery) || (isEmpty(tableQuery.sorts) && isEmpty(tableQuery.filters)))
    return columns

  return columns.map((column) => {
    const sort = find(tableQuery.sorts, { accessor: column.accessor })
    const filter = find(tableQuery.filters, { accessor: column.accessor })

    return {
      ...column,
      sortOrder: sort?.sort,
      filterValue: filter?.filterValue,
    }
  })
}

const filterData = <T>(data: T[], columns: Column<T>[]): T[] => {
  const filters = columns.filter((column) => column.filter && column.filterValue)
  let result = data

  if (!isEmpty(filters)) {
    result = filter(data, (row: any) => {
      let match = false

      for (let i = 0; i < filters.length; i++) {
        const value = row[filters[i].accessor]
        const filterValue = filters[i].filterValue as string

        switch (typeof value) {
          case 'string':
            match = value.toLowerCase().includes(filterValue.toLowerCase())
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
    result = filter(columns, (column) => !!column.filter && !!column.filterValue).map((column) => ({
      accessor: column.accessor,
      filterValue: column.filterValue as string,
    }))
  }

  return result
}

const getSorts = <T>(columns: TableColumn<T>[]): Sort[] => {
  let result: Sort[] = []

  if (!isEmpty(columns)) {
    result = filter(columns, (column) => !isEmpty(column.sortOrder)).map((column) => ({
      accessor: column.accessor,
      sort: column.sortOrder,
    }))
  }

  return result
}

function useTable<T extends { [key: string]: any }>({ columns, data }: TableProps<T>): ReturnTable {
  const [headers, setHeaders] = useState<TableColumn<T>[]>(columns)

  const filteredRows = useMemo<T[]>(() => filterData(data, headers), [data, headers])
  const rows = useMemo<T[]>(() => sortData(filteredRows, headers), [filteredRows, headers])
  const accessors = columns.map((column) => column.accessor)
  const resultHeaders = headers.map((column, i) => {
    const colHeader = column.header
    let headerProps: TableHeaderProps
    let setFilter: any

    if (column.sort) {
      const onClick = () => {
        const sortOrder = isEmpty(column.sortOrder) || column.sortOrder === 'asc' ? 'desc' : 'asc'
        headers[i] = { ...column, sortOrder: sortOrder }
        setHeaders([...headers])
      }

      headerProps = {
        onClick,
        style: { cursor: 'pointer' },
      }
    }

    if (isFunction(column.filter)) {
      setFilter = debounce((value: string) => {
        headers[i] = { ...column, filterValue: value }
        setHeaders([...headers])
      }, 85)
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
                filterValue: find(headers, { accessor: column.accessor })?.filterValue,
                setFilter,
              })
            }
          : undefined,
    }
  })

  const resultRows = rows.map((item) => {
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
  })

  return {
    headers: resultHeaders,
    rows: resultRows,
    sorts: getSorts(headers),
    filters: getFilters(headers),
  }
}

export default useTable
