import React from 'react';
import './App.css';
import Card from './Card'
import facesData from './facesData'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Card facesData={facesData} />
      </header>
    </div>
  );
}

export default App;
