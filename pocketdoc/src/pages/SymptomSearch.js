import React, { useState } from 'react';
import SymptomSearchForm from '../components/SymptomSearchForm';
import MedicineCard from '../components/MedicineCard';

function SymptomSearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (selectedSymptoms) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/medicines/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptomIDs: selectedSymptoms }),
      });

      if (!response.ok) throw new Error('Failed to search medicines');

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="symptom-search-page">
      <SymptomSearchForm onSearch={handleSearch} />
      
      {loading && <p>Loading...</p>}
      {error && <div className="error-message">{error}</div>}
      
      {searchResults.length > 0 ? (
        <div className="medicine-list">
          {searchResults.map((medicine) => (
            <MedicineCard key={medicine.MedicineID} medicine={medicine} />
          ))}
        </div>
      ) : (
        !loading && <p>No medicines found for the selected symptoms.</p>
      )}
    </div>
  );
}

export default SymptomSearch;
