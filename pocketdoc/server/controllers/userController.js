const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Check if user already exists
    const userResult = await db.execute(
      'SELECT * FROM Users WHERE Email = :email',
      { email },
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT } // Correctly access OUT_FORMAT_OBJECT
    );

    if (userResult.rows && userResult.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await db.execute(
      `INSERT INTO Users (Name, Email, Password, Address) 
       VALUES (:name, :email, :password, :address)`,
      { name, email, password: hashedPassword, address },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userResult = await db.execute(
      'SELECT * FROM Users WHERE Email = :email',
      { email },
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT } // Correctly access OUT_FORMAT_OBJECT
    );

    if (!userResult.rows || userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.PASSWORD);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.USERID, email: user.EMAIL },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user.USERID, name: user.NAME, email: user.EMAIL },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
