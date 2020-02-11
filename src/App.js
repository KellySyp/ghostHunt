import React from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './components/board';

function App() {
  return (
    <div className="App">
		<Board 
			height = {8}
			width= {8}
			ghosts = {8}
		/>
    </div>
  );
}

export default App;
