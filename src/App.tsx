import React from 'react';
import './App.css';
import Feed from './components/Feed';

function App() {
  return (
    <div className="App">
      <Feed service="Twitter"></Feed>
    </div>
  );
}

export default App;
