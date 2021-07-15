import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'

import DivTable from './DivTable'
import TextFilter from './TextFilter'
import { FilteringProps } from '../hooks/useTable.types'

const SampleData = [
  {
    id: 1,
    name: 'Alvin Satterfield',
    email: 'cornellbartell@connellyleannon.biz',
    birth_date: '1997-09-07',
  },
  {
    id: 2,
    name: 'Colette Morar',
    email: 'corinnestark@pacocha.co',
    birth_date: '1998-08-03',
  },
  {
    id: 3,
    name: 'Rosalind Rath DDS',
    email: 'sandyankunding@marks.io',
    birth_date: '1980-03-28',
  },
  {
    id: 4,
    name: 'Rosalind Rath Z',
    email: 'sandyankunding@marks.io',
    birth_date: '1980-03-29',
  },
]

test('loads and display data', async () => {
  const mockTableQueryChangeCallback = jest.fn()
  const mockFilterCallback = jest.fn((props: FilteringProps) => {
    return <TextFilter {...props} />
  })
  const mockRenderCallback = jest.fn((value: string) => {
    return <div data-testid={`cell-birthdate`}>{value}</div>
  })

  const Columns = [
    {
      header: 'Name',
      accessor: 'name',
      filter: mockFilterCallback,
      sort: true,
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Age',
      accessor: 'birth_date',
      render: mockRenderCallback,
    },
  ]

  const { container, getByText, findAllByTestId } = render(
    <DivTable columns={Columns} data={SampleData} onTableQueryChange={mockTableQueryChangeCallback} />
  )

  expect(container.getElementsByClassName('table').length).toBe(1)
  expect(container.getElementsByClassName('header-column').length).toBe(3)
  expect(container.getElementsByClassName('cell name').length).toBe(4)
  expect(container.getElementsByClassName('filter-input').length).toBe(1)

  userEvent.click(getByText('Name'))
  expect(getByText('Name').getElementsByClassName('arrow up').length).toBe(1)
  expect((await findAllByTestId(`cell-birthdate`))[0].innerHTML).toBe('1980-03-29')
  expect(mockTableQueryChangeCallback.mock.calls.length).toBe(2)
  expect(mockTableQueryChangeCallback.mock.calls[1][0]).toStrictEqual([{ accessor: 'name', sort: 'desc' }])

  userEvent.click(getByText('Name'))
  expect(getByText('Name').getElementsByClassName('arrow down').length).toBe(1)
  expect((await findAllByTestId(`cell-birthdate`))[0].innerHTML).toBe('1997-09-07')
  expect(mockTableQueryChangeCallback.mock.calls.length).toBe(3)
  expect(mockTableQueryChangeCallback.mock.calls[2][0]).toStrictEqual([{ accessor: 'name', sort: 'asc' }])

  await userEvent.type(container.getElementsByClassName('filter-input')[0], 'Rosalind', { delay: 100 })
  await waitFor(() => expect((container.getElementsByClassName('filter-input')[0] as any).value).toBe('Rosalind'))
  expect(container.getElementsByClassName('cell name').length).toBe(2)
})
