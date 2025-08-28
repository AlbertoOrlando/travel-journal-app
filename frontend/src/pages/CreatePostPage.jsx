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
            const payload = { ...formData, tags };
            const result = await api.createPost(payload, token);

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
