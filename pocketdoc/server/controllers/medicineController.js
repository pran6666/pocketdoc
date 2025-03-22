const db = require('../db');

exports.searchBySymptoms = async (req, res) => {
  try {
    const { symptomIDs } = req.body;

    // Validate input
    if (!symptomIDs || !Array.isArray(symptomIDs) || symptomIDs.length === 0) {
      return res.status(400).json({ message: 'Invalid input: symptomIDs must be a non-empty array' });
    }

    // Build query dynamically based on symptom IDs
    const query = `
      SELECT DISTINCT m.MedicineID, m.MedicineName, m.Description, m.Manufacturer, m.Price 
      FROM Medicine m
      JOIN SymptomDrugMapping sdm ON m.MedicineID = sdm.DrugID
      WHERE sdm.SymptomID IN (${symptomIDs.map((_, index) => `:${index}`).join(', ')})
    `;

    // Create binding parameters for query
    const bindParams = {};
    symptomIDs.forEach((id, index) => {
      bindParams[index] = id;
    });

    // Execute query
    const result = await db.execute(query, bindParams);

    // Return medicines or an empty array if no results are found
    res.json(result.rows || []);
  } catch (error) {
    console.error('Error searching medicines:', error);
    res.status(500).json({ message: 'Failed to search medicines', error: error.message });
  }
};
