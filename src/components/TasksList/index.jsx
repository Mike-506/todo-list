import React, {useState, useEffect} from "react";
import './style.css';
import Form from "../Form";
import Tasks from "../Tasks";

function TasksList() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks(tasks);
  },[]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/tasks');
      if (!response.ok) {
        throw new Error(`Error getting data: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.data);
      setTasks(data.data);
    
    } catch (error) {
      console.error('Error getting data:', error.message);
    }
  };

  const addTask = async (task) => {
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });
      if (!response.ok) {
        throw new Error(`Error adding task: ${response.status}`);
      }
      console.log('Server response:', response);
      // Update the task list when a new task is added
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error deleting task: ${response.status}`);
      }
      console.log('Task deleted successfully:', id);
      // Update the task list when a task is deleted
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const updateTaskStatus = async (id, completed) => {
    try {
      const newCompleted = completed === 0 ? 1 : 0;

      const response = await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: newCompleted }), // Send the new value for "completed" 
      });
      if (!response.ok) {
        throw new Error(`Error updating task status: ${response.status}`);
      }
      console.log('Task status updated successfully:', id, newCompleted);
      // Update the task list when a task is updated
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error.message);
    }
  };

  return (
    <>
    <Form onSubmit={addTask}/>
    <div className="tasks-container">
      {
        tasks.map((task) =>
        <Tasks
          key={task.task_id}
          id={task.task_id}
          task={task.task}
          completed={task.completed}
          deleteTask={deleteTask}
          updateTaskStatus={updateTaskStatus} />
        )
      }
    </div>
    </>
  )
}

export default TasksList;


    /*
  const addTask = (task) => {
    console.log('Before: ' + tasks);
    if (task.text.trim()) {
      task.text = task.text.trim();
      const updateTasks = [task, ...tasks];
      setTasks(updateTasks);
    }
    console.log('Task added');
    console.log(task);
  }
  
  const deleteTask = id => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  }

  const updateTaskStatus = id => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        task.completed = !task.completed;
      }
      return task;
    })
    setTasks(updatedTasks);
  }
*/ 