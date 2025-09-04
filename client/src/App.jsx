import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">URL Shortener</Link>
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <span className="text-sm text-gray-600">{email}</span>
              <button onClick={logout} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 hover:underline">Login</Link>
              <Link to="/register" className="px-3 py-1.5 hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function Protected({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}