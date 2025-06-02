import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import Filters from './Components/Filters';
import MentorGrid from './Components/MentorGrid';
import LoginPage from './Components/LoginPage';
import AddEditMentorModal from './Components/AddEditMentorModal';

function App() {
    const [mentors, setMentors] = useState([]);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [token, setToken] = useState(null);
    const [editingMentor, setEditingMentor] = useState(null);

    const fetchMentors = async () => {
        setLoading(true);
        let query = '';
        if (filters) {
            query = '?' + new URLSearchParams(filters).toString();
        }
        const res = await fetch(`http://localhost:5001/api/mentors${query}`);
        const data = await res.json();
        setMentors(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMentors();
    }, [filters]);

    const handleLogin = (token) => {
        setToken(token);
        setIsAdmin(true);
    };

    const handleLogout = () => {
        setToken(null);
        setIsAdmin(false);
    };

    const handleSaveMentor = async (mentorData) => {
        const method = mentorData.id ? 'PUT' : 'POST';
        const url = mentorData.id 
            ? `http://localhost:5001/api/mentors/${mentorData.id}`
            : `http://localhost:5001/api/mentors`;
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(mentorData)
        });
        if (res.ok) {
            fetchMentors();
        }
        setEditingMentor(null);
    };

    const handleDeleteMentor = async (id) => {
        await fetch(`http://localhost:5001/api/mentors/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchMentors();
    };

    return (
        <Router>
            <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/admin" element={
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
                } />
                <Route path="/" element={
                    <>
                        <Hero />
                        <Filters setFilters={setFilters} />
                        <MentorGrid 
                            mentors={mentors} 
                            loading={loading} 
                            isAdmin={false} 
                        />
                    </>
                } />
            </Routes>
        </Router>
    );
}

export default App;
