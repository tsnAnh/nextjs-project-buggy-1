export async function GET(request, { params }) {
    try {
      const { id } = params;
      const task = tasks.find(t => t.id === id);
      
      if (!task) {
        return Response.json(
          { error: "Task not found" },
          { status: 404 }
        );
      }
      
      return Response.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      
      return Response.json(
        { message: "Failed to fetch task" },
        { status: 500 }
      );
    }
  }
  
  export async function PUT(request, { params }) {
    try {
      const { id } = params;
      const body = await request.json();
      
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        return Response.json(
          { error: "Task not found" },
          { status: 404 }
        );
      }
      
      const updatedTask = {
        ...tasks[taskIndex],
        ...body,
        id,
        updatedAt: new Date().toISOString(),
      };
      
      tasks[taskIndex] = updatedTask;
      
      return Response.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      
      return Response.json(
        { message: "Failed to update task" },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(request, { params }) {
    try {
      const { id } = params;
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        return Response.json(
          { error: "Task not found" },
          { status: 404 }
        );
      }
      
      const deletedTask = tasks[taskIndex];
      tasks = tasks.filter(t => t.id !== id);
      
      return Response.json(deletedTask);
    } catch (error) {
      console.error("Error deleting task:", error);
      
      return Response.json(
        { message: "Failed to delete task" },
        { status: 500 }
      );
    }
  }