import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontWeight: 700, color: '#1a2341', letterSpacing: 1 }}>EMAIL</span>
          <span style={{ marginLeft: 24 }}>{mentor.email || '-'}</span>
        </div>

        {mentor.email && (
          <div style={{ marginTop: 40, padding: 24, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
            <h3 style={{ marginBottom: 16, color: '#1a2341' }}>Contact Mentor</h3>
            {formStatus.success ? (
              <div style={{ color: 'green', marginBottom: 16 }}>
                Message sent successfully! The mentor will get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: '#444' }}>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 4,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: '#444' }}>Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 4,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: '#444' }}>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 4,
                      border: '1px solid #ddd',
                      fontSize: 16,
                      resize: 'vertical'
                    }}
                  />
                </div>
                {formStatus.error && (
                  <div style={{ color: 'red', marginBottom: 16 }}>
                    {formStatus.error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#1a2341',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 16,
                    fontWeight: 500,
                    cursor: formStatus.submitting ? 'not-allowed' : 'pointer',
                    opacity: formStatus.submitting ? 0.7 : 1
                  }}
                >
                  {formStatus.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        )}

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
  );
}

export default MentorProfile;
