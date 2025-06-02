import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Components/Navbar';
import Hero from './components/Hero';
import Filters from './components/Filters';
import MentorGrid from './components/MentorGrid';
import AdminLoginModal from './components/AdminLoginModal';
import AddEditMentorModal from './components/AddEditMentorModal';

const API_BASE_URL = 'http://localhost:5001/api';

function App() {
    const [mentors, setMentors] = useState([]);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [token, setToken] = useState(sessionStorage.getItem('adminToken'));
    const [showLogin, setShowLogin] = useState(false);
    const [showMentorModal, setShowMentorModal] = useState(false);
    const [editMentor, setEditMentor] = useState(null);

    useEffect(() => {
        if (token) setIsAdmin(true);
        fetchMentors();
    }, [filters, token]);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/mentors`, { params: filters });
            setMentors(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to load mentors.');
            setLoading(false);
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/admin/login`, { username, password });
            sessionStorage.setItem('adminToken', res.data.token);
            setToken(res.data.token);
            setIsAdmin(true);
            setShowLogin(false);
        } catch (err) {
            setError('Login failed.');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminToken');
        setToken(null);
        setIsAdmin(false);
    };

    const handleAddEditMentor = async (mentorData) => {
        try {
            if (editMentor) {
                await axios.put(`${API_BASE_URL}/mentors/${editMentor.id}`, mentorData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE_URL}/mentors`, mentorData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowMentorModal(false);
            setEditMentor(null);
            fetchMentors();
        } catch (err) {
            console.error(err);
            setError('Failed to save mentor.');
        }
    };

    const handleDeleteMentor = async (id) => {
        if (!window.confirm('Are you sure you want to delete this mentor?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/mentors/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMentors();
        } catch (err) {
            console.error(err);
            setError('Failed to delete mentor.');
        }
    };

    return (
        <div>
            <Navbar 
                isAdmin={isAdmin} 
                onLogin={() => setShowLogin(true)} 
                onLogout={handleLogout}
            />
            <Hero />
            <Filters setFilters={setFilters} />
            {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            <MentorGrid 
                mentors={mentors} 
                loading={loading} 
                isAdmin={isAdmin} 
                onEdit={(mentor) => { setEditMentor(mentor); setShowMentorModal(true); }} 
                onDelete={handleDeleteMentor} 
            />
            {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
            {showMentorModal && 
                <AddEditMentorModal 
                    onClose={() => { setShowMentorModal(false); setEditMentor(null); }} 
                    onSave={handleAddEditMentor} 
                    mentor={editMentor} 
                />}
        </div>
    );
}

export default App;
