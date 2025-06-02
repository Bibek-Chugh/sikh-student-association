import React from 'react';

function Hero() {
    return (
        <div className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title">Find Your Mentor</h1>
                <p className="hero-subtitle">
                    You can search the Sikh Student Association Mentor Database by name, profession, industry, location and more.
                </p>
                <div className="search-container">
                    <input type="text" className="main-search" placeholder="START YOUR SEARCH HERE" disabled />
                    <i className="fas fa-search search-icon"></i>
                </div>
            </div>
        </div>
    );
}

export default Hero;
