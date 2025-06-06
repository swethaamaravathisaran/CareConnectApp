import React from 'react';
import './BabyDashBoard.css';

const BabyCard = ({ baby, onEdit, onDelete }) => {
  return (
    <div className="baby-card">
      {baby.photo && <img src={baby.photo} alt="Baby" className="baby-photo" />}
      <h3>{baby.name}</h3>
      <p>Gender: {baby.gender}</p>
      <p>Birth Date: {new Date(baby.birthDate).toLocaleDateString()}</p>
      <div className="baby-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete} className="delete-btn">Delete</button>
      </div>
    </div>
  );
};

export default BabyCard;
