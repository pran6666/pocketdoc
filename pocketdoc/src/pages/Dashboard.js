// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ user }) {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/recent', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch recent orders');
        }
        
        setRecentOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <div className="dashboard-page">
      <h2>Welcome, {user.name}!</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Find Medicines</h3>
          <p>Search for medicines based on your symptoms</p>
          <Link to="/symptom-search" className="btn btn-primary">Search Now</Link>
        </div>
        <div className="dashboard-card">
          <h3>My Orders</h3>
          <p>View your order history and track current orders</p>
          <Link to="/orders" className="btn btn-primary">View Orders</Link>
        </div>
        <div className="dashboard-card">
          <h3>Shopping Cart</h3>
          <p>View and manage items in your cart</p>
          <Link to="/cart" className="btn btn-primary">Go to Cart</Link>
        </div>
      </div>
      
      {loading ? (
        <p>Loading recent orders...</p>
      ) : (
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.ORDERID}>
                    <td>{order.ORDERID}</td>
                    <td>{new Date(order.ORDERDATE).toLocaleDateString()}</td>
                    <td>{order.STATUS}</td>
                    <td>${order.TOTAL_AMOUNT}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>You haven't placed any orders yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
