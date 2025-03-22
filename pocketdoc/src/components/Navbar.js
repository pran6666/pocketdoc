import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, isAdmin, onLogout }) {
  const handleLogout = () => {
    // Clear token from localStorage when logging out
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">PocketDoc</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/symptom-search" className="nav-link">Search Symptoms</Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="nav-link">Cart</Link>
            </li>
            <li className="nav-item">
              <Link to="/orders" className="nav-link">My Orders</Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link to="/admin" className="nav-link">Admin Panel</Link>
              </li>
            )}
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link btn-link">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
