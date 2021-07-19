import { useEffect, useMemo } from 'react'

import useTable from '../../hooks/useTable'
import TableVirtualScroller from './TableVirtualScroller'
import { Column, Filter, Sort, SortOrder, TableRow } from '../../hooks/useTable.type'

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  onTableQueryChange: (sorts: Sort[], filter: Filter[]) => void
}

interface EmptyRow {
  cells: string[]
}

const Cells = ({ row }: { row: TableRow }) => {
  return (
    <>
      {row.cells.map((cell, j) => {
        return (
          <td key={j} className={cell.getClassName('cell truncate-text')}>
            {cell.render()}
          </td>
        )
      })}
    </>
  )
}

const EmptyCells = ({ emptyRow }: { emptyRow: EmptyRow }) => {
  return (
    <>
      {emptyRow.cells.map((cell, j) => {
        return <td key={j} className={`${cell} cell empty`}></td>
      })}
    </>
  )
}

export default function Table<T>({ columns, data, onTableQueryChange }: TableProps<T>) {
  const { headers, rows, sorts, filters } = useTable({
    columns,
    data,
  })

  const emptyRow = useMemo(() => {
    return columns.reduce(
      (accum, column) => {
        accum.cells.push(column.accessor)
        return accum
      },
      { cells: [] } as EmptyRow
    )
  }, [columns])

  const renderSortOrder = (sortOrder: SortOrder) => {
    if (!sortOrder) return null

    return <i className={`arrow ${sortOrder === 'asc' ? 'down' : 'up'}`} />
  }

  useEffect(() => {
    onTableQueryChange && onTableQueryChange(sorts, filters)
  }, [sorts, filters, onTableQueryChange])

  return (
    <table className="table">
      <thead className="header-container">
        <tr className="headers">
          {headers.map((column, i) => (
            <th key={i} className={column.getClassName('header-column')} {...column.getHeaderProps()}>
              <div className="header-text">
                {column.render()} {renderSortOrder(column.sortOrder)}
              </div>
              {column.renderFilter && column.renderFilter()}
            </th>
          ))}
        </tr>
      </thead>
      <TableVirtualScroller className="content-viewport" itemHeight={40} amount={10} maxIndex={rows.length - 1}>
        {({ index }) => {
          const row = rows[index]
          const styleClass = index % 2 ? 'even' : 'odd'

          return (
            <tr className={`row ${styleClass}`} key={index}>
              {row ? <Cells row={row} /> : <EmptyCells emptyRow={emptyRow} />}
            </tr>
          )
        }}
      </TableVirtualScroller>
    </table>
  )
}
