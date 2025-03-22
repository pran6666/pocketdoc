import React from 'react';

function OrderItem({ order }) {
  // Handle both frontend mock data format and backend Oracle format
  const orderId = order.id || order.ORDERID;
  const orderDate = order.date || (order.ORDERDATE ? new Date(order.ORDERDATE).toLocaleDateString() : '');
  const orderStatus = order.status || order.STATUS;
  const orderTotal = order.total || order.TOTAL_AMOUNT;
  
  // Handle different item formats from backend
  const orderItems = order.items || [];

  return (
    <div className="order-item">
      <div className="order-header">
        <h3>Order #{orderId}</h3>
        <span className={`order-status status-${orderStatus?.toLowerCase()}`}>
          {orderStatus}
        </span>
      </div>
      <div className="order-details">
        <p><strong>Date:</strong> {orderDate}</p>
        <p><strong>Total:</strong> ${typeof orderTotal === 'number' ? orderTotal.toFixed(2) : orderTotal}</p>
      </div>
      <div className="order-items">
        <h4>Items:</h4>
        <ul>
          {orderItems.map((item, index) => (
            <li key={index}>
              {item.name || item.MEDICINENAME} - Qty: {item.quantity || item.QUANTITY} - ${item.price || item.PRICE_PER_UNIT}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrderItem;
