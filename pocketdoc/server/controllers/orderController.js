const db = require('../db');

// Get all orders for current user
exports.getUserOrders = async (req, res) => {
  try {
    const result = await db.execute(
      `SELECT o.*, 
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'MEDICINEID', m.MedicineID,
            'MEDICINENAME', m.MedicineName,
            'QUANTITY', oi.Quantity,
            'PRICE_PER_UNIT', m.Price
          )
        ) FROM Orders oi
        JOIN Medicine m ON oi.MedicineID = m.MedicineID
        WHERE oi.OrderID = o.OrderID) as ITEMS
      FROM Orders o
      WHERE o.UserID = :userId
      ORDER BY o.OrderDate DESC`,
      [req.user.id],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    // Parse JSON string to actual objects
    const orders = result.rows.map(order => ({
      ...order,
      ITEMS: order.ITEMS ? JSON.parse(order.ITEMS) : []
    }));
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent orders for dashboard
exports.getRecentOrders = async (req, res) => {
  try {
    const result = await db.execute(
      `SELECT * FROM Orders
       WHERE UserID = :userId
       ORDER BY OrderDate DESC
       FETCH FIRST 5 ROWS ONLY`,
      [req.user.id],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  let connection;
  try {
    connection = await db.oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING
    });
    
    await connection.execute('BEGIN TRANSACTION');
    
    // Get cart items
    const cartResult = await connection.execute(
      `SELECT c.*, m.Price 
       FROM Cart c
       JOIN Medicine m ON c.MedicineID = m.MedicineID
       WHERE c.UserID = :userId`,
      [req.user.id],
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (cartResult.rows.length === 0) {
      await connection.execute('ROLLBACK');
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Calculate total
    const totalAmount = cartResult.rows.reduce(
      (sum, item) => sum + (item.PRICE * item.QUANTITY), 
      0
    );
    
    // Create order
    const orderResult = await connection.execute(
      `INSERT INTO Orders (UserID, TOTAL_AMOUNT, Status, OrderDate, DeliveryAddress) 
       VALUES (:userId, :totalAmount, 'Processing', CURRENT_TIMESTAMP, :address)
       RETURNING OrderID INTO :orderId`,
      { 
        userId: req.user.id, 
        totalAmount, 
        address: req.body.delivery_address || '',
        orderId: { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT }
      },
      { autoCommit: false }
    );
    
    const orderId = orderResult.outBinds.orderId[0];
    
    // Add order items and update inventory
    for (const item of cartResult.rows) {
      await connection.execute(
        `INSERT INTO OrderItems (OrderID, MedicineID, Quantity, Price) 
         VALUES (:orderId, :medicineId, :quantity, :price)`,
        {
          orderId,
          medicineId: item.MEDICINEID,
          quantity: item.QUANTITY,
          price: item.PRICE
        },
        { autoCommit: false }
      );
      
      // Update medicine stock (if you have stock tracking)
      await connection.execute(
        `UPDATE Medicine 
         SET StockQuantity = StockQuantity - :quantity 
         WHERE MedicineID = :medicineId`,
        {
          quantity: item.QUANTITY,
          medicineId: item.MEDICINEID
        },
        { autoCommit: false }
      );
    }
    
    // Clear cart
    await connection.execute(
      `DELETE FROM Cart WHERE UserID = :userId`,
      [req.user.id],
      { autoCommit: false }
    );
    
    // Create payment record
    await connection.execute(
      `INSERT INTO Payment (OrderID, Amount, PaymentMethod, PaymentStatus, PaymentDate) 
       VALUES (:orderId, :amount, 'Cash on Delivery', 'Pending', CURRENT_TIMESTAMP)`,
      {
        orderId,
        amount: totalAmount
      },
      { autoCommit: false }
    );
    
    await connection.execute('COMMIT');
    
    res.status(201).json({ 
      message: 'Order created successfully', 
      orderId,
      totalAmount
    });
  } catch (error) {
    if (connection) {
      await connection.execute('ROLLBACK');
    }
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.execute(
      `SELECT o.*, 
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'MEDICINEID', m.MedicineID,
            'MEDICINENAME', m.MedicineName,
            'QUANTITY', oi.Quantity,
            'PRICE_PER_UNIT', oi.Price
          )
        ) FROM OrderItems oi
        JOIN Medicine m ON oi.MedicineID = m.MedicineID
        WHERE oi.OrderID = o.OrderID) as ITEMS
      FROM Orders o
      WHERE o.OrderID = :id AND o.UserID = :userId`,
      { id, userId: req.user.id },
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Parse JSON string to actual objects
    const order = {
      ...result.rows[0],
      ITEMS: result.rows[0].ITEMS ? JSON.parse(result.rows[0].ITEMS) : []
    };
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Get all orders
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

// Admin: Update order status
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
