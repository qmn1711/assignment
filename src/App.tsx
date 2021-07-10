import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const CANDIDATES_ENDPOINT =
  'http://personio-fe-test.herokuapp.com/api/v1/candidates';

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

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
