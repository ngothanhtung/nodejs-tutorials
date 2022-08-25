import React from 'react';
import './App.css';

function App() {
  React.useEffect(() => {
    fetch('http://localhost:9000/products')
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return <div className='App'></div>;
}

export default App;
