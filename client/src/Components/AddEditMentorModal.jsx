import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddEditMentorModal({ onClose, onSave, mentor }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        university: '',
        program: '',
        graduation_year: '',
        location: '',
        photo_url: '',
        bio: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mentor) {
            setFormData(mentor);
        }
    }, [mentor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let photo_url = formData.photo_url;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('image', imageFile);
                const token = sessionStorage.getItem('adminToken');
                const res = await axios.post('http://localhost:5001/api/upload', uploadData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }); 
                photo_url = res.data.imageUrl;
            }

            await onSave({ ...formData, photo_url });
            onClose();
        } catch (error) {
            console.error('Operation failed:', error);
            alert('Operation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={{ background: 'none', position: 'static', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', zIndex: 1 }}>
            <div className="modal-content" style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 24px rgba(26,35,65,0.10)', width: '100%', maxWidth: 420, marginTop: 32 }}>
                <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{mentor ? 'Edit Mentor' : 'Add New Mentor'}</h2>
                    <button className="close-button" style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#888', marginLeft: 12 }} onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16, marginBottom: 8 }}
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16, marginBottom: 8 }}
                    />
                    <input
                        name="university"
                        placeholder="University"
                        value={formData.university}
                        onChange={handleChange}
                        style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16, marginBottom: 8 }}
                    />
                    <input
                        name="program"
                        placeholder="Program"
                        value={formData.program}
                        onChange={handleChange}
                        style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16, marginBottom: 8 }}
                    />
                    <input
                        name="graduation_year"
                        type="number"
                        placeholder="Graduation Year"
                        value={formData.graduation_year}
                        onChange={handleChange}
                        style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16, marginBottom: 8 }}
                    />
                    <input
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16, marginBottom: 8 }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ marginBottom: 8 }}
                    />
                    <textarea
                        name="bio"
                        placeholder="Bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16, marginBottom: 8, resize: 'vertical' }}
                    />
                    <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                            style={{ background: '#6c757d', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontSize: 16, cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ background: '#1a2341', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEditMentorModal;