// pages/Orders.js
import React, { useState, useEffect } from 'react';
import OrderItem from '../components/OrderItem';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }
      
      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading your orders...</p>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {error && <div className="error-message">{error}</div>}
      
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <OrderItem 
              key={order.ORDERID} 
              order={{
                id: order.ORDERID,
                date: new Date(order.ORDERDATE).toLocaleDateString(),
                status: order.STATUS,
                total: order.TOTAL_AMOUNT,
                items: order.ITEMS || []
              }} 
            />
          ))}
        </div>
      ) : (
        <p>You haven't placed any orders yet.</p>
      )}
    </div>
  );
}

export default Orders;
