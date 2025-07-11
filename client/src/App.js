// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import Filters from './Components/Filters';
import MentorGrid from './Components/MentorGrid';
import LoginPage from './Components/LoginPage';
import AddEditMentorModal from './Components/AddEditMentorModal';
import MentorProfile from './Components/MentorProfile';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [mentors, setMentors] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const [editingMentor, setEditingMentor] = useState(null);

  // On mount, restore token + isAdmin from sessionStorage, then fetch mentors
  useEffect(() => {
    const storedToken = sessionStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAdmin(true);
    }
    fetchMentors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Fetch mentors from backend (public endpoint)
  const fetchMentors = async () => {
    setLoading(true);
    try {
      let queryString = '';
      Object.entries(filters).forEach(([key, val]) => {
        if (val) {
          queryString += `${queryString ? '&' : '?'}${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
        }
      });
      const res = await fetch(`${API_BASE_URL}/mentors${queryString}`);
      if (!res.ok) {
        throw new Error(`Failed to load mentors (${res.status})`);
      }
      const data = await res.json();
      setMentors(data);
    } catch (err) {
      console.error('fetchMentors error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Called by LoginPage on successful login
  const handleLogin = (newToken) => {
    sessionStorage.setItem('adminToken', newToken);
    setToken(newToken);
    setIsAdmin(true);
  };

  // Logout clears token & resets isAdmin
  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setToken(null);
    setIsAdmin(false);
  };

  // Save (add or edit) a mentor (admin-only)
  const handleSaveMentor = async (mentorData) => {
    try {
      const method = mentorData.id ? 'PUT' : 'POST';
      const url = mentorData.id
        ? `${API_BASE_URL}/mentors/${mentorData.id}`
        : `${API_BASE_URL}/mentors`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(mentorData)
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Save failed (${res.status})`);
      }
      setEditingMentor(null);
      fetchMentors();
    } catch (err) {
      console.error('handleSaveMentor error:', err);
      throw err;
    }
  };

  // Delete a mentor (admin-only)
  const handleDeleteMentor = async (mentorId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/mentors/${mentorId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Delete failed (${res.status})`);
      }
      fetchMentors();
    } catch (err) {
      console.error('handleDeleteMentor error:', err);
      alert(err.message || 'Failed to delete mentor');
    }
  };

  return (
    <Router>
      <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/mentor/:id"
          element={<MentorProfile />}
        />
        <Route
          path="/admin"
          element={
            <>
              <Hero />
              <Filters setFilters={setFilters} />
              <MentorGrid
                mentors={mentors}
                loading={loading}
                isAdmin={isAdmin}
                onEdit={setEditingMentor}
                onDelete={handleDeleteMentor}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '40px 0 0 0' }}>
                <button
                  className="btn btn-primary add-mentor-btn"
                  style={{
                    background: 'linear-gradient(90deg, #1a2341 0%, #3a4a8c 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    padding: '14px 36px',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(26,35,65,0.08)',
                    marginBottom: '32px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => setEditingMentor({})}
                >
                  Add Mentor
                </button>
                {editingMentor && (
                  <div style={{ width: '100%', maxWidth: 600 }}>
                    <AddEditMentorModal
                      mentor={editingMentor}
                      onClose={() => setEditingMentor(null)}
                      onSave={handleSaveMentor}
                    />
                  </div>
                )}
              </div>
            </>
          }
        />
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Filters setFilters={setFilters} />
              <MentorGrid
                mentors={mentors}
                loading={loading}
                isAdmin={false}
              />
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px', 
                backgroundColor: '#f8f9fa',
                marginTop: '40px'
              }}>
                <div style={{ 
                  maxWidth: '600px', 
                  margin: '0 auto',
                  color: '#1a2341'
                }}>
                  <h2 style={{ 
                    fontSize: '28px', 
                    fontWeight: '600', 
                    marginBottom: '16px',
                    color: '#1a2341'
                  }}>
                    Get in Touch
                  </h2>
                  <p style={{ 
                    fontSize: '18px', 
                    lineHeight: '1.6',
                    color: '#444'
                  }}>
                    Contact us via GMAIL at{' '}
                    <a 
                      href="mailto:uofwssa@gmail.com" 
                      style={{ 
                        color: '#1a2341', 
                        fontWeight: '600',
                        textDecoration: 'underline'
                      }}
                    >
                      uofwssa@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
