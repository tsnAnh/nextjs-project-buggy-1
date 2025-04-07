export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (username === "user" && password === "password") {
            return Response.json({
                id: "user1",
                username: "user",
                name: "Test User",
            });
        }

        return Response.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Authentication error:", error);

        return Response.json(
            { error: "Authentication failed" },
            { status: 500 }
        );
    }
}