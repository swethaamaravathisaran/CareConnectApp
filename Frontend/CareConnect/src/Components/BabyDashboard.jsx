import React, { useState, useEffect } from 'react';
import './BabyDashboard.css';

const BabyForm = ({ onAdd, onClose, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [gender, setGender] = useState(initialData?.gender || '');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const babyData = {
      id: initialData?.id || Date.now(),
      name,
      gender,
      birthDate,
      photoUrl,
    };
    onAdd(babyData);
    onClose();
  };

  return (
    <div className="fullscreen-form">
      <div className="fullscreen-form-content">
        <button className="close-form-btn" onClick={onClose}>×</button>
        <h2>{initialData ? 'Edit Baby' : 'Add Baby'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Baby Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Photo URL (optional)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <button type="submit">{initialData ? 'Update' : 'Add'} Baby</button>
        </form>
      </div>
    </div>
  );
};

const BabyDashboard = () => {
  const [babies, setBabies] = useState(() => {
    const storedBabies = localStorage.getItem('babies');
    return storedBabies ? JSON.parse(storedBabies) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingBaby, setEditingBaby] = useState(null);

  useEffect(() => {
    localStorage.setItem('babies', JSON.stringify(babies));
  }, [babies]);

  const handleAddBaby = (baby) => {
    if (editingBaby) {
      setBabies((prev) => prev.map((b) => (b.id === baby.id ? baby : b)));
    } else {
      setBabies((prev) => [...prev, baby]);
    }
  };

  const handleDelete = (id) => {
    setBabies((prev) => prev.filter((b) => b.id !== id));
  };

  const handleEdit = (baby) => {
    setEditingBaby(baby);
    setShowForm(true);
  };

  return (
    <div className="dashboard-container">
      <h1>👶 Baby Profile Dashboard</h1>
      <button className="add-baby-btn" onClick={() => { setEditingBaby(null); setShowForm(true); }}>
        + Add Baby
      </button>

      <div className="baby-cards">
        {babies.map((baby) => (
          <div className="baby-card" key={baby.id}>
            <img
              src={baby.photoUrl || 'https://cdn-icons-png.flaticon.com/512/2331/2331959.png'}
              alt="Baby"
              className="baby-photo"
            />
            <h3>{baby.name}</h3>
            <p>Gender: {baby.gender}</p>
            <p>DOB: {baby.birthDate}</p>
            <div className="baby-actions">
              <button className="edit-btn" onClick={() => handleEdit(baby)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(baby.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <BabyForm
          onAdd={handleAddBaby}
          onClose={() => setShowForm(false)}
          initialData={editingBaby}
        />
      )}
    </div>
  );
};

export default BabyDashboard;
