import { useEffect, useMemo } from 'react'

import useTable from '../../hooks/useTable'
import VirtualScroller from './VirtualScroller'
import { Column, Filter, Sort, SortOrder, TableRow } from '../../hooks/useTable.type'

interface DivTableProps<T> {
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
          <div key={j} className={cell.getClassName('cell truncate-text')}>
            {cell.render()}
          </div>
        )
      })}
    </>
  )
}

const EmptyCells = ({ emptyRow }: { emptyRow: EmptyRow }) => {
  return (
    <>
      {emptyRow.cells.map((cell, j) => {
        return <div key={j} className={`${cell} cell empty`}></div>
      })}
    </>
  )
}

export default function DivTable<T>({ columns, data, onTableQueryChange }: DivTableProps<T>) {
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
    <div className="table">
      <div className="header-container">
        <div className="headers">
          {headers.map((column, i) => (
            <div key={i} className={column.getClassName('header-column')} {...column.getHeaderProps()}>
              <div className="header-text">
                {column.render()} {renderSortOrder(column.sortOrder)}
              </div>
              {column.renderFilter && column.renderFilter()}
            </div>
          ))}
        </div>
      </div>
      <div>
        <VirtualScroller className="content-viewport" itemHeight={40} amount={10} maxIndex={rows.length - 1}>
          {({ index }) => {
            const row = rows[index]
            const styleClass = index % 2 ? 'even' : 'odd'

            return (
              <div className={`row ${styleClass}`} key={index}>
                {row ? <Cells row={row} /> : <EmptyCells emptyRow={emptyRow} />}
              </div>
            )
          }}
        </VirtualScroller>
      </div>
    </div>
  )
}
