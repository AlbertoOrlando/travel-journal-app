import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import PostForm from '../components/PostForm';

const CreatePostPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreatePost = async (formData) => {
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const tags = (formData.tags || '')
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

            let result;
            if (formData.media_file) {
                const fd = new FormData();
                fd.append('title', formData.title);
                fd.append('description', formData.description);
                if (formData.location) fd.append('location', formData.location);
                if (formData.latitude !== '' && formData.latitude !== null && formData.latitude !== undefined) fd.append('latitude', String(formData.latitude));
                if (formData.longitude !== '' && formData.longitude !== null && formData.longitude !== undefined) fd.append('longitude', String(formData.longitude));
                if (formData.mood) fd.append('mood', formData.mood);
                if (formData.positive_note) fd.append('positive_note', formData.positive_note);
                if (formData.negative_note) fd.append('negative_note', formData.negative_note);
                if (formData.physical_effort !== '' && formData.physical_effort !== null && formData.physical_effort !== undefined) fd.append('physical_effort', String(formData.physical_effort));
                if (formData.economic_effort !== '' && formData.economic_effort !== null && formData.economic_effort !== undefined) fd.append('economic_effort', String(formData.economic_effort));
                if (formData.actual_cost !== '' && formData.actual_cost !== null && formData.actual_cost !== undefined) fd.append('actual_cost', String(formData.actual_cost));
                if (tags.length) fd.append('tags', JSON.stringify(tags));
                fd.append('media_file', formData.media_file);
                result = await api.createPost(fd, token);
            } else {
                const payload = { ...formData, tags };
                result = await api.createPost(payload, token);
            }

            if (result && (result.id || result.msg)) {
                // Se l'API risponde 201 con l'id del post, lo consideriamo un successo
                navigate('/dashboard');
                return;
            }
        } catch (err) {
            setError(err.message || 'Errore inaspettato. Riprova.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Crea un nuovo Post</h1>
            <PostForm
                onSubmit={handleCreatePost}
                loading={loading}
                error={error}
            />
        </div>
    );
};

export default CreatePostPage;
