import React from 'react';
import './style.css';
import { AiOutlineCloseCircle, AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";

function Tasks({ id, task, completed, updateTaskStatus, deleteTask }) {

  return(
    <div className={completed === 1 ? 'task-container completed' : 'task-container'}>
    <div className='task-text' >
      {task}
    </div>
    <div className='task-icons-container'>
    <div onClick={() => deleteTask(id)}>
      <AiOutlineCloseCircle className='task-icon'/>
    </div>
    <div onClick={() => updateTaskStatus(id, completed)}>
      {completed === 0 ?
      <AiOutlineCheckCircle  className='task-icon'/>
      :
      <AiFillCheckCircle className='task-icon' />
      }
      </div>
    </div>
    </div>
  )
}

export default Tasks;