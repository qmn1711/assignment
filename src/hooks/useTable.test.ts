import { renderHook } from '@testing-library/react-hooks';
import useTable, { addTableQueryToColumns } from './useTable';

const Columns = [
  { header: 'field1', accessor: 'field1' },
  { header: 'field2', accessor: 'field2' },
  { header: 'field3', accessor: 'field3' },
];
const Data = [
  { field1: 'field1 A', field2: 'field2 A', field3: 'field3 A' },
  { field1: 'field1 B', field2: 'field2 B', field3: 'field3 B' },
  { field1: 'field1 B', field2: 'field2 C', field3: 'field3 C' },
  { field1: 'field1 B', field2: 'field2 D', field3: 'field3 D' },
];

const DefaultHeaderColumnStyle = { cursor: 'pointer' };

test('should return table output correctly', () => {
  const simpleInput = {
    columns: Columns,
    data: Data,
    sorts: [],
    filters: [],
  };

  const { result } = renderHook(() => useTable(simpleInput));

  expect(result.current.headers.length).toBe(3);
  const firstColumn = result.current.headers[0];
  expect(firstColumn.getHeaderProps()).toStrictEqual({});
  const columnClassName = 'first-column';
  expect(firstColumn.getClassName(columnClassName)).toBe(
    `${columnClassName} ${Columns[0].accessor}`
  );
  expect(firstColumn.render()).toBe(Columns[0].header);
  expect(firstColumn.sortOrder).toBe(undefined);
  expect(firstColumn.filterValue).toBe(undefined);
  expect(firstColumn.setFilter).toBe(undefined);
  expect(firstColumn.renderFilter?.()).toBe(undefined);

  expect(result.current.rows.length).toBe(4);
  const firstRow = result.current.rows[0];
  expect(firstRow.cells.length).toBe(3);
  const firstCell = firstRow.cells[0];
  expect(firstCell.getCellProps()).toStrictEqual({});
  const cellClassName = 'first-cell';
  expect(firstCell.getClassName(cellClassName)).toBe(
    `${cellClassName} ${Columns[0].accessor}`
  );
  expect(firstCell.render()).toBe(Data[0].field1);

  expect(result.current.sorts.length).toBe(0);
  expect(result.current.filters.length).toBe(0);
});

describe('with sorts', () => {
  test('should return table output correctly with sorts 1', () => {
    const columns = addTableQueryToColumns(Columns, {
      sorts: [{ accessor: Columns[0].accessor, sort: 'desc' }],
    });

    const simpleInput = {
      columns,
      data: Data,
    };

    const { result } = renderHook(() => useTable(simpleInput));

    const firstColumn = result.current.headers[0];
    expect(firstColumn.getHeaderProps()).not.toStrictEqual({});
    expect(typeof firstColumn.getHeaderProps().onClick).toBe('function');
    expect(firstColumn.getHeaderProps().style).toMatchObject(DefaultHeaderColumnStyle);

    // const columnClassName = 'first-column';
    // expect(firstColumn.getClassName(columnClassName)).toBe(
    //   `${columnClassName} ${Columns[0].accessor}`
    // );
    // expect(firstColumn.render()).toBe(Columns[0].header);
    expect(firstColumn.sortOrder).toBe('desc');
    // expect(firstColumn.filterValue).toBe(undefined);
    // expect(firstColumn.setFilter).toBe(undefined);
    // expect(firstColumn.renderFilter?.()).toBe(undefined);

    // expect(result.current.rows.length).toBe(2);
    // const firstRow = result.current.rows[0];
    // expect(firstRow.cells.length).toBe(3);
    // const firstCell = firstRow.cells[0];
    // expect(firstCell.getCellProps()).toStrictEqual({});
    // const cellClassName = 'first-cell';
    // expect(firstCell.getClassName(cellClassName)).toBe(
    //   `${cellClassName} ${Columns[0].accessor}`
    // );
    // expect(firstCell.render()).toBe(Data[0].field1);

    // expect(result.current.sorts.length).toBe(0);
    // expect(result.current.filters.length).toBe(0);
  });

  test('should return table output correctly with sorts 2', () => {
    // const simpleInput = {
    //   columns: Columns,
    //   data: Data,
    //   sorts: [],
    //   filters: [],
    // };
    // const { result } = renderHook(() => useTable(simpleInput));
    // expect(result.current.headers.length).toBe(3);
    // const firstColumn = result.current.headers[0];
    // expect(firstColumn.getHeaderProps()).toStrictEqual({});
    // const columnClassName = 'first-column';
    // expect(firstColumn.getClassName(columnClassName)).toBe(
    //   `${columnClassName} ${Columns[0].accessor}`
    // );
    // expect(firstColumn.render()).toBe(Columns[0].header);
    // expect(firstColumn.sortOrder).toBe(undefined);
    // expect(firstColumn.filterValue).toBe(undefined);
    // expect(firstColumn.setFilter).toBe(undefined);
    // expect(firstColumn.renderFilter?.()).toBe(undefined);
    // expect(result.current.rows.length).toBe(2);
    // const firstRow = result.current.rows[0];
    // expect(firstRow.cells.length).toBe(3);
    // const firstCell = firstRow.cells[0];
    // expect(firstCell.getCellProps()).toStrictEqual({});
    // const cellClassName = 'first-cell';
    // expect(firstCell.getClassName(cellClassName)).toBe(
    //   `${cellClassName} ${Columns[0].accessor}`
    // );
    // expect(firstCell.render()).toBe(Data[0].field1);
    // expect(result.current.sorts.length).toBe(0);
    // expect(result.current.filters.length).toBe(0);
  });
});
