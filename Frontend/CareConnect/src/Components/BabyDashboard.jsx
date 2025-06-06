import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './BabyDashboard.css';
import BabyForm from './BabyForm';

const API_BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const axiosWithToken = axios.create({ baseURL: API_BASE });
axiosWithToken.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const sendVaccinationEmail = async ({ email, vaccineName, date }) => {
  try {
    const res = await fetch(`${API_BASE}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        to: email,
        subject: `Vaccination Reminder for ${vaccineName}`,
        text: `Dear Parent,\n\nThis is a reminder that ${vaccineName} is scheduled for ${date}.\n\n- BabyCare Dashboard`,
      }),
    });
    if (!res.ok) throw new Error('Failed to send');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

const getNotesFromStorage = (babyId) => {
  const allNotes = JSON.parse(localStorage.getItem('babyNotes') || '{}');
  return allNotes[babyId] || [];
};

const saveNotesToStorage = (babyId, notes) => {
  const allNotes = JSON.parse(localStorage.getItem('babyNotes') || '{}');
  allNotes[babyId] = notes;
  localStorage.setItem('babyNotes', JSON.stringify(allNotes));
};

const NotesCard = ({ babyId, notes = [], onAddNote, onEditNote, onDeleteNote }) => {
  const [showNotes, setShowNotes] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      id: Date.now(),
      text: noteText.trim(),
      date: new Date().toISOString(),
    };
    onAddNote(babyId, newNote);
    setNoteText('');
  };

  return (
    <div className="notes-card">
      <div className="notes-header">
        <h4>📝 Parent Notes & Tips</h4>
        <button onClick={() => setShowNotes(!showNotes)} className="toggle-notes-btn">
          {showNotes ? 'Hide' : 'Show'}
        </button>
      </div>

      {showNotes && (
        <>
          <form onSubmit={handleSubmit} className="notes-form">
            <textarea
              placeholder="Write a note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              required
            />
            <button type="submit">Add Note</button>
          </form>
          <ul className="notes-list">
            {notes.map((note, index) => (
              <li key={note.id ?? index} className="note-item">
                {editingIndex === index ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onEditNote(babyId, index, editingText);
                      setEditingIndex(null);
                      setEditingText('');
                    }}
                  >
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows={3}
                      required
                    />
                    <div className="note-actions">
                      <button type="submit" className="edit">Save</button>
                      <button type="button" onClick={() => setEditingIndex(null)} className="delete">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>{note.text}</div>
                    <small>{new Date(note.date).toLocaleString()}</small>
                    <div className="note-item-actions">
                      <button onClick={() => { setEditingIndex(index); setEditingText(note.text); }} className="edit">Edit</button>
                      <button onClick={() => onDeleteNote(babyId, index)} className="delete">Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const BabyDashboard = () => {
  const navigate = useNavigate();
  const [babies, setBabies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBaby, setEditingBaby] = useState(null);
  const [emailMessage, setEmailMessage] = useState(null);

  const fetchBabies = async () => {
    try {
      const res = await axiosWithToken.get('/babies');
      const babiesData = res.data;

      const babiesWithVaccinations = await Promise.all(
        babiesData.map(async (baby) => {
          const vaccRes = await axiosWithToken.get(`/vaccinations/${baby._id}`);
          const notes = getNotesFromStorage(baby._id);
          return { ...baby, vaccinations: vaccRes.data, notes };
        })
      );

      setBabies(babiesWithVaccinations);
    } catch (error) {
      console.error('Failed to fetch babies or vaccinations', error);
    }
  };

  useEffect(() => {
    fetchBabies();
  }, []);

  const handleAddBaby = async (baby) => {
    try {
      if (baby._id) {
        const res = await axiosWithToken.put(`/babies/${baby._id}`, baby);
        setBabies((prev) =>
          prev.map((b) =>
            b._id === baby._id
              ? { ...res.data, vaccinations: b.vaccinations, notes: b.notes } // ✅ PRESERVE data
              : b
          )
        );
      } else {
        const res = await axiosWithToken.post('/babies', baby);
        setBabies((prev) => [...prev, { ...res.data, vaccinations: [], notes: [] }]);
      }
    } catch {
      alert('Failed to save baby.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirm delete?')) return;
    await axiosWithToken.delete(`/babies/${id}`);
    setBabies((prev) => prev.filter((b) => b._id !== id));
  };

  const handleAddVaccination = async (babyId, name, date) => {
    const { data } = await axiosWithToken.post(`/vaccinations`, {
      baby: babyId,
      vaccineName: name,
      scheduledDate: date,
      status: 'Pending',
    });

    setBabies((prev) =>
      prev.map((b) =>
        b._id === babyId ? { ...b, vaccinations: [...(b.vaccinations || []), data] } : b
      )
    );

    const baby = babies.find((b) => b._id === babyId);
    if (baby?.email) {
      const result = await sendVaccinationEmail({ email: baby.email, vaccineName: name, date });
      setEmailMessage(result.success ? '📩 Email sent!' : `❌ ${result.error}`);
      setTimeout(() => setEmailMessage(null), 3000);
    }
  };

  const handleMarkCompleted = async (babyId, vaccId) => {
    const { data } = await axiosWithToken.put(`/vaccinations/${vaccId}`, { status: 'Completed' });
    setBabies((prev) =>
      prev.map((b) =>
        b._id === babyId
          ? { ...b, vaccinations: b.vaccinations.map((v) => (v._id === vaccId ? data : v)) }
          : b
      )
    );
  };

  const handleAddNote = (babyId, note) => {
    setBabies((prev) =>
      prev.map((baby) =>
        baby._id === babyId
          ? { ...baby, notes: [...(baby.notes || []), note] }
          : baby
      )
    );
    saveNotesToStorage(babyId, [...getNotesFromStorage(babyId), note]);
  };

  const handleEditNote = (babyId, index, newText) => {
    const notes = getNotesFromStorage(babyId);
    notes[index] = { ...notes[index], text: newText, date: new Date().toISOString() };
    saveNotesToStorage(babyId, notes);
    setBabies((prev) =>
      prev.map((baby) => (baby._id === babyId ? { ...baby, notes } : baby))
    );
  };

  const handleDeleteNote = (babyId, index) => {
    const notes = getNotesFromStorage(babyId).filter((_, i) => i !== index);
    saveNotesToStorage(babyId, notes);
    setBabies((prev) =>
      prev.map((baby) => (baby._id === babyId ? { ...baby, notes } : baby))
    );
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBaby(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👶 Baby Profile Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <button
        className="add-baby-btn"
        onClick={() => {
          setShowForm(true);
          setEditingBaby(null);
        }}
      >
        + Add Baby
      </button>

      {emailMessage && <div className="email-feedback">{emailMessage}</div>}

      <div className="baby-cards">
        {babies.map((baby) => (
          <div className="baby-card" key={baby._id}>
            <div className="baby-info">
              <img
                src={baby.photo || 'https://cdn-icons-png.flaticon.com/512/2331/2331959.png'}
                alt="Baby"
                className="baby-photo"
              />
              <h3>{baby.name}</h3>
              <p>Gender: {baby.gender}</p>
              <p>DOB: {baby.birthDate}</p>
              <div className="baby-actions">
                <button onClick={() => { setEditingBaby(baby); setShowForm(true); }}>Edit</button>
                <button onClick={() => handleDelete(baby._id)}>Delete</button>
              </div>
            </div>

            <div className="divider"></div>

            <div className="vaccination-section">
              <h4>💉 Vaccinations Timeline</h4>
              <VerticalTimeline layout="1-column-left">
                {(baby.vaccinations || []).map((v) => (
                  <VerticalTimelineElement
                    key={v._id}
                    date={v.scheduledDate}
                    iconStyle={{ background: v.status === 'Completed' ? 'green' : '#f39c12', color: '#fff' }}
                    contentStyle={{ borderTop: v.status === 'Completed' ? '4px solid green' : '4px solid #f39c12' }}
                  >
                    <h3>{v.vaccineName}</h3>
                    <p>Status: <strong>{v.status}</strong></p>
                    {v.status === 'Pending' && (
                      <button onClick={() => handleMarkCompleted(baby._id, v._id)}>Mark as Completed</button>
                    )}
                  </VerticalTimelineElement>
                ))}
              </VerticalTimeline>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = e.target.vaccineName.value;
                  const date = e.target.scheduledDate.value;
                  handleAddVaccination(baby._id, name, date);
                  e.target.reset();
                }}
              >
                <input name="vaccineName" placeholder="Vaccine Name" required />
                <input name="scheduledDate" type="date" required />
                <button type="submit">Add</button>
              </form>
            </div>

            <NotesCard
              babyId={baby._id}
              notes={baby.notes}
              onAddNote={handleAddNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        ))}

        {/* 🎵 Lullaby Recommender Section */}
        <div className="lullaby-section">
        <div className="lullaby-container">
          <h2>🎵 Lullaby Recommender</h2>
          <p>
            Soothe your baby with specially curated lullabies based on their mood.
            Choose from <strong>Calm</strong>, <strong>Playful</strong>, or <strong>Sleepy</strong> moods
            and get instant suggestions with lyrics or links to baby-friendly music.
          </p>
          <button
            onClick={() => navigate('/lullaby')}
            className="go-to-lullaby-btn"
          >
            Try It Now →
          </button>
        </div>
      </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeForm}>×</button>
            <BabyForm
              initialData={editingBaby}
              onSubmit={(baby) => {
                handleAddBaby(baby);
                closeForm();
              }}
              onClose={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BabyDashboard;
