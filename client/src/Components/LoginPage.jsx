import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
            const response = await fetch(`${API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })  // 👈 Updated to use email
            });
            const data = await response.json();
            if (response.ok) {
                onLogin(data.token);
                navigate('/admin');  // Redirect to admin view
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            alert('Login error');
        }
    };

    return (
        <div className="login-page">
            <div className="modal-content">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"  // 👈 Updated to email input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
