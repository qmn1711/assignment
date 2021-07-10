import React, { useMemo } from 'react';

import logo from './logo.svg';
import { buildTableQueryFromUrlParams, buildUrlParams, calculateAge } from './utils';
import sampleResult from './sample_data.json';
import { DivTable, TextFilter } from './components/DivTable';

import './App.css';

const tableQuery = buildTableQueryFromUrlParams(window.location.search);

const getColumns = () => {
  return [
    {
      header: 'Name',
      accessor: 'name',
      filtering: (props: any) => {
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
        return value
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
  ];
};

const changeUrl = (sorts: any, filters: any) => {
  const result = buildUrlParams(sorts, filters);
  const newUrl = `${window.location.origin}${result ? `?${result}` : ''}`;
  window.history.pushState(result, result, newUrl);
};

function App() {
  const columns = useMemo(getColumns, []);
  const data = useMemo(() => sampleResult.data, []);

  console.log('tableQuery', tableQuery);

  return (
    <div className="App">
      <div className="candidates">
        <div>Candidates</div>
        <DivTable
          columns={columns}
          data={data}
          tableQuery={tableQuery}
          onTableQueryChange={changeUrl}
        />
      </div>
    </div>
  );
}

export default App;
