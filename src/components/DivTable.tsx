import { useEffect } from 'react';

import useTable from '../hooks/useTable';
import VirtualScroller from './VirtualScroller';

import './DivTable.css';

export const TextFilter = ({ filterValue, setFilter }: any) => {
  const clickHandler = (e: any) => {
    e.stopPropagation();
  };

  const changeHandler = (e: any) => {
    setFilter(e.target.value);
  };

  return (
    <input
      className="filter-input no-focusborder"
      placeholder="search..."
      value={filterValue || ''}
      onChange={changeHandler}
      onClick={clickHandler}
    />
  );
};

export const Select = ({ data, filterValue, setFilter }: any) => {
  const changeHandler = ({ target: { value } }: any) => setFilter(value);

  return (
    <select
      className="filter-select no-focusborder"
      value={filterValue}
      onChange={changeHandler}
    >
      {data.map(({ value, text }: any, i: number) => (
        <option key={i} value={value}>
          {text}
        </option>
      ))}
    </select>
  );
};

export function DivTable({
  columns,
  data,
  tableQuery,
  onTableQueryChange,
}: any) {
  const { headers, rows, sorts, filters } = useTable({
    columns,
    data,
    sorts: tableQuery.sorts,
    filters: tableQuery.filters,
  });

  const settings = {
    itemHeight: 40,
    amount: 10,
    tolerance: 0,
    minIndex: 0,
    maxIndex: rows.length - 1,
    startIndex: 1,
  };

  const renderSortOrder = (sortOrder: string) => {
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
          {headers.map((column: any, i: number) => (
            <div
              key={i}
              className={column.getClassName('header-column')}
              {...column.getHeaderProps()}
            >
              <div className="header-text">
                {column.render()} {renderSortOrder(column.getSortOrder())}
              </div>
              {column.renderFilter && column.renderFilter()}
            </div>
          ))}
        </div>
      </div>
      <div>
        <VirtualScroller
          className="content-viewport"
          settings={settings}
        >
          {({ index }: any) => {
            const row = rows[index];
            const styleClass = index % 2 ? 'even' : 'odd';

            return (
              <div className={`row ${styleClass}`} key={index}>
                {row?.cells.map((cell: any, j: number) => {
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
