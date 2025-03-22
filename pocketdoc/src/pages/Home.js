// pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [stats, setStats] = useState({
    medicineCount: 0,
    userCount: 0,
    orderCount: 0
  });
  
  useEffect(() => {
    // Fetch statistics from backend
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to PocketDoc</h1>
        <p>Your personal medicine search and ordering application</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Search by Symptoms</h3>
            <p>Find the right medicine based on your symptoms</p>
          </div>
          <div className="feature-card">
            <h3>Order Online</h3>
            <p>Get medicines delivered to your doorstep</p>
          </div>
          <div className="feature-card">
            <h3>Secure Payments</h3>
            <p>Safe and easy payment options</p>
          </div>
        </div>
      </div>
      
      <div className="stats-section">
        <h2>PocketDoc at a Glance</h2>
        <div className="stats-cards">
          <div className="stats-card">
            <h3>{stats.medicineCount}</h3>
            <p>Medicines Available</p>
          </div>
          <div className="stats-card">
            <h3>{stats.userCount}</h3>
            <p>Registered Users</p>
          </div>
          <div className="stats-card">
            <h3>{stats.orderCount}</h3>
            <p>Orders Delivered</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
