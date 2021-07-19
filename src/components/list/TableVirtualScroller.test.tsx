import { render } from '@testing-library/react'

import TableVirtualScroller, { Props } from './TableVirtualScroller'

// TODO use Cypress or other real browser testings for scroll user event
// Cannot test scroll user event on testing library jest-dom: https://github.com/testing-library/user-event/issues/475

test('test children rendering', () => {
  const childrenMock = jest.fn(({ index }) => {
    return (
      <tr key={index}>
        <td>{index}</td>
      </tr>
    )
  }) // just empty fn is enough but it's for later reference

  const sampleData: Props = {
    className: 'test-viewport',
    itemHeight: 10,
    amount: 10,
    maxIndex: 25,
    children: childrenMock,
  }

  render(
    <table>
      <TableVirtualScroller {...sampleData} />
    </table>
  )

  expect(childrenMock.mock.calls.length).toBe(16)
  expect(childrenMock.mock.calls[0][0]).toStrictEqual({ index: 0 })
  expect(childrenMock.mock.calls[childrenMock.mock.calls.length - 1][0]).toStrictEqual({ index: 15 })
})
