const db = require('../db');

// Medicine management
exports.getAllMedicines = async (req, res) => {
  try {
    const result = await db.execute(
      'SELECT * FROM Medicine ORDER BY MedicineName',
      [],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addMedicine = async (req, res) => {
  try {
    const { name, description, manufacturer, price } = req.body;
    
    const result = await db.execute(
      `INSERT INTO Medicine (MedicineName, Description, Manufacturer, Price) 
       VALUES (:name, :description, :manufacturer, :price)`,
      { 
        name, 
        description, 
        manufacturer, 
        price: parseFloat(price)
      },
      { autoCommit: true }
    );
    
    res.status(201).json({ message: 'Medicine added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, manufacturer, price } = req.body;
    
    const result = await db.execute(
      `UPDATE Medicine 
       SET MedicineName = :name, 
           Description = :description, 
           Manufacturer = :manufacturer, 
           Price = :price 
       WHERE MedicineID = :id`,
      { 
        name, 
        description, 
        manufacturer, 
        price: parseFloat(price),
        id
      },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    res.json({ message: 'Medicine updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.execute(
      'DELETE FROM Medicine WHERE MedicineID = :id',
      { id },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Symptom management
exports.getAllSymptoms = async (req, res) => {
  try {
    const result = await db.execute(
      'SELECT * FROM Symptom ORDER BY SymptomName',
      [],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addSymptom = async (req, res) => {
  try {
    const { name } = req.body;
    
    const result = await db.execute(
      'INSERT INTO Symptom (SymptomName) VALUES (:name)',
      { name },
      { autoCommit: true }
    );
    
    res.status(201).json({ message: 'Symptom added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSymptom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const result = await db.execute(
      'UPDATE Symptom SET SymptomName = :name WHERE SymptomID = :id',
      { name, id },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Symptom not found' });
    }
    
    res.json({ message: 'Symptom updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteSymptom = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.execute(
      'DELETE FROM Symptom WHERE SymptomID = :id',
      { id },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Symptom not found' });
    }
    
    res.json({ message: 'Symptom deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User management
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.execute(
      'SELECT UserID, Name, Email, Address FROM Users',
      [],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.execute(
      'DELETE FROM Users WHERE UserID = :id',
      { id },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Order management
exports.getAllOrders = async (req, res) => {
  try {
    const result = await db.execute(
      `SELECT o.*, u.Name as UserName
       FROM Orders o
       JOIN Users u ON o.UserID = u.UserID
       ORDER BY o.OrderDate DESC`,
      [],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const result = await db.execute(
      'UPDATE Orders SET Status = :status WHERE OrderID = :id',
      { status, id },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const medicineCountResult = await db.execute(
      'SELECT COUNT(*) as count FROM Medicine',
      [],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    const userCountResult = await db.execute(
      'SELECT COUNT(*) as count FROM Users',
      [],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    const orderCountResult = await db.execute(
      'SELECT COUNT(*) as count FROM Orders',
      [],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    res.json({
      medicineCount: medicineCountResult.rows[0].COUNT,
      userCount: userCountResult.rows[0].COUNT,
      orderCount: orderCountResult.rows[0].COUNT
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
