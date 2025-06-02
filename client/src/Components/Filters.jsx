import React, { useState } from 'react';

function Filters({ setFilters }) {
    const [showFilters, setShowFilters] = useState(false);
    const [inputs, setInputs] = useState({
        university: '', program: '', location: '', gender: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const applyFilters = () => setFilters(inputs);
    const clearFilters = () => {
        setInputs({ university: '', program: '', location: '', gender: '' });
        setFilters({});
    };

    return (
        <div className="filters-section">
            <div className="filters-toggle" onClick={() => setShowFilters(!showFilters)}>
                <i className="fas fa-filter"></i>
                <span>Advanced Filters</span>
                <i className="fas fa-chevron-down"></i>
            </div>
            {showFilters && (
                <div className="filters-grid show">
                    <div className="filter-group">
                        <label>University</label>
                        <input name="university" value={inputs.university} onChange={handleChange} placeholder="Enter university" />
                    </div>
                    <div className="filter-group">
                        <label>Program</label>
                        <input name="program" value={inputs.program} onChange={handleChange} placeholder="Enter program" />
                    </div>
                    <div className="filter-group">
                        <label>Location</label>
                        <input name="location" value={inputs.location} onChange={handleChange} placeholder="Enter location" />
                    </div>
                    <div className="filter-group">
                        <label>Gender</label>
                        <select name="gender" value={inputs.gender} onChange={handleChange}>
                            <option value="">Any</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <button className="btn" onClick={applyFilters}>Apply Filters</button>
                <button className="btn btn-secondary" onClick={clearFilters}>Clear All</button>
            </div>
        </div>
    );
}

export default Filters;