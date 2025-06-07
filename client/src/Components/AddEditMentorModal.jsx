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
        gender: '',
        religion: '',
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
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{mentor ? 'Edit Mentor' : 'Add New Mentor'}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="university"
                            placeholder="University"
                            value={formData.university}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="program"
                            placeholder="Program"
                            value={formData.program}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="graduation_year"
                            type="number"
                            placeholder="Graduation Year"
                            value={formData.graduation_year}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input
                            name="religion"
                            placeholder="Religion"
                            value={formData.religion}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="bio"
                            placeholder="Bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
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