import { render } from '@testing-library/react'

import VirtualScroller, { Props } from './VirtualScroller'

// Cannot test scroll user event on testing library jest-dom: https://github.com/testing-library/user-event/issues/475
// Have to use Cypress or other real browser testing approaches

test('test children rendering', () => {
  const childrenMock = jest.fn(({ index }) => {
    return index
  })
  const sampleData: Props = {
    className: 'test-viewport',
    itemHeight: 10,
    amount: 10,
    maxIndex: 25,
    children: childrenMock,
  }

  render(<VirtualScroller {...sampleData} />)

  expect(childrenMock.mock.calls.length).toBe(16)
  expect(childrenMock.mock.calls[0][0]).toStrictEqual({ index: 0 })
  expect(childrenMock.mock.calls[childrenMock.mock.calls.length - 1][0]).toStrictEqual({ index: 15 })
})
