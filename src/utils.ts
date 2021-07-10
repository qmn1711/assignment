import isEmpty from 'lodash/isEmpty';

export const SORT_PREFIX = 'sort_';
export const FILTER_PREFIX = 'filter_';

export function buildUrlParams(sorts: any[], filters: any[]) {
  let params: string[] = [];

  if (!isEmpty(sorts)) {
    params = sorts.map((sort) => {
      return `${SORT_PREFIX}${sort.sortOrder}=${sort.accessor}`;
    });
  }

  if (!isEmpty(filters)) {
    params = params.concat(
      filters
        .filter((filter) => filter.filterValue)
        .map((filter) => {
          return `${FILTER_PREFIX}${filter.accessor}=${filter.filterValue}`;
        })
    );
  }

  return isEmpty(params) ? '' : params.join('&');
}

export function buildTableQueryFromUrlParams(urlParams: string) {
  // let sorts: any[] = [];
  // let filters: any[] = [];

  let result = {
    sorts: [] as any[],
    filters: [] as any[],
  };

  if (urlParams) {
    result = urlParams
      .substring(1)
      .split('&')
      .reduce((accum, current) => {
        if (current.startsWith(SORT_PREFIX)) {
          const [sort, accessor] = current.split('=');
          const sortOrder = sort.split(SORT_PREFIX)[1];
          accum.sorts.push({ accessor, sortOrder });
        } else if (current.startsWith(FILTER_PREFIX)) {
          const [filter, filterValue] = current.split('=');
          const accessor = filter.split(FILTER_PREFIX)[1];
          accum.filters.push({ accessor, filterValue });
        }

        return accum;
      }, result);
  }

  return result;
}
