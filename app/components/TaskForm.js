"use client";

import { useState, useEffect } from "react";

export default function TaskForm({ onAddTask, initialTask = null, isEditing = false }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
    }
  }, [initialTask]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    onAddTask({ title, description });
    
    if (!isEditing) {
      setTitle("");
      setDescription("");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows="3"
        />
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isEditing ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}