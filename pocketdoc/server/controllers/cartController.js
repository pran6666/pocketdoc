const db = require('../db');

exports.getCart = async (req, res) => {
  try {
    const result = await db.execute(
      `SELECT c.*, m.MedicineName, m.Price 
       FROM Cart c
       JOIN Medicine m ON c.MedicineID = m.MedicineID
       WHERE c.UserID = :userId`,
      [req.user.id],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { medicine_id, quantity } = req.body;
    
    // Check if item already in cart
    const existingResult = await db.execute(
      `SELECT * FROM Cart WHERE UserID = :userId AND MedicineID = :medicineId`,
      [req.user.id, medicine_id],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (existingResult.rows.length > 0) {
      // Update quantity
      await db.execute(
        `UPDATE Cart 
         SET Quantity = Quantity + :quantity 
         WHERE UserID = :userId AND MedicineID = :medicineId`,
        {
          quantity: parseInt(quantity),
          userId: req.user.id,
          medicineId: medicine_id
        }
      );
    } else {
      // Add new item
      await db.execute(
        `INSERT INTO Cart (UserID, MedicineID, Quantity) 
         VALUES (:userId, :medicineId, :quantity)`,
        {
          userId: req.user.id,
          medicineId: medicine_id,
          quantity: parseInt(quantity)
        }
      );
    }
    
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
