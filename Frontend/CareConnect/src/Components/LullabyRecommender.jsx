import React, { useState } from 'react';
import axios from 'axios';
import './LullabyRecommender.css';

const API_BASE = 'https://careconnectapp-9udy.onrender.com';

const LullabyRecommender = () => {
  const [mood, setMood] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [btnHover, setBtnHover] = useState(false);
  const [saveHover, setSaveHover] = useState(false);

  const moods = ['calm', 'sleepy', 'playful', 'joyful', 'soothing'];

  const getLullaby = async () => {
    if (!mood) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/lullabies`, { mood });
      setReply(res.data.reply);
    } catch (error) {
      console.error('Error fetching lullaby:', error);
      setReply('Failed to fetch lullaby.');
    } finally {
      setLoading(false);
    }
  };

  const saveToFavorites = () => {
    if (reply && !favorites.includes(reply)) {
      setFavorites([...favorites, reply]);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2 className="header">🎵 Lullaby Recommender</h2>

        <select
          className="select"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="">-- Select Mood --</option>
          {moods.map((m) => (
            <option key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select>

        <button
          className="button"
          onClick={getLullaby}
          disabled={!mood || loading}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={
            !mood || loading
              ? { cursor: 'not-allowed', backgroundColor: '#aac8ff', boxShadow: 'none', transform: 'none' }
              : btnHover
              ? { backgroundColor: '#2e4476', boxShadow: '0 8px 20px rgba(46, 68, 118, 0.8)', transform: 'scale(1.05)' }
              : {}
          }
        >
          {loading ? 'Loading...' : 'Get Lullaby'}
        </button>

        {reply && (
          <div className="reply-container">
            <div dangerouslySetInnerHTML={{ __html: reply }} />
            <button
              className="save-button"
              onClick={saveToFavorites}
              onMouseEnter={() => setSaveHover(true)}
              onMouseLeave={() => setSaveHover(false)}
              style={
                saveHover
                  ? { backgroundColor: '#e34a6a', boxShadow: '0 7px 20px rgba(227, 74, 106, 0.9)', transform: 'scale(1.05)' }
                  : {}
              }
            >
              ❤️ Save to Favorites
            </button>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="favorites-container">
            <h3 className="favorite-title">⭐ Favorite Lullabies</h3>
            <ul className="favorite-list">
              {favorites.map((fav, idx) => (
                <li
                  key={idx}
                  className="favorite-item"
                  dangerouslySetInnerHTML={{ __html: fav }}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LullabyRecommender;
