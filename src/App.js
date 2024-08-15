import './App.css';
import React from 'react';
import logo from './img/todo-logo.png';
import TasksList from './components/TasksList';

function App() {
  return (
    <div className="App">
      <header className='header'>
        <img
        src={logo}
        alt='logo'
        className='logo' />
      </header>
      <>
        <div className='main'>
          <h1>My Tasks</h1>
          <TasksList />
        </div>
      </>
    </div>
  );
}

export default App;
