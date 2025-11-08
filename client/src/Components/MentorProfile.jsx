import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://sikh-student-association-production.up.railway.app/api';

function MentorProfile() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  useEffect(() => {
    async function fetchMentor() {
      try {
        const res = await fetch(`${API_BASE_URL}/mentors`);
        if (!res.ok) throw new Error('Failed to fetch mentor');
        const data = await res.json();
        const found = data.find(m => String(m.id) === String(id));
        setMentor(found);
      } catch (err) {
        setError('Mentor not found');
      } finally {
        setLoading(false);
      }
    }
    fetchMentor();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/mentors/${id}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setFormStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setFormStatus({ submitting: false, success: false, error: err.message });
    }
  };

  // Determine back link based on admin status
  const isAdmin = Boolean(sessionStorage.getItem('adminToken'));
  const backLink = isAdmin ? '/admin' : '/';

  if (loading) return <div className="mentor-profile-loading">Loading...</div>;
  if (error || !mentor) return <div className="mentor-profile-error">{error || 'Mentor not found'}</div>;

  return (
    <div className="mentor-profile-container">
      <div className="mentor-profile-main">
        <div className="mentor-profile-content">
          <div className="mentor-profile-meet">Meet</div>
          <div className="mentor-profile-name">{mentor.name?.toUpperCase()}</div>
          <div className="mentor-profile-location">{mentor.location}</div>
          {/* Mobile image - appears after name on mobile */}
          <div className="mentor-profile-image-wrapper-mobile">
            {mentor.photo_url ? (
              <img src={mentor.photo_url} alt={mentor.name} className="mentor-profile-image" />
            ) : (
              <div className="mentor-profile-avatar">{mentor.name?.charAt(0)}</div>
            )}
          </div>
          <div className="mentor-profile-bio">{mentor.bio}</div>
          
          <div className="mentor-profile-info-row">
            <span className="mentor-profile-label">JOB TITLE</span>
            <span className="mentor-profile-value">{mentor.job_title || '-'}</span>
          </div>
          <div className="mentor-profile-info-row">
            <span className="mentor-profile-label">EMPLOYER</span>
            <span className="mentor-profile-value">{mentor.employer || '-'}</span>
          </div>
          <div className="mentor-profile-info-row">
            <span className="mentor-profile-label">UNDERGRADUATE</span>
            <span className="mentor-profile-value">{mentor.undergraduate || '-'}</span>
          </div>
          {mentor.post_graduate && (
            <div className="mentor-profile-info-row">
              <span className="mentor-profile-label">GRADUATE</span>
              <span className="mentor-profile-value">{mentor.post_graduate}</span>
            </div>
          )}
          <div className="mentor-profile-info-row">
            <span className="mentor-profile-label">AREA OF PROFESSIONAL FOCUS</span>
            <span className="mentor-profile-value">{mentor.area_professional_focus || '-'}</span>
          </div>
          <div className="mentor-profile-info-row">
            <span className="mentor-profile-label">AREA OF SIKHI FOCUS</span>
            <span className="mentor-profile-value">{mentor.area_sikhi_focus || '-'}</span>
          </div>
        </div>
        {/* Desktop image - appears on the right side on desktop */}
        <div className="mentor-profile-image-wrapper-desktop">
          {mentor.photo_url ? (
            <img src={mentor.photo_url} alt={mentor.name} className="mentor-profile-image" />
          ) : (
            <div className="mentor-profile-avatar">{mentor.name?.charAt(0)}</div>
          )}
        </div>
      </div>
      {/* FAVOURITES SECTION - outside content for proper centering */}
      <div className="mentor-profile-favourites-section">
        <div className="mentor-profile-favourites-wrapper">
          <h2 className="mentor-profile-favourites-title">FAVOURITES</h2>
          <div className="mentor-profile-favourites-grid">
            <div className="mentor-profile-favourite-card">
              <div className="mentor-profile-favourite-icon">🎯</div>
              <div className="mentor-profile-favourite-label">FAVOURITE HOBBY</div>
              <div className="mentor-profile-favourite-value">{mentor.favourite_hobby || '-'}</div>
            </div>
            <div className="mentor-profile-favourite-card">
              <div className="mentor-profile-favourite-icon">🎧</div>
              <div className="mentor-profile-favourite-label">FAVOURITE KIRTANI</div>
              <div className="mentor-profile-favourite-value">{mentor.favourite_kirtani || '-'}</div>
            </div>
            <div className="mentor-profile-favourite-card">
              <div className="mentor-profile-favourite-icon">🎬</div>
              <div className="mentor-profile-favourite-label">FAVOURITE MOVIE/SHOW</div>
              <div className="mentor-profile-favourite-value">{mentor.favourite_movie || mentor.favourite_show || '-'}</div>
            </div>
            <div className="mentor-profile-favourite-card">
              <div className="mentor-profile-favourite-icon">🍽️</div>
              <div className="mentor-profile-favourite-label">FAVOURITE FOOD</div>
              <div className="mentor-profile-favourite-value">{mentor.favourite_food || '-'}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Back link - below favourites */}
      <div className="mentor-profile-back-link">
        <Link to={backLink} className="mentor-profile-back">&larr; Back to all mentors</Link>
      </div>
    </div>
  );
}

export default MentorProfile;
