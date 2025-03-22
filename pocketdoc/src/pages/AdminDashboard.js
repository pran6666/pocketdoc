// pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('medicines');
  const [medicines, setMedicines] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states for adding/editing
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    description: '',
    manufacturer: '',
    price: ''
  });
  const [symptomForm, setSymptomForm] = useState({
    name: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      let endpoint = '';
      
      switch(activeTab) {
        case 'medicines':
          endpoint = 'http://localhost:5000/api/admin/medicines';
          break;
        case 'symptoms':
          endpoint = 'http://localhost:5000/api/admin/symptoms';
          break;
        case 'users':
          endpoint = 'http://localhost:5000/api/admin/users';
          break;
        default:
          return;
      }
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch data');
      }
      
      switch(activeTab) {
        case 'medicines':
          setMedicines(data);
          break;
        case 'symptoms':
          setSymptoms(data);
          break;
        case 'users':
          setUsers(data);
          break;
        default:
          return;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMedicineSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `http://localhost:5000/api/admin/medicines/${currentItemId}` 
        : 'http://localhost:5000/api/admin/medicines';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: medicineForm.name,
          description: medicineForm.description,
          manufacturer: medicineForm.manufacturer,
          price: parseFloat(medicineForm.price)
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Operation failed');
      }
      
      // Reset form and refresh data
      setMedicineForm({ name: '', description: '', manufacturer: '', price: '' });
      setIsEditing(false);
      setCurrentItemId(null);
      fetchData();
      
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleSymptomSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `http://localhost:5000/api/admin/symptoms/${currentItemId}` 
        : 'http://localhost:5000/api/admin/symptoms';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: symptomForm.name
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Operation failed');
      }
      
      // Reset form and refresh data
      setSymptomForm({ name: '' });
      setIsEditing(false);
      setCurrentItemId(null);
      fetchData();
      
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleEdit = (item, type) => {
    if (type === 'medicine') {
      setMedicineForm({
        name: item.MEDICINENAME,
        description: item.DESCRIPTION || '',
        manufacturer: item.MANUFACTURER,
        price: item.PRICE
      });
      setCurrentItemId(item.MEDICINEID);
    } else if (type === 'symptom') {
      setSymptomForm({
        name: item.SYMPTOMNAME
      });
      setCurrentItemId(item.SYMPTOMID);
    }
    setIsEditing(true);
  };
  
  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      let url = '';
      
      if (type === 'medicine') {
        url = `http://localhost:5000/api/admin/medicines/${id}`;
      } else if (type === 'symptom') {
        url = `http://localhost:5000/api/admin/symptoms/${id}`;
      } else if (type === 'user') {
        url = `http://localhost:5000/api/admin/users/${id}`;
      }
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Delete operation failed');
      }
      
      fetchData();
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'medicines' ? 'active' : ''}`}
          onClick={() => setActiveTab('medicines')}
        >
          Medicines
        </button>
        <button 
          className={`tab-button ${activeTab === 'symptoms' ? 'active' : ''}`}
          onClick={() => setActiveTab('symptoms')}
        >
          Symptoms
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>
      
      <div className="tab-content">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            {activeTab === 'medicines' && (
              <div className="medicines-tab">
                <h3>{isEditing ? 'Edit Medicine' : 'Add New Medicine'}</h3>
                <form onSubmit={handleMedicineSubmit}>
                  <div className="form-group">
                    <label htmlFor="medicineName">Name:</label>
                    <input
                      type="text"
                      id="medicineName"
                      value={medicineForm.name}
                      onChange={(e) => setMedicineForm({...medicineForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="medicineDescription">Description:</label>
                    <textarea
                      id="medicineDescription"
                      value={medicineForm.description}
                      onChange={(e) => setMedicineForm({...medicineForm, description: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="medicineManufacturer">Manufacturer:</label>
                    <input
                      type="text"
                      id="medicineManufacturer"
                      value={medicineForm.manufacturer}
                      onChange={(e) => setMedicineForm({...medicineForm, manufacturer: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="medicinePrice">Price:</label>
                    <input
                      type="number"
                      id="medicinePrice"
                      value={medicineForm.price}
                      onChange={(e) => setMedicineForm({...medicineForm, price: e.target.value})}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Update Medicine' : 'Add Medicine'}
                  </button>
                  {isEditing && (
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setMedicineForm({ name: '', description: '', manufacturer: '', price: '' });
                        setIsEditing(false);
                        setCurrentItemId(null);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </form>
                
                <h3>Manage Medicines</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Manufacturer</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((medicine) => (
                      <tr key={medicine.MEDICINEID}>
                        <td>{medicine.MEDICINEID}</td>
                        <td>{medicine.MEDICINENAME}</td>
                        <td>{medicine.MANUFACTURER}</td>
                        <td>${medicine.PRICE}</td>
                        <td>
                          <button 
                            className="btn-edit"
                            onClick={() => handleEdit(medicine, 'medicine')}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(medicine.MEDICINEID, 'medicine')}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'symptoms' && (
              <div className="symptoms-tab">
                <h3>{isEditing ? 'Edit Symptom' : 'Add New Symptom'}</h3>
                <form onSubmit={handleSymptomSubmit}>
                  <div className="form-group">
                    <label htmlFor="symptomName">Name:</label>
                    <input
                      type="text"
                      id="symptomName"
                      value={symptomForm.name}
                      onChange={(e) => setSymptomForm({...symptomForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Update Symptom' : 'Add Symptom'}
                  </button>
                  {isEditing && (
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setSymptomForm({ name: '' });
                        setIsEditing(false);
                        setCurrentItemId(null);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </form>
                
                <h3>Manage Symptoms</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {symptoms.map((symptom) => (
                      <tr key={symptom.SYMPTOMID}>
                        <td>{symptom.SYMPTOMID}</td>
                        <td>{symptom.SYMPTOMNAME}</td>
                        <td>
                          <button 
                            className="btn-edit"
                            onClick={() => handleEdit(symptom, 'symptom')}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(symptom.SYMPTOMID, 'symptom')}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'users' && (
              <div className="users-tab">
                <h3>Manage Users</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.USERID}>
                        <td>{user.USERID}</td>
                        <td>{user.NAME}</td>
                        <td>{user.EMAIL}</td>
                        <td>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(user.USERID, 'user')}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
