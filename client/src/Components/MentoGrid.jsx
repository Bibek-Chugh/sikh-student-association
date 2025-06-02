import React from 'react';
import MentorCard from './MentorCard';

function MentorGrid({ mentors, loading, isAdmin, onEdit, onDelete }) {
    if (loading) {
        return <div className="loading"><i className="fas fa-spinner"></i> Loading mentors...</div>;
    }

    if (mentors.length === 0) {
        return <div className="no-results"><i className="fas fa-search"></i><h3>No mentors found.</h3></div>;
    }

    return (
        <div className="mentors-grid">
            {mentors.map(mentor => (
                <MentorCard 
                    key={mentor.id} 
                    mentor={mentor} 
                    isAdmin={isAdmin} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                />
            ))}
        </div>
    );
}

export default MentorGrid;
