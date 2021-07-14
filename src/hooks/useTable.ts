import { useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';
import isFunction from 'lodash/isFunction';
import find from 'lodash/find';
import debounce from 'lodash/debounce';

import {
  Filter,
  ReturnTable,
  Sort,
  TableColumn,
  TableHeaderProps,
  TableProps,
} from './useTable.types';

const filterData = <T>(data: T[], filters: Filter[]): T[] => {
  let result = data;

  if (!isEmpty(filters)) {
    result = filter(data, (row: any) => {
      let match = false;

      for (let i = 0; i < filters.length; i++) {
        const value = row[filters[i].accessor];
        const filterValue = filters[i].filterValue;

        switch (typeof value) {
          case 'string':
            match = value.toLowerCase().includes(filterValue.toLowerCase());
            break;
          case 'number':
            match = value === parseInt(filterValue);
            break;
        }

        if (match === false) {
          break;
        }
      }

      return match;
    });
  }

  return result;
};

const sortData = <T>(data: T[], sorts: Sort[]): T[] => {
  let result = data;

  if (!isEmpty(sorts)) {
    const fields = sorts.map((sort) => sort.accessor);
    const sortOrders: any = sorts.map((sort) => sort.sortOrder);
    result = orderBy(data, fields, sortOrders);
  }

  return result;
};

function useTable<T extends { [key:string]: any }>({
  columns,
  data,
  sorts,
  filters,
}: TableProps<T>): ReturnTable {
  const [sortsState, setSortsState] = useState<Sort[]>(() =>
    isEmpty(sorts) ? [] : sorts
  );
  const [filtersState, setFiltersState] = useState<Filter[]>(() =>
    isEmpty(filters) ? [] : filters
  );
  const [headers, setHeaders] = useState<TableColumn<T>[]>(columns);

  const filteredRows = useMemo<T[]>(
    () => filterData(data, filtersState),
    [data, filtersState]
  );
  const rows = useMemo<T[]>(
    () => sortData(filteredRows, sortsState),
    [filteredRows, sortsState]
  );
  const accessors = columns.map((column) => column.accessor);
  const resultHeaders = headers.map((column, i) => {
    const colHeader = column.header;
    let headerProps: TableHeaderProps;
    let setFilter: any;

    if (column.sorting) {
      const onClick = (e: any) => {
        const sortOrder =
          isEmpty(column.sortOrder) || column.sortOrder === 'asc'
            ? 'desc'
            : 'asc';
        headers[i] = { ...column, sortOrder };
        setHeaders([...headers]);
        setSortsState(
          uniqBy(
            [
              { accessor: column.accessor, sortOrder: sortOrder },
              ...sortsState,
            ],
            'accessor'
          )
        );
      };

      headerProps = {
        onClick,
        style: { cursor: 'pointer' },
      };
    }

    if (isFunction(column.filtering)) {
      setFilter = debounce((value: string) => {
        setFiltersState(
          uniqBy(
            [
              { accessor: column.accessor, filterValue: value },
              ...filtersState,
            ],
            'accessor'
          )
        );
      }, 85);
    }

    const getSortOrder = () => {
      const sort = find(sortsState, { accessor: column.accessor });
      return sort ? sort.sortOrder : undefined;
    };

    return {
      getHeaderProps: () => {
        return { ...headerProps };
      },
      getClassName: (className: string) => {
        return `${className} ${column.accessor}`;
      },
      render: () => {
        return colHeader;
      },
      sortOrder: getSortOrder(),
      // getSortOrder: () => {
      //   const sort = find(sortsState, { accessor: column.accessor });
      //   return sort ? sort.sortOrder : '';
      // },
      filterValue: column.filterValue,
      setFilter,
      renderFilter:
        column.filtering && isFunction(column.filtering)
          ? () => {
              return column.filtering?.({
                filterValue: find(filtersState, { accessor: column.accessor })
                  ?.filterValue,
                setFilter,
              });
            }
          : undefined,
    };
  });

  const resultRows = rows.map((item) => {
    const cells = Object.keys(item)
      .filter((key) => accessors.includes(key))
      .map((key) => {
        return {
          getCellProps: () => ({}),
          getClassName: (className: string) => {
            return `${className} ${key}`;
          },
          render: () => {
            const column = find(columns, { accessor: key });

            return column && isFunction(column.render)
              ? column.render(item[key])
              : item[key];
          },
        };
      });

    return {
      cells,
    };
  });

  return {
    headers: resultHeaders,
    rows: resultRows,
    sorts: sortsState,
    filters: filtersState,
  };
}

export default useTable;
