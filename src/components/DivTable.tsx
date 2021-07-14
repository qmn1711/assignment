import { useEffect } from 'react';

import useTable from '../hooks/useTable';
import VirtualScroller from './VirtualScroller';
import { Column, Filter, Sort, SortOrder } from '../hooks/useTable.types';

interface DivTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onTableQueryChange: (sorts: Sort[], filter: Filter[]) => void;
}

export default function DivTable<T>({
  columns,
  data,
  onTableQueryChange,
}: DivTableProps<T>) {
  const { headers, rows, sorts, filters } = useTable({
    columns,
    data,
  });

  const renderSortOrder = (sortOrder: SortOrder) => {
    if (!sortOrder) return null;

    return <i className={`arrow ${sortOrder === 'asc' ? 'down' : 'up'}`} />;
  };

  useEffect(() => {
    onTableQueryChange && onTableQueryChange(sorts, filters);
  }, [sorts, filters, onTableQueryChange]);

  return (
    <div className="table">
      <div className="header-container">
        <div className="headers">
          {headers.map((column, i) => (
            <div
              key={i}
              className={column.getClassName('header-column')}
              {...column.getHeaderProps()}
            >
              <div className="header-text">
                {column.render()} {renderSortOrder(column.sortOrder)}
              </div>
              {column.renderFilter && column.renderFilter()}
            </div>
          ))}
        </div>
      </div>
      <div>
        <VirtualScroller
          className="content-viewport"
          itemHeight={40}
          amount={10}
          maxIndex={rows.length - 1}
        >
          {({ index }) => {
            const row = rows[index];
            const styleClass = index % 2 ? 'even' : 'odd';

            return (
              <div className={`row ${styleClass}`} key={index}>
                {row?.cells.map((cell, j) => {
                  return (
                    <div className={cell.getClassName('cell')} key={j}>
                      {cell.render()}
                    </div>
                  );
                })}
              </div>
            );
          }}
        </VirtualScroller>
      </div>
    </div>
  );
}
