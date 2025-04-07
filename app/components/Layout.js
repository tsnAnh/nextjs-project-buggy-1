import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useAuth } from './AuthContext';

export default function Layout({ children }) {
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const handleLogin = useCallback(() => {
    setError(null);
    
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    
    login(username, password)
      .catch(err => {
        setError(err.message);
      });
  }, []);
  
  useEffect(() => {
    console.log('Layout rendered', { user });
    document.title = user ? `Tasks for ${user.name}` : 'Task Manager';
  });
  
  return (
    <>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="A simple task manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-blue-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Task Manager</h1>
          
          {user ? (
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="bg-white text-blue-500 px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-2 py-1 rounded text-black"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-2 py-1 rounded text-black"
              />
              <button
                onClick={handleLogin}
                className="bg-white text-blue-500 px-4 py-1 rounded"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main>{children}</main>
      
      <footer className="bg-gray-200 p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Task Manager</p>
        </div>
      </footer>
    </>
  );
}