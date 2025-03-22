const db = require('../db');

// Get all symptoms
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

// Get common symptoms for quick selection


exports.getCommonSymptoms = async (req, res) => {
  try {
    const result = await db.execute(
      `SELECT SymptomID, SymptomName FROM Symptom ORDER BY SymptomName`
    );

    res.json(result.rows || []); // Return an empty array if no rows are found
  } catch (error) {
    console.error('Error fetching common symptoms:', error);
    res.status(500).json({ message: 'Failed to fetch common symptoms', error: error.message });
  }
};


// Search medicines by symptoms
exports.searchBySymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    // Split symptoms by commas or spaces
    const symptomKeywords = symptoms.split(/[,\s]+/).filter(s => s.length > 2);
    
    if (symptomKeywords.length === 0) {
      return res.json([]);
    }
    
    // Create search conditions for each keyword
    let query = `
      SELECT DISTINCT m.* 
      FROM Medicine m
      JOIN SymptomDrugMapping sdm ON m.MedicineID = sdm.DrugID
      JOIN Symptom s ON sdm.SymptomID = s.SymptomID
      WHERE `;
    
    const conditions = symptomKeywords.map((_, index) => 
      `LOWER(s.SymptomName) LIKE LOWER(:symptom${index})`
    ).join(' OR ');
    
    query += conditions;
    
    // Create bind parameters
    const bindParams = {};
    symptomKeywords.forEach((keyword, index) => {
      bindParams[`symptom${index}`] = `%${keyword}%`;
    });
    
    const result = await db.execute(
      query,
      bindParams,
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add new symptom (admin only)
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

// Update symptom (admin only)
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

// Delete symptom (admin only)
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
