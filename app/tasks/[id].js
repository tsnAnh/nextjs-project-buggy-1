import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import TaskForm from '../../components/TaskForm';
import { useAuth } from '../../components/AuthContext';

export default function TaskDetail({ taskData, error }) {
  const router = useRouter();
  const { user } = useAuth();
  const [task, setTask] = useState(taskData);
  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  
  if (router.isFallback) {
    return null;
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Back to Tasks
          </button>
        </div>
      </Layout>
    );
  }
  
  if (!task) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <p>Task not found</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Back to Tasks
          </button>
        </div>
      </Layout>
    );
  }
  
  const handleUpdate = async (updatedTask) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedTask, id: task.id, userId: user?.id }),
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      const updated = await response.json();
      setTask(updated);
      setIsEditing(false);
    } catch (err) {
      setUpdateError(err.message);
    }
  };
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      
      router.push('/');
    } catch (err) {
      setUpdateError(err.message);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Task' : task.title}
        </h1>
        
        {updateError && (
          <p className="text-red-500 mb-4">Error: {updateError}</p>
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
              <strong>Status:</strong>{' '}
              {task.completed ? 'Completed' : 'Active'}
            </p>
            <p className="mb-4">{task.description}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}
        
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Tasks
        </button>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const response = await fetch(`/api/tasks/${params.id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch task with id: ${params.id}`);
    }
    
    const task = await response.json();
    
    return {
      props: {
        taskData: task,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
}