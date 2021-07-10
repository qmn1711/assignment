import React, { useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import values from 'lodash/values';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import orderBy from 'lodash/orderBy';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import find from 'lodash/find';
import filter from 'lodash/filter';
import { buildTableQueryFromUrlParams, buildUrlParams } from './utils';
import { debounce } from 'lodash';

const CANDIDATES_ENDPOINT =
  'http://personio-fe-test.herokuapp.com/api/v1/candidates';

const sampleResult = {
  data: [
    {
      id: 1,
      name: 'Alvin Satterfield',
      email: 'cornellbartell@connellyleannon.biz',
      birth_date: '1997-09-07',
      year_of_experience: 5,
      position_applied: 'Technician',
      application_date: '2018-07-02',
      status: 'rejected',
    },
    {
      id: 2,
      name: 'Colette Morar',
      email: 'corinnestark@pacocha.co',
      birth_date: '1998-08-03',
      year_of_experience: 3,
      position_applied: 'Designer',
      application_date: '2017-11-18',
      status: 'waiting',
    },
    {
      id: 3,
      name: 'Rosalind Rath DDS',
      email: 'sandyankunding@marks.io',
      birth_date: '1980-03-28',
      year_of_experience: 15,
      position_applied: 'Orchestrator',
      application_date: '2018-01-31',
      status: 'approved',
    },
    {
      id: 4,
      name: 'Cyrstal Kunze',
      email: 'lavernokon@stroman.name',
      birth_date: '1997-10-30',
      year_of_experience: 8,
      position_applied: 'Analyst',
      application_date: '2018-09-12',
      status: 'rejected',
    },
    {
      id: 5,
      name: 'Henrietta Fisher V',
      email: 'lewis@sipes.biz',
      birth_date: '1974-09-14',
      year_of_experience: 14,
      position_applied: 'Producer',
      application_date: '2018-04-25',
      status: 'waiting',
    },
    {
      id: 6,
      name: 'Michal Kiehn Sr.',
      email: 'ruelmarks@prohaska.co',
      birth_date: '1976-08-04',
      year_of_experience: 1,
      position_applied: 'Planner',
      application_date: '2018-04-05',
      status: 'rejected',
    },
    {
      id: 7,
      name: 'Lavonda Murazik',
      email: 'mayesimonis@white.name',
      birth_date: '1984-04-25',
      year_of_experience: 6,
      position_applied: 'Administrator',
      application_date: '2018-10-06',
      status: 'waiting',
    },
    {
      id: 8,
      name: 'Herman Altenwerth',
      email: 'wavavonrueden@brekkecasper.org',
      birth_date: '1996-08-08',
      year_of_experience: 2,
      position_applied: 'Liaison',
      application_date: '2018-09-14',
      status: 'waiting',
    },
    {
      id: 9,
      name: 'Ernestina Dicki',
      email: 'lawrencekunze@pouros.io',
      birth_date: '1971-09-01',
      year_of_experience: 14,
      position_applied: 'Associate',
      application_date: '2018-07-13',
      status: 'approved',
    },
    {
      id: 10,
      name: 'Deedee Kuhic',
      email: 'karisa@mertz.co',
      birth_date: '1973-08-30',
      year_of_experience: 2,
      position_applied: 'Strategist',
      application_date: '2018-10-08',
      status: 'waiting',
    },
    {
      id: 11,
      name: 'Carmela Hilll Sr.',
      email: 'hermelindalang@barrows.org',
      birth_date: '1984-10-04',
      year_of_experience: 11,
      position_applied: 'Assistant',
      application_date: '2018-10-10',
      status: 'waiting',
    },
    {
      id: 12,
      name: 'Brandon Hilll',
      email: 'vondalangosh@bosco.org',
      birth_date: '1986-02-03',
      year_of_experience: 5,
      position_applied: 'Representative',
      application_date: '2018-04-11',
      status: 'rejected',
    },
    {
      id: 13,
      name: 'Sam Donnelly',
      email: 'marya@cronin.com',
      birth_date: '1994-04-18',
      year_of_experience: 5,
      position_applied: 'Assistant',
      application_date: '2018-10-15',
      status: 'waiting',
    },
    {
      id: 14,
      name: 'Mr. Rolando Davis',
      email: 'blainecormier@jacobslangworth.biz',
      birth_date: '1977-11-30',
      year_of_experience: 15,
      position_applied: 'Developer',
      application_date: '2018-02-14',
      status: 'rejected',
    },
    {
      id: 15,
      name: 'Gay Ullrich II',
      email: 'denis@mills.info',
      birth_date: '1972-05-26',
      year_of_experience: 7,
      position_applied: 'Executive',
      application_date: '2018-02-02',
      status: 'approved',
    },
    {
      id: 16,
      name: 'Ollie Bednar PhD',
      email: 'chong@gleichner.net',
      birth_date: '1979-07-09',
      year_of_experience: 3,
      position_applied: 'Executive',
      application_date: '2017-11-11',
      status: 'rejected',
    },
    {
      id: 17,
      name: 'Gonzalo Mueller',
      email: 'jonathanwilderman@creminschumm.org',
      birth_date: '1973-03-05',
      year_of_experience: 5,
      position_applied: 'Agent',
      application_date: '2018-03-21',
      status: 'rejected',
    },
    {
      id: 18,
      name: 'Kristopher Mills',
      email: 'latiaschowalter@hammes.com',
      birth_date: '1980-02-19',
      year_of_experience: 11,
      position_applied: 'Manager',
      application_date: '2018-09-02',
      status: 'approved',
    },
    {
      id: 19,
      name: 'Filiberto Williamson',
      email: 'wanetta@ruecker.co',
      birth_date: '1976-05-14',
      year_of_experience: 10,
      position_applied: 'Orchestrator',
      application_date: '2018-07-30',
      status: 'approved',
    },
    {
      id: 20,
      name: 'Ester Treutel',
      email: 'hugh@kuvalis.net',
      birth_date: '1995-12-02',
      year_of_experience: 4,
      position_applied: 'Manager',
      application_date: '2018-01-20',
      status: 'waiting',
    },
    {
      id: 21,
      name: 'Marlys Larkin',
      email: 'lowell@ritchie.org',
      birth_date: '1986-01-26',
      year_of_experience: 4,
      position_applied: 'Liaison',
      application_date: '2018-01-25',
      status: 'approved',
    },
    {
      id: 22,
      name: 'Kitty Tillman',
      email: 'shirleyschumm@blickhintz.com',
      birth_date: '1978-12-02',
      year_of_experience: 4,
      position_applied: 'Coordinator',
      application_date: '2018-05-16',
      status: 'waiting',
    },
    {
      id: 23,
      name: 'Felton Kovacek',
      email: 'bernettayost@greenholt.biz',
      birth_date: '1977-10-30',
      year_of_experience: 13,
      position_applied: 'Director',
      application_date: '2018-01-09',
      status: 'rejected',
    },
    {
      id: 24,
      name: 'Larry Bruen',
      email: 'molly@harvey.name',
      birth_date: '1995-01-08',
      year_of_experience: 1,
      position_applied: 'Facilitator',
      application_date: '2018-10-15',
      status: 'rejected',
    },
    {
      id: 25,
      name: 'Stephan Trantow',
      email: 'henriette@lowe.io',
      birth_date: '2000-09-15',
      year_of_experience: 10,
      position_applied: 'Architect',
      application_date: '2018-03-07',
      status: 'waiting',
    },
    {
      id: 26,
      name: 'Jacquelynn Bernhard II',
      email: 'annisvandervort@watsica.io',
      birth_date: '1981-02-20',
      year_of_experience: 13,
      position_applied: 'Agent',
      application_date: '2018-09-24',
      status: 'waiting',
    },
    {
      id: 27,
      name: 'Winston Glover Jr.',
      email: 'saulschneider@hamillbarton.co',
      birth_date: '1980-12-12',
      year_of_experience: 13,
      position_applied: 'Officer',
      application_date: '2018-05-30',
      status: 'rejected',
    },
    {
      id: 28,
      name: 'Ross Hagenes MD',
      email: 'dakotacrona@lang.info',
      birth_date: '1970-02-02',
      year_of_experience: 14,
      position_applied: 'Developer',
      application_date: '2018-07-08',
      status: 'approved',
    },
    {
      id: 29,
      name: 'Judson Keebler',
      email: 'dinalynch@cruickshanklang.io',
      birth_date: '1974-11-03',
      year_of_experience: 9,
      position_applied: 'Consultant',
      application_date: '2018-02-08',
      status: 'waiting',
    },
    {
      id: 30,
      name: 'Avery Ruecker',
      email: 'bailey@greenholt.biz',
      birth_date: '1995-12-29',
      year_of_experience: 4,
      position_applied: 'Director',
      application_date: '2018-06-02',
      status: 'rejected',
    },
  ],
};

const tableQuery = buildTableQueryFromUrlParams(window.location.search);

const useTable = ({ columns, data, sorts, filters }: any) => {
  const [sortsState, setSortsState] = useState<any[]>(() =>
    isEmpty(sorts) ? [] : sorts
    // []
  );
  const [filtersState, setFiltersState] = useState<any>(() =>
    isEmpty(filters) ? [] : filters
    // []
  );
  const [headers, setHeaders] = useState<any[]>(columns);
  const [rows, setRows] = useState<any[]>(data);

  // const sampleColumns = [
  //   { Header: 'First Name', accessor: 'firstName' },
  //   { Header: 'Middle Name', accessor: 'middleName' },
  //   { Header: 'First Name', accessor: 'firstName' },
  // ];

  useEffect(() => {
    console.log('sorts update effect', sortsState);

    if (!isEmpty(sortsState)) {
      const fields = sortsState.map((sort) => sort.accessor);
      const sortOrders = sortsState.map((sort) => sort.sortOrder);

      console.log('fields', fields);
      console.log('sortOrders', sortOrders);

      setRows((rows) => orderBy(rows, fields, sortOrders));
    }
  }, [sortsState]);

  useEffect(() => {
    console.log('filters update effect', filtersState);

    if (!isEmpty(filtersState)) {
      setRows(
        filter(data, (row: any) => {
          let match = false;

          for (let i = 0; i < filtersState.length; i++) {
            const value = row[filtersState[i].accessor];
            const filterValue = filtersState[i].filterValue;

            switch (typeof value) {
              case 'string':
                match = value.toLowerCase().includes(filterValue.toLowerCase());
                break;
              case 'number':
                match = value === parseInt(filterValue);
                break;
            }

            if (match === false) {
              break;
            }
          }

          return match;
        })
      );
    }
  }, [filtersState, data]);

  const accessors = columns.map((column: any) => column.accessor); // TODO use reduce for only one loop
  const resultHeaders = headers.map((column: any, i: number) => {
    const colHeader = column.header;
    const headerProps: any = {};
    let setFilter: any;

    // TODO adapt the props from url query
    if (column.sorting) {
      headerProps.onClick = (e: any) => {
        console.log('do something on click');
        // sorting
        // update state sorting
        const sortOrder =
          isEmpty(column.sortOrder) || column.sortOrder === 'asc'
            ? 'desc'
            : 'asc';
        headers[i] = { ...column, sortOrder };
        setHeaders([...headers]);
        setSortsState(
          uniqBy(
            [
              { accessor: column.accessor, sortOrder: sortOrder },
              ...sortsState,
            ],
            'accessor'
          )
        );
      };

      headerProps.style = { cursor: 'pointer' };
    }

    if (isFunction(column.filtering)) {
      setFilter = debounce((value: string) => {
        console.log('filter do something');
        setFiltersState(
          uniqBy(
            [
              { accessor: column.accessor, filterValue: value },
              ...filtersState,
            ],
            'accessor'
          )
        )
      }, 85);
    }

    console.log(
      'column.filtering',
      column.filtering,
      isFunction(column.filtering)
    );

    return {
      getHeaderProps: () => {
        return { ...headerProps };
      },
      render: () => {
        return colHeader;
      },
      sortOrder: column.sortOrder,
      getSortOrder: () => {
        const sort = find(sortsState, { accessor: column.accessor })
        return sort ? sort.sortOrder : '';
      },
      filterValue: column.filterValue,
      setFilter,
      renderFilter: isFunction(column.filtering)
        ? () => {
            console.log('renderFilter', filtersState);
            return column.filtering({
              filterValue: find(filtersState, { accessor: column.accessor })
                ?.filterValue,
              setFilter,
            });
            // return column.filtering({
            //   filterValue: filters[column.accessor],
            //   setFilter,
            // });
          }
        : undefined,
    };
  });
  const resultRows = rows.map((item: any) => {
    const cells = Object.keys(item)
      .filter((key) => accessors.includes(key))
      .map((key) => {
        return {
          getCellProps: () => {},
          render: () => item[key],
        };
      });

    return {
      cells,
    };
  });

  return {
    headers: resultHeaders,
    rows: resultRows,
    sorts: sortsState,
    filters: filtersState,
  };
};

const TextFilter = ({ filterValue, setFilter }: any) => {
  const clickHandler = (e: any) => {
    e.stopPropagation();
  };

  const changeHandler = (e: any) => {
    setFilter(e.target.value);
  };

  return (
    <input
      value={filterValue || ''}
      onChange={changeHandler}
      onClick={clickHandler}
    />
  );
};

function App() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(CANDIDATES_ENDPOINT);
        const data = await response.json();

        if (data && data.error) {
          throw new Error(data.error.message);
        } else if (data) {
          setData(data.data);
        }
        console.log('result', data);

        // throw new Error('test error handling');
      } catch (error) {
        console.log('error', error);
        setErrorMsg(error.message ? error.message : JSON.stringify(error));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  console.log('state', isLoading, data, errorMsg);

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessor: 'name',
        filtering: (props: any) => {
          return <TextFilter {...props} />;
        },
        // filterWay: ({ filterValue, row }: any) => {
        //   return filterValue ? row.name?.include(filterValue) : true;
        // }
      },
      {
        header: 'Email',
        accessor: 'email',
      },
      {
        header: 'Age',
        accessor: 'birth_date',
      },
      {
        header: 'Years of Experience',
        accessor: 'year_of_experience',
        sorting: true,
      },
      {
        header: 'Position applied',
        accessor: 'position_applied',
        sorting: true,
        filtering: (props: any) => {
          return <TextFilter {...props} />;
        },
      },
      {
        header: 'Applied',
        accessor: 'application_date',
        sorting: true,
      },
      {
        header: 'Status',
        accessor: 'status',
        filtering: (props: any) => {
          return <TextFilter {...props} />;
        },
      },
    ],
    []
  );
  const dataSample = useMemo(() => sampleResult.data, []);

  console.log('tableQuery', tableQuery);
  const { headers, rows, sorts, filters } = useTable({
    columns,
    data: dataSample,
    sorts: tableQuery.sorts,
    filters: tableQuery.filters,
  });

  console.log('headers', headers);
  console.log('rows', rows);

  useEffect(() => {
    // http://localhost:3000?sort_desc=application_date&sort_asc=year_of_experience&filter_position_applied=n&filter_status=a&filter_name=a

    if (!isEmpty(sorts) || !isEmpty(filters)) {
      const result = buildUrlParams(sorts, filters);
      const newUrl = `${window.location.origin}${result ? `?${result}` : ''}`;
      window.history.pushState(result, result, newUrl);
    }
  }, [sorts, filters]);

  return (
    <div className="App">
      <div>
        <div>Candidates</div>
        <div className="candidates">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                {headers.map((column: any) => (
                  <th {...column.getHeaderProps()}>
                    {column.render()} {column.getSortOrder()}{' '}
                    {column.renderFilter && column.renderFilter()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any, i: number) => {
                return (
                  <tr>
                    {row.cells.map((cell: any) => {
                      return <td>{cell.render()}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
            {/* <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Age</th>
            </tr>
            <tr>
              <td>Jill</td>
              <td>Smith</td>
              <td>50</td>
            </tr>
            <tr>
              <td>Eve</td>
              <td>Jackson</td>
              <td>94</td>
            </tr> */}
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
