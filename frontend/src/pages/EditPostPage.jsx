import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import PostForm from '../components/PostForm';
import { useAuth } from '../context/AuthContext';

const EditPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const result = await api.getPostById(id, token);
                // API ritorna direttamente il post del proprietario (middleware auth già filtra)
                setInitialData(result);
            } catch (err) {
                setError(err.message || 'Errore nel caricamento del post.');
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchPost();
    }, [id, user]);

    const handleUpdatePost = async (formData) => {
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const tags = (formData.tags || '')
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

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
                await api.updatePost(id, fd, token);
            } else {
                const payload = { ...formData, tags };
                await api.updatePost(id, payload, token);
            }
            navigate(`/post/${id}`);
        } catch (err) {
            setError(err.message || 'Errore inaspettato. Riprova.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                <span className="ml-4 text-gray-600">Caricamento post da modificare...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            </div>
        );
    }

    if (!initialData) {
        return <div className="text-center py-20 text-gray-600">Nessun dato disponibile.</div>;
    }

    return (
        <main className="container mx-auto p-4 sm:p-6 md:p-8">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Modifica Post</h1>
                <PostForm
                    initialData={initialData}
                    onSubmit={handleUpdatePost}
                    loading={loading}
                    error={error}
                />
            </div>
        </main>
    );
};

export default EditPostPage;
