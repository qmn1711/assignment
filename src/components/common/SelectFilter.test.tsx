import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SelectFilter from './SelectFilter'

test('renders select options', () => {
  const data = [
    { value: 'desktop', text: 'Desktop' },
    { value: 'laptop', text: 'laptop' },
    { value: 'mobile', text: 'mobile' },
    { value: 'tablet', text: 'tablet' },
  ]

  const mockSetFilter = jest.fn()

  const className = 'test-select-filter'

  const props = {
    data,
    filterValue: 'mana',
    setFilter: mockSetFilter,
    className,
  }

  const { container } = render(<SelectFilter {...props} />)

  expect(container.getElementsByClassName(className).length).toBe(1)
  expect((screen.getByRole('option', { name: data[0].text }) as any).selected).toBe(true)

  userEvent.selectOptions(container.getElementsByClassName(className)[0], [data[2].value])

  expect(mockSetFilter.mock.calls.length).toBe(1)
  expect(mockSetFilter.mock.calls[0][0]).toBe(data[2].text)
})
