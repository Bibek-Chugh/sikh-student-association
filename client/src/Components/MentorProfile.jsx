import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

  if (loading) return <div style={{textAlign: 'center', marginTop: 40}}>Loading...</div>;
  if (error || !mentor) return <div style={{textAlign: 'center', marginTop: 40}}>{error || 'Mentor not found'}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 0', minHeight: '80vh' }}>
        <div style={{ flex: 1, maxWidth: 700, paddingRight: 40 }}>
          <div style={{ color: '#555', fontSize: 22, marginBottom: 8 }}>Meet</div>
          <div style={{ fontSize: 44, fontWeight: 700, color: '#1a2341', marginBottom: 8 }}>{mentor.name?.toUpperCase()}</div>
          <div style={{ fontSize: 24, color: '#444', marginBottom: 24 }}>{mentor.location}</div>
          <div style={{ fontSize: 18, color: '#444', marginBottom: 32, lineHeight: 1.6, maxWidth: '60ch', wordBreak: 'break-word' }}>{mentor.bio}</div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: 700, color: '#1a2341', letterSpacing: 1 }}>JOB TITLE</span>
            <span style={{ marginLeft: 24 }}>{mentor.job_title || '-'}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: 700, color: '#1a2341', letterSpacing: 1 }}>EMPLOYER</span>
            <span style={{ marginLeft: 24 }}>{mentor.employer || '-'}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: 700, color: '#1a2341', letterSpacing: 1 }}>UNDERGRADUATE</span>
            <span style={{ marginLeft: 24 }}>{mentor.undergraduate || '-'}</span>
          </div>
          {mentor.post_graduate && (
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontWeight: 700, color: '#1a2341', letterSpacing: 1 }}>GRADUATE</span>
              <span style={{ marginLeft: 24 }}>{mentor.post_graduate}</span>
            </div>
          )}
          {/* Email removed for privacy */}

          {/* FAVOURITES SECTION */}
          <div style={{ marginTop: 40, marginBottom: 40, width: '100%' }}>
            <div style={{ maxWidth: 1200, margin: '0 0 0 60px', padding: '40px 0', textAlign: 'center' }}>
              <h2 style={{ color: '#1a2341', marginBottom: 40, letterSpacing: 2, textAlign: 'left', marginLeft: 400 }}>FAVOURITES</h2>
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 40 }}>
                <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(26,35,65,0.08)', padding: 32, minWidth: 220, borderTop: '4px solid #ffe066', textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
                  <div style={{ fontWeight: 700, color: '#1a2341', marginBottom: 8 }}>FAVOURITE BOOK</div>
                  <div>{mentor.favourite_book || '-'}</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(26,35,65,0.08)', padding: 32, minWidth: 220, borderTop: '4px solid #ffe066', textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎧</div>
                  <div style={{ fontWeight: 700, color: '#1a2341', marginBottom: 8 }}>FAVOURITE KIRTANI</div>
                  <div>{mentor.favourite_kirtani || '-'}</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(26,35,65,0.08)', padding: 32, minWidth: 220, borderTop: '4px solid #ffe066', textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
                  <div style={{ fontWeight: 700, color: '#1a2341', marginBottom: 8 }}>FAVOURITE MOVIE</div>
                  <div>{mentor.favourite_movie || '-'}</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(26,35,65,0.08)', padding: 32, minWidth: 220, borderTop: '4px solid #ffe066', textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
                  <div style={{ fontWeight: 700, color: '#1a2341', marginBottom: 8 }}>FAVOURITE FOOD</div>
                  <div>{mentor.favourite_food || '-'}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40 }}>
            <Link to={backLink} style={{ color: '#1a2341', textDecoration: 'underline', fontWeight: 500 }}>&larr; Back to all mentors</Link>
          </div>
        </div>
        <div style={{ flex: '0 0 350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {mentor.photo_url ? (
            <img src={mentor.photo_url} alt={mentor.name} style={{ width: 320, height: 320, objectFit: 'cover', borderRadius: 8, border: '6px solid #f5f5f5', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
          ) : (
            <div style={{ width: 320, height: 320, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, color: '#aaa' }}>{mentor.name?.charAt(0)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MentorProfile;
