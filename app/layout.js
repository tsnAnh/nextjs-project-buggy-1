"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "./components/AuthContext";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  console.log("Current path:", pathname);
  
  return (
    <html lang="en">
      <head>
        <title>Task Manager</title>
        <meta name="description" content="A task management application" />
      </head>
      <body>
        {/* BUG: Missing error boundary around AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}