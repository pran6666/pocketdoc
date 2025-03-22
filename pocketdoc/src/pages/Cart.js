import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();
  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Paracetamol',
      price: 5.99,
      quantity: 2,
    },
    {
      id: 2,
      name: 'Ibuprofen',
      price: 7.49,
      quantity: 1,
    },
  ]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    alert('Order placed successfully!');
    setCartItems([]);
    navigate('/orders');
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>${item.price}</p>
                </div>
                <div className="item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="btn-quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="btn-quantity"
                  >
                    +
                  </button>
                </div>
                <div className="item-subtotal">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="summary-item">
              <span>Shipping:</span>
              <span>$5.00</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>${(parseFloat(calculateTotal()) + 5).toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="btn btn-primary">Checkout</button>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/symptom-search" className="btn btn-primary">Shop Now</Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
