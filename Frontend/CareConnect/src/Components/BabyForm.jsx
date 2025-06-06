import React, { useState, useEffect } from 'react';
import './BabyDashboard.css';

const BabyForm = ({ onSubmit, initialData, clearEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    photo: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        gender: initialData.gender || '',
        birthDate: initialData.birthDate?.split('T')[0] || '',
        photo: initialData.photo || ''
      });
    } else {
      setFormData({ name: '', gender: '', birthDate: '', photo: '' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedBaby = {
      ...initialData, // preserves _id, email, notes, vaccinations if present
      ...formData     // updates the edited fields
    };

    onSubmit(updatedBaby);
    setFormData({ name: '', gender: '', birthDate: '', photo: '' });
  };

  return (
    <form className="baby-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Baby Name"
        required
        value={formData.name}
        onChange={handleChange}
      />
      <select
        name="gender"
        required
        value={formData.gender}
        onChange={handleChange}
      >
        <option value="">Select Gender</option>
        <option value="Male">Boy</option>
        <option value="Female">Girl</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="date"
        name="birthDate"
        required
        value={formData.birthDate}
        onChange={handleChange}
      />
      <input
        type="text"
        name="photo"
        placeholder="Photo URL (optional)"
        value={formData.photo}
        onChange={handleChange}
      />
      <button type="submit">{initialData ? 'Update Baby' : 'Add Baby'}</button>
      {initialData && (
        <button type="button" onClick={clearEdit}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default BabyForm;
