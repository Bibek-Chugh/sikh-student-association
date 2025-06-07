import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5001/api';

function MentorProfile() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
