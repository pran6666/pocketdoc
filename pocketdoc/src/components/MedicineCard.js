import React from 'react';

function MedicineCard({ medicine, onAddToCart }) {
  return (
    <div className="medicine-card">
      <h3>{medicine.MEDICINENAME || medicine.name}</h3>
      <p>{medicine.DESCRIPTION || medicine.description}</p>
      <div className="medicine-details">
        <p><strong>Manufacturer:</strong> {medicine.MANUFACTURER || medicine.manufacturer}</p>
        <p><strong>Price:</strong> ${medicine.PRICE || medicine.price}</p>
      </div>
      <button onClick={() => onAddToCart(medicine)} className="btn btn-secondary">Add to Cart</button>
    </div>
  );
}

export default MedicineCard;
