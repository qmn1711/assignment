import { fireEvent, render, screen, createEvent } from '@testing-library/react'

import TextFilter from './TextFilter'

test('renders filter value', () => {
  const mockSetFilter = jest.fn()

  const props = {
    filterValue: 'mana',
    setFilter: mockSetFilter,
  }

  render(<TextFilter {...props} />)

  expect(screen.getByDisplayValue(props.filterValue)).toBeInTheDocument()
  fireEvent.click(screen.getByDisplayValue(props.filterValue))

  const newFilterValue = 'devel'
  const changeEvent = createEvent('change', screen.getByDisplayValue(props.filterValue), {
    target: { value: newFilterValue },
  })
  fireEvent.change(screen.getByDisplayValue(newFilterValue), changeEvent)

  expect(mockSetFilter.mock.calls.length).toBe(1)
  expect(mockSetFilter.mock.calls[0][0]).toBe(newFilterValue)
})
