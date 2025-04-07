"use client";

import { memo } from "react";
import Link from "next/link";

const TaskList = ({ tasks, onToggleComplete, onDeleteTask }) => {
  console.log("TaskList rendering with", tasks.length, "tasks");
  
  const sortTasks = (tasksToSort) => {
    console.log("Sorting tasks");
    
    return [...tasksToSort].sort((a, b) => {
      if (a.completed === b.completed) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.completed ? 1 : -1;
    });
  };
  
  const sortedTasks = sortTasks(tasks);
  
  return (
    <div className="space-y-4">
      {sortedTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        sortedTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white shadow-md rounded p-4 flex items-center"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="mr-4 h-5 w-5"
            />
            <div className="flex-1">
              <Link href={`/tasks/${task.id}`} className="hover:underline">
                <h3
                  className={`text-lg font-medium ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </h3>
              </Link>
              {task.description && (
                <p className="text-gray-600">{task.description}</p>
              )}
            </div>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="bg-red-500 text-white px-3 py-1 rounded ml-2"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default memo(TaskList);