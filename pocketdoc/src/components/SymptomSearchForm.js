import React, { useState, useEffect } from 'react';

function SymptomSearchForm({ onSearch }) {
  const [symptoms, setSymptoms] = useState([]); // All symptoms fetched from the backend
  const [filteredSymptoms, setFilteredSymptoms] = useState([]); // Filtered symptoms based on user input
  const [selectedSymptoms, setSelectedSymptoms] = useState([]); // Symptoms selected by the user
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Fetch all symptoms from the backend when the component loads
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/symptoms/common');
        if (!response.ok) throw new Error('Failed to fetch common symptoms');
        const data = await response.json();
        setSymptoms(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchSymptoms();
  }, []);

  // Filter symptoms based on user input
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSymptoms(symptoms);
    } else {
      setFilteredSymptoms(
        symptoms.filter((symptom) =>
          symptom.SymptomName?.toLowerCase().includes(searchTerm.toLowerCase()) // Validate `SymptomName` before calling `.toLowerCase()`
        )
      );
    }
  }, [searchTerm, symptoms]);

  // Handle checkbox selection
  const handleCheckboxChange = (symptomID) => {
    if (selectedSymptoms.includes(symptomID)) {
      setSelectedSymptoms(selectedSymptoms.filter((id) => id !== symptomID));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomID]);
    }
  };

  // Handle form submission to fetch medicines for selected symptoms
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom.');
      return;
    }
    onSearch(selectedSymptoms);
  };

  return (
    <div className="symptom-search-form">
      <h2>Search Medicine by Symptoms</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="search">Type a symptom:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Start typing a symptom..."
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="checkbox-list">
          {filteredSymptoms.map((symptom) => (
            <div key={symptom.SymptomID}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom.SymptomID)}
                  onChange={() => handleCheckboxChange(symptom.SymptomID)}
                />
                {symptom.SymptomName}
              </label>
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
    </div>
  );
}

export default SymptomSearchForm;
