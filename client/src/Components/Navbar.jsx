import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isAdmin, onLogout }) {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-brand">SSA Mentor Database</Link>
                <div className="nav-links">
                    {!isAdmin ? (
                        <Link to="/login" className="nav-btn">Login</Link>
                    ) : (
                        <button className="nav-btn" onClick={onLogout}>Logout</button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
