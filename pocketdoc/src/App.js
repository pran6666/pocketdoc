// App.js - Main component
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SymptomSearch from './pages/SymptomSearch';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const userIsAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
      setIsAdmin(userIsAdmin);
    }
  }, []);

  const handleLogin = (userData, admin = false) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
    setUser(userData);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAdmin', admin);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
  };

  return (
    <Router>
      <div className="app">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/symptom-search" 
              element={isLoggedIn ? <SymptomSearch /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/cart" 
              element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/orders" 
              element={isLoggedIn ? <Orders /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={(isLoggedIn && isAdmin) ? <AdminDashboard /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
