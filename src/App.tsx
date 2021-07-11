import React, { useEffect, useMemo, useState } from 'react';

import {
  buildTableQueryFromUrlParams,
  buildUrlParams,
  calculateAge,
  capitalizeFirstLetter,
} from './utils';
import { DivTable, Select, TextFilter } from './components/DivTable';

import './App.css';
import { Filter, FilteringProps, Sort } from './hooks/useTable.types';

const CANDIDATES_ENDPOINT =
  'http://personio-fe-test.herokuapp.com/api/v1/candidates';

const CandidateImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAByElEQVRIieXWPWsVQRTG8d8VBZVYeMFIVCwkmE7EIqSRRBARO/0EIiksBEE/gC9VrC0sLAIRLCRIrKyEFMHK11JQIRgFCwVRgwajFjsrk+vN7M5eg0UeOOzsOWfOf3ZndnZYb2pVxAdxAltq1FrCDXzrdVDDWMSvDLuPzb2Cb2cAn2I5B74hERvIGOQ9jOMnjof75PSkwLmajODHMJOCb6wotogHeKEY5CCOYmsC3sLNAL+LkzIX3Gm0u/jbuG7lHF/uyDkjc85zdC4B7hnej1v4FGwKO6L4nQS4Ez4WB1IbSB+eY1+H/xUO4gsOhJzXwbrpkGJ6jmA2wfujK1b/bi9FeQuJvNhWPHHqcxpOxEai9psaD/GXUuCPidiHqN3XBJzSmGIz6HxlyxgNOdvwvUtO5auu0kXFX6fsvIQLUfxsTWg2GIZwPtj+yL8b79cSvJp2KlZ3o1X9L7QJV3VfD1ngFg5jAg8xj6/B5oNvIuTEG9B4L+AhPK4oENuj0KfUdBNwG+8yoKW9xfZQY7QuON5ATsk7dZTapfjnwpO6nWLwngbQUnvD9XMT8Fpr4X+Ap/EydsRnrjlca1h4LmrHNX7gmeLstc71G7y927H4GBPFAAAAAElFTkSuQmCC';

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
        return <Select data={StatusData} {...props} />;
      },
    },
  ];
};

const changeUrl = (sorts: Sort[], filters: Filter[]) => {
  const result = buildUrlParams(sorts, filters);
  const newUrl = `${window.location.origin}${result ? `?${result}` : ''}`;
  window.history.pushState(result, result, newUrl);
};

const Loader = () => {
  return (
    <div className="lds-ellipsis loading-applications">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

const ErrorMsg = ({ errorMsg }: { errorMsg: string }) => {
  return (
    <div className="message error">{`${errorMsg} - Please try again!`}</div>
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

  return (
    <div className="App">
      <div className="candidates">
        <div className="title">
          <div>
            <img src={CandidateImage} alt="Applications" />
          </div>
          <h3>Applications</h3>
        </div>

        {isLoading ? <Loader /> : renderContent()}
      </div>
    </div>
  );
}

export default App;
