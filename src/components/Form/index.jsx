import React, {useState} from "react";
import './style.css';

function Form({ onSubmit }) {
  const [input, setInput] = useState('');

  const handleOnChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input);
    setInput('');
  };

  return(
    <form className='task-form'
      onSubmit={handleSubmit}
      action="/tasks"
      method="post"
    >
      <input 
      className='task-input'
      type='text'
      placeholder='Write a new Task...'
      name="task"
      value={input}
      onChange={handleOnChange}
      autoFocus
      />
      <button className="task-button" type="submit">
        Add Task
      </button>
    </form>
  )
}

export default Form;

/*
  const handleOnChange = e => {
    setInput(e.target.value);
    console.log(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Sending form...');

    const newTask = {
      task_id: uuidv4(),
      text: input,
      completed: 0 
    }
    props.onSubmit(newTask);
  }
*/