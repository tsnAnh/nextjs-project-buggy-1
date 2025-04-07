"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log("Auth state changed", { user, loading, error });
  });
  
  useEffect(() => {
    const loadUser = () => {
      setLoading(true);
      
      try {
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error("Failed to load user from localStorage:", err);
        localStorage.removeItem("user");
        setError("Failed to restore your session");
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  });
  
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Authentication failed");
      }
      
      const userData = await response.json();
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  
  const value = {
    user,
    loading,
    error,
    login,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
