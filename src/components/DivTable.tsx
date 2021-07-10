import { useEffect } from 'react';

import useTable from '../hooks/useTable';
import { VirtualScroller2 } from './VirtualScroller';

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
      className="filter-input"
      value={filterValue || ''}
      onChange={changeHandler}
      onClick={clickHandler}
    />
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

  const settings2 = {
    itemHeight: 40,
    amount: 10,
    tolerance: 0,
    minIndex: 0,
    maxIndex: rows.length - 1,
    startIndex: 1,
  };

  const getData2 = (offset: any, limit: any) => {
    console.log('getData2 getData2 getData2 getData2 getData2', offset, limit);
    const dataResult = [];
    const start = Math.max(settings2.minIndex, offset);
    const end = Math.min(offset + limit - 1, settings2.maxIndex);
    console.log(
      `request [${offset}..${offset + limit - 1}] -> [${start}..${end}] items`
    );
    if (start <= end) {
      for (let i = start; i <= end; i++) {
        dataResult.push(data[i]);
      }
    }
    return dataResult;
  };

  useEffect(() => {
    onTableQueryChange && onTableQueryChange(sorts, filters);
  }, [sorts, filters, onTableQueryChange]);

  return (
    <div className="table">
      <div className="header-container">
        <div className="headers">
          {headers.map((column: any) => (
            <div className={column.getClassName('header-column')} {...column.getHeaderProps()}>
              {column.render()} {column.getSortOrder()}{' '}
              {column.renderFilter && column.renderFilter()}
            </div>
          ))}
        </div>
      </div>
      <div>
        <VirtualScroller2
          className="content-viewport"
          getData={getData2}
          settings={settings2}
          row={null}
        >
          {({ index }: any) => {
            console.log('VirtualScroller2 child', index);

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
        </VirtualScroller2>
        {/* {rows.map((row: any, i: number) => {
                return (
                  <tr>
                    {row.cells.map((cell: any) => {
                      return <td>{cell.render()}</td>;
                    })}
                  </tr>
                );
              })} */}
        {/* {rows.map((row: any, i: number) => {
                return (
                  <tr>
                    {row.cells.map((cell: any) => {
                      return <td>{cell.render()}</td>;
                    })}
                  </tr>
                );
              })} */}
      </div>
    </div>
  );
}
