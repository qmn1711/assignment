import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';
import isFunction from 'lodash/isFunction';
import find from 'lodash/find';
import debounce from 'lodash/debounce';

const useTable = ({ columns, data, sorts, filters }: any) => {
  const [sortsState, setSortsState] = useState<any[]>(() =>
    isEmpty(sorts) ? [] : sorts
  );
  const [filtersState, setFiltersState] = useState<any>(() =>
    isEmpty(filters) ? [] : filters
  );
  const [headers, setHeaders] = useState<any[]>(columns);
  const [rows, setRows] = useState<any[]>(data);

  useEffect(() => {
    if (!isEmpty(sortsState)) {
      const fields = sortsState.map((sort) => sort.accessor);
      const sortOrders = sortsState.map((sort) => sort.sortOrder);
      setRows((rows) => orderBy(rows, fields, sortOrders));
    }
  }, [sortsState]);

  useEffect(() => {
    if (!isEmpty(filtersState)) {
      setRows(
        filter(data, (row: any) => {
          let match = false;

          for (let i = 0; i < filtersState.length; i++) {
            const value = row[filtersState[i].accessor];
            const filterValue = filtersState[i].filterValue;

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
        })
      );
    }
  }, [filtersState, data]);

  const accessors = columns.map((column: any) => column.accessor); // TODO use reduce for only one loop
  const resultHeaders = headers.map((column: any, i: number) => {
    const colHeader = column.header;
    const headerProps: any = {};
    let setFilter: any;

    // TODO adapt the props from url query
    if (column.sorting) {
      headerProps.onClick = (e: any) => {
        // sorting
        // update state sorting
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

      headerProps.style = { cursor: 'pointer' };
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
      sortOrder: column.sortOrder,
      getSortOrder: () => {
        const sort = find(sortsState, { accessor: column.accessor });
        return sort ? sort.sortOrder : '';
      },
      filterValue: column.filterValue,
      setFilter,
      renderFilter: isFunction(column.filtering)
        ? () => {
            return column.filtering({
              filterValue: find(filtersState, { accessor: column.accessor })
                ?.filterValue,
              setFilter,
            });
          }
        : undefined,
    };
  });
  const resultRows = rows.map((item: any) => {
    const cells = Object.keys(item)
      .filter((key) => accessors.includes(key))
      .map((key) => {
        return {
          getCellProps: () => {},
          getClassName: (className: string) => {
            return `${className} ${key}`;
          },
          render: () => {
            const column = find(columns, { accessor: key });
            if (column && isFunction(column.render)) {
            }

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
};

export default useTable;
