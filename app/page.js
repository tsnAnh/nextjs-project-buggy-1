"use client";

import { useState, useEffect } from "react";
import { calculateTaskStats } from "./utils/taskUtils";
import { useAuth } from "./components/AuthContext";
import LoginForm from "./components/LoginForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch("/api/tasks");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status}`);
        }
        
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchTasks();
    }
    
  });
  
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });
  
  const handleAddTask = async (newTask) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, userId: user?.id }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add task: ${response.status}`);
      }
      
      const addedTask = await response.json();
      
      setTasks([addedTask]);
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err.message);
    }
  };
  
  const handleToggleComplete = async (id) => {
    const taskToUpdate = tasks.find(t => t.id === id);
    
    if (!taskToUpdate) {
      setError(`Task with ID ${id} not found`);
      return;
    }
    
    const updatedTask = { 
      ...taskToUpdate, 
      completed: !taskToUpdate.completed 
    };
    
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.status}`);
      }
      
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.message);
    }
  };
  
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.status}`);
      }
      
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err.message);
    }
  };
  
  const taskStats = calculateTaskStats(filteredTasks);
  
  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
        <LoginForm />
      </div>
    );
  }
  
  if (isLoading && tasks.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
        <p>Loading tasks...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div>
          <span className="mr-2">Welcome, {user.name}</span>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.reload();
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-6">
        <TaskForm onAddTask={handleAddTask} />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded p-1"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="text-sm">
          <span className="mr-3">Total: {taskStats.total}</span>
          <span className="mr-3">Active: {taskStats.active}</span>
          <span className="mr-3">Completed: {taskStats.completed}</span>
          <span>Completion Rate: {taskStats.completionRate.toFixed(1)}%</span>
        </div>
      </div>
      
      <TaskList
        tasks={filteredTasks}
        onToggleComplete={handleToggleComplete}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}