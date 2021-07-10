import React, { useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import values from 'lodash/values';

const CANDIDATES_ENDPOINT =
  'http://personio-fe-test.herokuapp.com/api/v1/candidates'

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

const useTable = ({ columns, data }: any) => {
  // const sampleColumns = [
  //   { Header: 'First Name', accessor: 'firstName' },
  //   { Header: 'Middle Name', accessor: 'middleName' },
  //   { Header: 'First Name', accessor: 'firstName' },
  // ];

  const accessors = columns.map((column: any) => column.accessor); // TODO use reduce for only one loop
  const headers = columns.map((column: any) => {
    const header = column.header;

    return {
      getHeaderProps: () => {},
      render: () => {
        return header;
      },
    };
  });
  const rows = data.map((item: any) => {
    const cells = Object.keys(item).filter(key => accessors.includes(key)).map((key) => {
      return {
        getCellProps: () => {},
        render: () => item[key],
      };
    });

    return {
      cells,
    };
  });

  // const headers = [
  //   {
  //     // getHeaderProps(),
  //     // render('Header')
  //   },
  //   {
  //     // getHeaderProps(),
  //     // render('Header')
  //   },
  // ];

  // const rows = [
  //   {
  //     // getRowProps(),
  //     // cells
  //     // cell.getCellProps()
  //     // cell.render('Cell')
  //   },
  //   {
  //     // getRowProps(),
  //     // cells
  //     // cell.getCellProps()
  //     // cell.render('Cell')
  //   },
  // ];

  return {
    headers,
    rows,
  };
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

        if (data) {
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
      },
      {
        header: 'Email',
        accessor: 'email',
      },
      {
        header: 'Years',
        accessor: 'year_of_experience',
      },
    ],
    []
  );
  const dataSample = useMemo(() => sampleResult.data, []);

  const { headers, rows } = useTable({ columns, data: dataSample });

  console.log('headers', headers);
  console.log('rows', rows);

  return (
    <div className="App">
      <div>
        <div>Candidates</div>
        <div>
          <table style={{ width: '100%' }}>
            <tr>
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
            </tr>
          </table>
        </div>
        <div className="candidates">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                {headers.map((column: any, i: number) => (
                  <th key={i}>{column.render()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
               { rows.map((row: any, i: number) => {
                 return (
                  <tr key={i}>
                    { row.cells.map((cell: any, j: number) => {
                      return (
                        <td key={j}>{ cell.render() }</td>
                      )
                    }) }
                  </tr>
                 );
               }) }   
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
