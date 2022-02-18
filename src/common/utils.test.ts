import { Filter, Sort } from '../hooks/useTable.type'
import {
  calculateAge,
  capitalizeFirstLetter,
  buildUrlParams,
  buildTableQueryFromUrlParams,
  sortByAccessor,
} from './utils'

test('calculateAge should return correct value', () => {
  expect(calculateAge(new Date('1988-01-01'))).toBe(new Date().getFullYear() - 1988)
})

test('capitalizeFirstLetter should return correct value', () => {
  expect(capitalizeFirstLetter('hello World')).toBe('Hello World')
  expect(capitalizeFirstLetter('')).toBe('')
})

describe('build url params and table query objects', () => {
  const emptyQueryUrl = ''
  const sortQueryUrl = 'sort_desc=address'
  const filterQueryUrl = 'filter_country=italia'
  const sortFilterQueryUrl = 'sort_desc=address&filter_country=italia'

  const sort: Sort = { accessor: 'address', sort: 'desc' }
  const filter: Filter = { accessor: 'country', filterValue: 'italia' }

  test('buildUrlParams should return correct value', () => {
    expect(buildUrlParams([], [])).toBe(emptyQueryUrl)
    expect(buildUrlParams([sort], [])).toBe(sortQueryUrl)
    expect(buildUrlParams([], [filter])).toBe(filterQueryUrl)
    expect(buildUrlParams([sort], [filter])).toBe(sortFilterQueryUrl)
  })

  test('buildTableQueryFromUrlParams should return correct value', () => {
    expect(buildTableQueryFromUrlParams('?' + emptyQueryUrl)).toStrictEqual({ sorts: [], filters: [] })
    expect(buildTableQueryFromUrlParams('?' + sortQueryUrl)).toStrictEqual({ sorts: [sort], filters: [] })
    expect(buildTableQueryFromUrlParams('?' + filterQueryUrl)).toStrictEqual({ sorts: [], filters: [filter] })
    expect(buildTableQueryFromUrlParams('?' + sortFilterQueryUrl)).toStrictEqual({ sorts: [sort], filters: [filter] })
  })

  test('sortByAccessor should compare correctly', () => {
    const sortA = sort
    const sortB: Sort = { accessor: 'name', sort: 'desc' }
    const sortC: Sort = { accessor: 'name', sort: 'asc' }

    expect(sortByAccessor(sortA, sortB)).toBe(-1)
    expect(sortByAccessor(sortB, sortA)).toBe(1)
    expect(sortByAccessor(sortB, sortC)).toBe(0)
    expect(sortByAccessor(sortC, sortB)).toBe(0)
  })
})
