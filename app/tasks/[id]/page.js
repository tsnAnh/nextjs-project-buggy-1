"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import TaskForm from "../../components/TaskForm";
import { useAuth } from "../../components/AuthContext";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    const fetchTask = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/tasks/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Task not found");
          }
          throw new Error(`Failed to fetch task: ${response.status}`);
        }
        
        const data = await response.json();
        setTask(data);
      } catch (err) {
        console.error("Error fetching task:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchTask();
    }
    
  }, [user]);
  
  const handleUpdate = async (updatedTask) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedTask,
          id: params.id,
          userId: user?.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.status}`);
      }
      
      const data = await response.json();
      setTask(data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.status}`);
      }
      
      router.push("/");
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err.message);
    }
  };
  
  if (!user) {
    router.push("/");
    return null;
  }
  
  if (isLoading && !task) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task Details</h1>
        <p>Loading task...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task Details</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Tasks
        </button>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task Details</h1>
        <p>Task not found</p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Back to Tasks
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit Task" : task.title}
      </h1>
      
      {isLoading && (
        <p className="mb-4">Saving changes...</p>
      )}
      
      {isEditing ? (
        <TaskForm
          initialTask={task}
          onAddTask={handleUpdate}
          isEditing={true}
        />
      ) : (
        <div className="bg-white shadow-md rounded p-4 mb-4">
          <p className="mb-2">
            <strong>Status:</strong>{" "}
            {task.completed ? "Completed" : "Active"}
          </p>
          <p className="mb-4">{task.description}</p>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={() => router.push("/")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        Back to Tasks
      </button>
    </div>
  );
}