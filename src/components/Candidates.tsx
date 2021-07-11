import { useEffect, useMemo, useState } from 'react';

import {
  buildTableQueryFromUrlParams,
  buildUrlParams,
  calculateAge,
  capitalizeFirstLetter,
} from '../utils';
import DivTable from './DivTable';
import { Filter, FilteringProps, Sort } from '../hooks/useTable.types';
import TextFilter from './TextFilter';
import SelectFilter from './SelectFilter';
import Loader from './Loader';

import './Candidates.css';

const CANDIDATES_ENDPOINT =
  'http://personio-fe-test.herokuapp.com/api/v1/candidates';

const tableQuery = buildTableQueryFromUrlParams(window.location.search);

export const StatusData = [
  {
    value: '',
    text: 'All',
  },
  {
    value: 'waiting',
    text: 'Waiting',
  },
  {
    value: 'approved',
    text: 'Approved',
  },
  {
    value: 'rejected',
    text: 'Rejected',
  },
];

const getColumns = () => {
  return [
    {
      header: 'Name',
      accessor: 'name',
      filtering: (props: FilteringProps) => {
        return <TextFilter {...props} />;
      },
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Age',
      accessor: 'birth_date',
      render: (value: string) => {
        try {
          value = calculateAge(new Date(value)).toString();
        } catch (error) {
          // just return the original value
        }
        return value;
      },
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
      filtering: (props: FilteringProps) => {
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
      render: (value: string) => {
        return capitalizeFirstLetter(value);
      },
      filtering: (props: FilteringProps) => {
        return (
          <SelectFilter className="filter-select" data={StatusData} {...props} />
        );
      },
    },
  ];
};

const changeUrl = (sorts: Sort[], filters: Filter[]) => {
  const result = buildUrlParams(sorts, filters);
  const newUrl = `${window.location.origin}${result ? `?${result}` : ''}`;
  window.history.pushState(result, result, newUrl);
};

const ErrorMsg = ({ errorMsg }: { errorMsg: string }) => {
  return (
    <div className="message error">{`${errorMsg} - Please try again!`}</div>
  );
};

function Candidates() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setErrorMsg('');
        const response = await fetch(CANDIDATES_ENDPOINT);
        const data = await response.json();

        if (data && data.error) {
          throw new Error(data.error.message);
        } else if (data) {
          setData(data.data);
        }
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

  const renderContent = () => {
    return errorMsg ? (
      <ErrorMsg errorMsg={errorMsg} />
    ) : (
      <DivTable
        columns={columns}
        data={data}
        tableQuery={tableQuery}
        onTableQueryChange={changeUrl}
      />
    );
  };

  const columns = useMemo(getColumns, []);

  console.log('tableQuery', tableQuery);

  return isLoading ? <Loader /> : renderContent();
}

export default Candidates;
