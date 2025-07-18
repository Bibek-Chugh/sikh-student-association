import React from 'react';
import { Link } from 'react-router-dom';

function MentorCard({ mentor, isAdmin, onEdit, onDelete }) {
    return (
        <Link to={`/mentor/${mentor.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="mentor-card">
                <div className="mentor-image">
                    {mentor.photo_url ? (
                        <img src={mentor.photo_url} alt={mentor.name} />
                    ) : (
                        <div className="mentor-avatar">{mentor.name?.charAt(0)}</div>
                    )}
                </div>
                <div className="mentor-info">
                    <div className="mentor-name">{mentor.name}</div>
                    <div className="mentor-title">{mentor.program || ''}</div>
                    <div className="mentor-details">
                        <div className="detail-item"><i className="fas fa-university"></i>{mentor.university}</div>
                        <div className="detail-item"><i className="fas fa-map-marker-alt"></i>{mentor.location}</div>
                    </div>
                    {/* <div className="mentor-bio">{mentor.bio}</div> */}
                    {isAdmin && (
                        <div style={{ marginTop: '10px' }}>
                            <button className="btn btn-secondary" onClick={e => { e.preventDefault(); onEdit(mentor); }}>Edit</button>
                            <button className="btn btn-danger" onClick={e => { e.preventDefault(); onDelete(mentor.id); }}>Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default MentorCard;