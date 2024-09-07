import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

export default function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/tasks');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const addNewTask = async () => {
        if (!newTodo.trim()) return; // Prevent adding empty tasks
        try {
            const response = await axios.post('http://localhost:5000/tasks', { task: newTodo });
            setTodos(prevTodos => [...prevTodos, response.data]);
            setNewTodo(""); // Clear input field
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const updateTodoValue = (event) => {
        setNewTodo(event.target.value);
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const upperCaseAll = async () => {
        try {
            const updatedTodos = todos.map(todo => ({
                ...todo,
                task: todo.task.toUpperCase()
            }));
            await Promise.all(updatedTodos.map(todo =>
                axios.put(`http://localhost:5000/tasks/${todo._id}`, { task: todo.task })
            ));
            setTodos(updatedTodos);
        } catch (error) {
            console.error('Error updating tasks:', error);
        }
    };

    const upperCaseOne = async (id) => {
        try {
            const updatedTodo = todos.find(todo => todo._id === id);
            if (!updatedTodo) return; // Avoid updating if the todo is not found
            const updatedTask = { ...updatedTodo, task: updatedTodo.task.toUpperCase() };
            await axios.put(`http://localhost:5000/tasks/${id}`, { task: updatedTask.task });
            setTodos(prevTodos => prevTodos.map(todo => todo._id === id ? updatedTask : todo));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const markOneAsDone = async (id) => {
        try {
            const updatedTodo = todos.find(todo => todo._id === id);
            if (!updatedTodo) return; // Avoid updating if the todo is not found
            const updatedTask = { ...updatedTodo, isDone: true };
            await axios.put(`http://localhost:5000/tasks/${id}`, { isDone: updatedTask.isDone });
            setTodos(prevTodos => prevTodos.map(todo => todo._id === id ? updatedTask : todo));
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const markAllAsDone = async () => {
        try {
            const updatedTodos = todos.map(todo => ({
                ...todo,
                isDone: true
            }));
            await Promise.all(updatedTodos.map(todo =>
                axios.put(`http://localhost:5000/tasks/${todo._id}`, { isDone: todo.isDone })
            ));
            setTodos(updatedTodos);
        } catch (error) {
            console.error('Error updating tasks status:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Todo List</h2>
            <div className="mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Add a task" 
                    value={newTodo} 
                    onChange={updateTodoValue} 
                />
                <button className="btn btn-primary mt-2" onClick={addNewTask}>Add Task</button>
            </div>
            <hr />
            <h4>Tasks</h4>
            <ul className="list-group">
                {todos.length > 0 ? (
                    todos.map(todo => (
                        <li key={todo._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span style={todo.isDone ? { textDecoration: "line-through" } : {}}>
                                {todo.task}
                            </span>
                            <div>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => upperCaseOne(todo._id)}>Highlight</button>
                                <button className="btn btn-success btn-sm me-2" onClick={() => markOneAsDone(todo._id)}>Done</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteTodo(todo._id)}>Delete</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No tasks added</li>
                )}
            </ul>
            <div className="mt-3">
                <button className="btn btn-warning me-2" onClick={upperCaseAll}>Highlight All</button>
                <button className="btn btn-success" onClick={markAllAsDone}>Mark All as Done</button>
            </div>
        </div>
    );
}
