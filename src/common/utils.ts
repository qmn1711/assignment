import isEmpty from 'lodash/isEmpty'
import trim from 'lodash/trim'

import { Filter, Sort, SortOrder, TableQuery } from '../hooks/useTable.type'

export const SORT_PREFIX = 'sort_'
export const FILTER_PREFIX = 'filter_'

export function calculateAge(birthday: Date) {
  const ageDifMs = Date.now() - birthday.getTime()
  const ageDate = new Date(ageDifMs) // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export function capitalizeFirstLetter(text: string) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text
}

export function buildUrlParams(sorts: Sort[], filters: Filter[]) {
  let params: string[] = []

  if (!isEmpty(sorts)) {
    params = sorts.map((sort) => {
      return `${SORT_PREFIX}${sort.sort}=${sort.accessor}`
    })
  }

  if (!isEmpty(filters)) {
    params = params.concat(
      filters
        .filter((filter) => filter.filterValue)
        .map((filter) => {
          return `${FILTER_PREFIX}${filter.accessor}=${encodeURIComponent(filter.filterValue)}`
        })
    )
  }

  return isEmpty(params) ? '' : params.join('&')
}

export function sortByAccessor(itemA: Sort | Filter, itemB: Sort | Filter) {
  let result = 0
  if (itemA.accessor < itemB.accessor) {
    result = -1
  }

  if (itemA.accessor > itemB.accessor) {
    result = 1
  }

  return result
}

export function buildTableQueryFromUrlParams(urlParams: string): TableQuery {
  let result = {
    sorts: [] as Sort[],
    filters: [] as Filter[],
  }

  if (urlParams) {
    result = urlParams
      .substring(1)
      .split('&')
      .reduce((accum, current) => {
        if (current.startsWith(SORT_PREFIX)) {
          const [sort, accessor] = current.split('=')
          const sortOrder = sort.split(SORT_PREFIX)[1]
          if (['asc', 'desc'].includes(sortOrder)) {
            accum.sorts.push({ accessor, sort: sortOrder as SortOrder })
          }
        } else if (current.startsWith(FILTER_PREFIX)) {
          const [filter, filterValue] = current.split('=')
          const accessor = filter.split(FILTER_PREFIX)[1]
          accum.filters.push({ accessor, filterValue: trim(decodeURIComponent(filterValue)) })
        }

        return accum
      }, result)

    if (!isEmpty(result.sorts)) {
      result.sorts.sort(sortByAccessor)
    }

    if (!isEmpty(result.filters)) {
      result.filters.sort(sortByAccessor)
    }
  }

  return result
}
