import React, { useEffect, useState } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch("https://playground.4geeks.com/todo/users/KerleyCode/")
      .then((response) => response.json())
      .then((data) => {
        setTodos(data.todos);
      })
      .catch((error) => console.error("Error fetching todos:", error));
  };

  const deleteData = async (todoId) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/KerleyCode/${todoId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error deleting todo:', response.status, response.statusText);
        return { error: { status: response.status, statusText: response.statusText } };
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      return { error: { status: 500, statusText: 'Internal Server Error' } };
    }
  };

  const handleDeleteTodo = async (todoId) => {
    const result = await deleteData(todoId);
    if (result.error) {
      console.error(`Error deleting todo: ${result.error.status} - ${result.error.statusText}`);
    } else {
      // Update the todos state directly
      setTodos(todos.filter((todo) => todo.id !== todoId));
    }
  };

  const handleAddTodo = () => {
    // Add logic to create a new todo item
    if (inputValue.trim() !== '') {
      fetch('https://playground.4geeks.com/todo/users/KerleyCode/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label: inputValue }),
      })
        .then((response) => response.json())
        .then((data) => {
          fetchTodos(); // Refresh the todo list after adding a new one
          setInputValue('');
        })
        .catch((error) => console.error('Error adding todo:', error));
    }
  };

  return (
    <div className="container">
      <h1>My Todos</h1>
      <ul>
        <li>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTodo();
              }
            }}
            placeholder="What do you need to do?"
          ></input>
        </li>
        {todos.map((item, index) => (
          <li key={index}>
            {item.label} <i className="fas fa-trash-alt" onClick={() => handleDeleteTodo(item.id)}></i>
          </li>
        ))}
      </ul>
      <div>{todos.length} tasks</div>
    </div>
  );
};

export default Home;


