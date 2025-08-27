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

                if (result.success) {
                    if (result.data.authorId !== user.id) {
                        setError("Non hai i permessi per modificare questo post.");
                    } else {
                        setInitialData(result.data);
                    }
                } else {
                    setError(result.msg || 'Errore nel caricamento del post.');
                }
            } catch (err) {
                setError('Errore di rete. Impossibile caricare il post.');
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
            const result = await api.updatePost(id, formData, token);

            if (result.success) {
                navigate(`/post/${id}`);
            } else {
                setError(result.msg || "Errore nell'aggiornamento del post.");
            }
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
