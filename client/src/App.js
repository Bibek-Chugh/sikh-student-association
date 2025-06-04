// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import Filters from './Components/Filters';
import MentorGrid from './Components/MentorGrid';
import LoginPage from './Components/LoginPage';
import AddEditMentorModal from './Components/AddEditMentorModal';

const API_BASE_URL = 'http://localhost:5001/api';

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
          path="/admin"
          element={
            <>
              <Hero />
              <Filters setFilters={setFilters} />
              {isAdmin && (
                <div style={{ textAlign: 'right', padding: '20px' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditingMentor({})}
                  >
                    Add New Mentor
                  </button>
                </div>
              )}
              <MentorGrid
                mentors={mentors}
                loading={loading}
                isAdmin={isAdmin}
                onEdit={setEditingMentor}
                onDelete={handleDeleteMentor}
              />
              {editingMentor && (
                <AddEditMentorModal
                  mentor={editingMentor}
                  onClose={() => setEditingMentor(null)}
                  onSave={handleSaveMentor}
                />
              )}
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
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
