// Mock database
let tasks = [
    {
      id: "1",
      title: "Learn Next.js 15",
      description: "Study the Next.js 15 documentation",
      completed: false,
      userId: "user1",
      createdAt: "2023-10-15T10:00:00.000Z",
    },
    {
      id: "2",
      title: "Build a project",
      description: "Create a task management application",
      completed: true,
      userId: "user1",
      createdAt: "2023-10-16T14:30:00.000Z",
    },
    {
      id: "3",
      title: "Learn React Server Components",
      description: "Understand the new paradigm in Next.js 15",
      completed: false,
      userId: "user1",
      createdAt: "2023-10-17T09:15:00.000Z",
    },
  ];
  
  export async function GET() {
    return Response.json(tasks);
  }
  
  export async function POST(request) {
    try {
      const body = await request.json();
      const { title, description, userId } = body;
      
      if (!title) {
        return Response.json(
          { error: "Title is required" },
          { status: 400 }
        );
      }
      
      const newTask = {
        id: Date.now().toString(),
        title,
        description: description || "",
        completed: false,
        userId,
        createdAt: new Date().toISOString(),
      };
      
      tasks.push(newTask);
      
      return Response.json(newTask, { status: 201 });
    } catch (error) {
      console.error("Error creating task:", error);
      
      return Response.json(
        { message: "Failed to create task" },
        { status: 500 }
      );
    }
  }