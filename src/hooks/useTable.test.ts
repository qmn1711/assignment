import { renderHook, act } from '@testing-library/react-hooks'

import useTable, { addTableQueryToColumns } from './useTable'
import { Column, Filter, Sort, TableQuery } from './useTable.types'

const DefaultColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Age', accessor: 'age' },
  { header: 'Role', accessor: 'role' },
]
const DefaultData = [
  { name: 'A', age: 11, role: 'manager' },
  { name: 'B', age: 12, role: 'leader' },
  { name: 'B', age: 13, role: 'developer' },
  { name: 'C', age: 14, role: 'tester' },
]

const DefaultHeaderColumnStyle = { cursor: 'pointer' }

let Columns: Column<any>[] = DefaultColumns
let Data = DefaultData

beforeEach(() => {
  Columns = DefaultColumns
  Data = DefaultData
})

describe('useTable without sort and filter', () => {
  test('should return table output correctly', () => {
    const simpleInput = {
      columns: Columns,
      data: Data,
    }

    const { result } = renderHook(() => useTable(simpleInput))

    expect(result.current.headers.length).toBe(3)
    const firstColumn = result.current.headers[0]
    expect(firstColumn.getHeaderProps()).toStrictEqual({})
    const columnClassName = 'first-column'
    expect(firstColumn.getClassName(columnClassName)).toBe(`${columnClassName} ${Columns[0].accessor}`)
    expect(firstColumn.render()).toBe(Columns[0].header)
    expect(firstColumn.sortOrder).toBe(undefined)
    expect(firstColumn.filterValue).toBe(undefined)
    expect(firstColumn.setFilter).toBe(undefined)
    expect(firstColumn.renderFilter?.()).toBe(undefined)

    expect(result.current.rows.length).toBe(4)
    const firstRow = result.current.rows[0]
    expect(firstRow.cells.length).toBe(3)
    const firstCell = firstRow.cells[0]
    expect(firstCell.getCellProps()).toStrictEqual({})
    const cellClassName = 'first-cell'
    expect(firstCell.getClassName(cellClassName)).toBe(`${cellClassName} ${Columns[0].accessor}`)
    expect(firstCell.render()).toBe(Data[0].name)

    expect(result.current.sorts.length).toBe(0)
    expect(result.current.filters.length).toBe(0)
  })
})

describe('useTable with sorts', () => {
  test('should return table output correctly, with sort one column', () => {
    const sortFirstColumn: Sort = {
      accessor: Columns[0].accessor,
      sort: 'desc',
    }

    let columns: Column<any>[] = [
      { header: 'Name', accessor: 'name', sort: true },
      { header: 'Age', accessor: 'age' },
      { header: 'Role', accessor: 'role' },
    ]

    columns = addTableQueryToColumns(columns, {
      sorts: [sortFirstColumn],
    })

    const simpleInput = {
      columns,
      data: Data,
    }

    const { result } = renderHook(() => useTable(simpleInput))

    const [firstColumn, secondColumn] = result.current.headers
    expect(firstColumn.getHeaderProps()).not.toStrictEqual({})
    expect(typeof firstColumn.getHeaderProps().onClick).toBe('function')
    expect(firstColumn.getHeaderProps().style).toMatchObject(DefaultHeaderColumnStyle)
    expect(firstColumn.sortOrder).toBe('desc')
    expect(secondColumn.getHeaderProps()).toStrictEqual({})
    expect(secondColumn.sortOrder).toBe(undefined)

    expect(result.current.rows.length).toBe(4)

    const [firstRowFirstCell] = result.current.rows[0].cells
    const [secondRowFirstCell] = result.current.rows[1].cells

    expect(firstRowFirstCell.render()).toBe(Data[3].name)
    expect(secondRowFirstCell.render()).toBe(Data[2].name)

    expect(result.current.sorts).toMatchObject([sortFirstColumn])
    expect(result.current.filters.length).toBe(0)
  })

  test('should return table output correctly, with sort one column and click', async () => {
    const sortFirstColumn: Sort = {
      accessor: Columns[0].accessor,
      sort: 'desc',
    }

    const columns: Column<any>[] = [
      { header: 'Name', accessor: 'name', sort: true },
      { header: 'Age', accessor: 'age', sort: undefined },
      { header: 'Role', accessor: 'role', sort: false },
    ]

    const simpleInput = {
      columns,
      data: Data,
    }

    const { result } = renderHook(() => useTable(simpleInput))

    const [firstColumn, secondColumn, thirdColumn] = result.current.headers
    expect(firstColumn.getHeaderProps()).not.toStrictEqual({})
    expect(typeof firstColumn.getHeaderProps().onClick).toBe('function')
    expect(firstColumn.getHeaderProps().style).toMatchObject(DefaultHeaderColumnStyle)
    expect(firstColumn.sortOrder).toBe(undefined)
    expect(secondColumn.getHeaderProps()).toStrictEqual({})
    expect(secondColumn.sortOrder).toBe(undefined)
    expect(thirdColumn.getHeaderProps()).toStrictEqual({})
    expect(thirdColumn.sortOrder).toBe(undefined)

    act(() => {
      firstColumn.getHeaderProps().onClick({} as any)
    })
    const [firstColumnFirstClick] = result.current.headers
    expect(firstColumnFirstClick.sortOrder).toBe('desc')
    expect(result.current.rows.length).toBe(4)

    const [firstRowFirstCell] = result.current.rows[0].cells
    const [secondRowFirstCell] = result.current.rows[1].cells

    expect(firstRowFirstCell.render()).toBe(Data[3].name)
    expect(secondRowFirstCell.render()).toBe(Data[2].name)

    expect(result.current.sorts).toMatchObject([sortFirstColumn])
    expect(result.current.filters.length).toBe(0)
  })

  test('should return table output correctly, with sort two columns', () => {
    const sortFirstColumn: Sort = {
      accessor: Columns[0].accessor,
      sort: 'desc',
    }
    const sortSecondColumn: Sort = {
      accessor: Columns[1].accessor,
      sort: 'asc',
    }

    let columns: Column<any>[] = [
      { header: 'Name', accessor: 'name', sort: true },
      { header: 'Age', accessor: 'age', sort: true },
      { header: 'Role', accessor: 'role' },
    ]
    columns = addTableQueryToColumns(columns, {
      sorts: [sortFirstColumn, sortSecondColumn],
    })

    const simpleInput = {
      columns,
      data: Data,
    }

    const { result } = renderHook(() => useTable(simpleInput))

    const [firstColumn, secondColumn] = result.current.headers
    expect(firstColumn.getHeaderProps()).not.toStrictEqual({})
    expect(typeof firstColumn.getHeaderProps().onClick).toBe('function')
    expect(firstColumn.getHeaderProps().style).toMatchObject(DefaultHeaderColumnStyle)
    expect(firstColumn.sortOrder).toBe('desc')
    expect(secondColumn.sortOrder).toBe('asc')

    expect(result.current.rows.length).toBe(4)

    const [firstRowFirstCell, firstRowSecondCell] = result.current.rows[0].cells
    const [secondRowFirstCell, secondRowSecondCell] = result.current.rows[1].cells
    const [thirdRowFirstCell, thirdRowSecondCell] = result.current.rows[2].cells

    expect(firstRowFirstCell.render()).toBe(Data[3].name)
    expect(firstRowSecondCell.render()).toBe(Data[3].age)
    expect(secondRowFirstCell.render()).toBe(Data[1].name)
    expect(secondRowSecondCell.render()).toBe(Data[1].age)
    expect(thirdRowFirstCell.render()).toBe(Data[2].name)
    expect(thirdRowSecondCell.render()).toBe(Data[2].age)

    expect(result.current.sorts).toMatchObject([sortFirstColumn, sortSecondColumn])
    expect(result.current.filters.length).toBe(0)
  })
})

describe('useTable with filters', () => {
  test('should return table output correctly, with filter one column', () => {
    const personName = 'B'

    const filterFirstColumn: Filter = {
      accessor: Columns[0].accessor,
      filterValue: personName,
    }

    let columns: Column<any>[] = [
      {
        header: 'Name',
        accessor: 'name',
        filter: ({ filterValue, setFilter }) => filterValue,
      },
      { header: 'Age', accessor: 'age' },
      { header: 'Role', accessor: 'role' },
    ]
    columns = addTableQueryToColumns(columns, {
      filters: [filterFirstColumn],
    })

    const simpleInput = {
      columns,
      data: Data,
    }

    const { result } = renderHook(() => useTable(simpleInput))

    const firstColumn = result.current.headers[0]
    expect(firstColumn.filterValue).toBe(personName)
    expect(typeof firstColumn.renderFilter).toBe('function')
    expect(firstColumn.renderFilter?.()).toBe(personName)

    expect(result.current.rows.length).toBe(2)

    const [firstRowFirstCell] = result.current.rows[0].cells
    const [secondRowFirstCell] = result.current.rows[1].cells

    expect(firstRowFirstCell.render()).toBe(Data[1].name)
    expect(secondRowFirstCell.render()).toBe(Data[2].name)

    expect(result.current.sorts.length).toBe(0)
    expect(result.current.filters).toMatchObject([filterFirstColumn])
  })

  test('should return table output correctly, with filter one column and setFilter', async () => {
    const roleAccessor = Columns[2].accessor
    const personRole = 'a'
    const anotherRole = 'leader'

    const columns: Column<any>[] = [
      {
        header: 'Name',
        accessor: 'name',
      },
      { header: 'Age', accessor: 'age' },
      {
        header: 'Role',
        accessor: 'role',
        filterValue: personRole,
        filter: ({ filterValue, setFilter }) => filterValue,
      },
    ]

    const simpleInput = {
      columns,
      data: Data,
    }

    const { result, waitForValueToChange } = renderHook(() => useTable(simpleInput))

    const thirdColumn = result.current.headers[2]
    expect(thirdColumn.filterValue).toBe(personRole)
    expect(typeof thirdColumn.setFilter).toBe('function')
    expect(typeof thirdColumn.renderFilter).toBe('function')
    expect(thirdColumn.renderFilter?.()).toBe(personRole)

    expect(result.current.rows.length).toBe(2)

    const [firstRowFirstCell] = result.current.rows[0].cells
    const [secondRowFirstCell] = result.current.rows[1].cells

    expect(firstRowFirstCell.render()).toBe(Data[0].name)
    expect(secondRowFirstCell.render()).toBe(Data[1].name)

    expect(result.current.sorts.length).toBe(0)
    expect(result.current.filters).toMatchObject([
      {
        accessor: roleAccessor,
        filterValue: personRole,
      },
    ])

    act(() => {
      thirdColumn.setFilter(anotherRole)
    })

    await waitForValueToChange(() => result.current.headers)

    const thirdColumnAnother = result.current.headers[2]
    expect(thirdColumnAnother.filterValue).toBe(anotherRole)
    expect(typeof thirdColumnAnother.renderFilter).toBe('function')
    expect(thirdColumnAnother.renderFilter?.()).toBe(anotherRole)

    expect(result.current.rows.length).toBe(1)

    const [firstRowFirstCellAnother] = result.current.rows[0].cells

    expect(firstRowFirstCellAnother.render()).toBe(Data[1].name)

    expect(result.current.sorts.length).toBe(0)
    expect(result.current.filters).toMatchObject([
      {
        accessor: roleAccessor,
        filterValue: anotherRole,
      },
    ])
  })

  test('should return table output correctly, with filter two columns', () => {
    const personName = 'B'
    const personAge = '12'
    const personRole = 'leader'

    const filterFirstColumn: Filter = {
      accessor: Columns[0].accessor,
      filterValue: personName,
    }

    const filterSecondColumn: Filter = {
      accessor: Columns[1].accessor,
      filterValue: personAge,
    }

    const filterThirdColumn: Filter = {
      accessor: Columns[2].accessor,
      filterValue: personRole,
    }

    let columns: Column<any>[] = [
      {
        header: 'Name',
        accessor: 'name',
        filter: ({ filterValue, setFilter }) => filterValue,
      },
      {
        header: 'Age',
        accessor: 'age',
        filter: ({ filterValue, setFilter }) => filterValue,
      },
      {
        header: 'Role',
        accessor: 'role',
        filter: ({ filterValue, setFilter }) => filterValue,
      },
    ]
    columns = addTableQueryToColumns(columns, {
      filters: [filterFirstColumn, filterSecondColumn, filterThirdColumn],
    })

    const simpleInput = {
      columns,
      data: Data,
    }

    const { result } = renderHook(() => useTable(simpleInput))

    const [firstColumn, , thirdColumn] = result.current.headers
    expect(firstColumn.filterValue).toBe(personName)
    expect(typeof firstColumn.renderFilter).toBe('function')
    expect(firstColumn.renderFilter?.()).toBe(personName)
    expect(thirdColumn.filterValue).toBe(personRole)

    expect(result.current.rows.length).toBe(1)

    const [firstRowFirstCell, , firstRowThirdCell] = result.current.rows[0].cells

    expect(firstRowFirstCell.render()).toBe(Data[1].name)
    expect(firstRowThirdCell.render()).toBe(Data[1].role)

    expect(result.current.sorts.length).toBe(0)
    expect(result.current.filters).toMatchObject([filterFirstColumn, filterSecondColumn, filterThirdColumn])
  })
})

describe('useTable with sorts and filters', () => {
  test('should return table output correctly', () => {
    const personName = 'B'

    const sortAgeColumn: Sort = {
      accessor: Columns[1].accessor,
      sort: 'desc',
    }

    const filterNameColumn: Filter = {
      accessor: Columns[0].accessor,
      filterValue: personName,
    }

    let columns: Column<any>[] = [
      {
        header: 'Name',
        accessor: 'name',
        filter: ({ filterValue, setFilter }) => filterValue,
      },
      { header: 'Age', accessor: 'age', sort: true },
      { header: 'Role', accessor: 'role' },
    ]
    columns = addTableQueryToColumns(columns, {
      filters: [filterNameColumn],
      sorts: [sortAgeColumn],
    })

    const simpleInput = {
      columns,
      data: Data,
    }

    const { result } = renderHook(() => useTable(simpleInput))

    const [firstColumn, secondColumn] = result.current.headers
    expect(firstColumn.filterValue).toBe(personName)
    expect(typeof firstColumn.renderFilter).toBe('function')
    expect(firstColumn.renderFilter?.()).toBe(personName)
    expect(secondColumn.getHeaderProps()).not.toStrictEqual({})
    expect(typeof secondColumn.getHeaderProps().onClick).toBe('function')
    expect(secondColumn.getHeaderProps().style).toMatchObject(DefaultHeaderColumnStyle)

    expect(result.current.rows.length).toBe(2)

    const [firstRowFirstCell, firstRowSecondCell] = result.current.rows[0].cells
    const [secondRowFirstCell, secondRowSecondCell] = result.current.rows[1].cells

    expect(firstRowFirstCell.render()).toBe(Data[2].name)
    expect(firstRowSecondCell.render()).toBe(Data[2].age)
    expect(secondRowFirstCell.render()).toBe(Data[1].name)
    expect(secondRowSecondCell.render()).toBe(Data[1].age)

    expect(result.current.sorts).toMatchObject([sortAgeColumn])
    expect(result.current.filters).toMatchObject([filterNameColumn])
  })
})

describe('addTableQueryToColumns', () => {
  test('should return columns correctly with empty columns', () => {
    const tableQuery: TableQuery = {
      filters: [],
      sorts: [],
    }

    const columns = addTableQueryToColumns([], tableQuery)

    expect(columns).toStrictEqual([])
  })

  test('should return columns correctly with empty table query', () => {
    const columns1 = addTableQueryToColumns(Columns, {})
    const columns2 = addTableQueryToColumns(Columns, {
      sorts: [],
      filters: [],
    })

    expect(columns1).toStrictEqual(Columns)
    expect(columns2).toStrictEqual(Columns)
  })
})
