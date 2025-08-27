import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const PostDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const result = await api.getPostById(id, token);

                if (result.success) {
                    setPost(result.data);
                } else {
                    setError(result.msg || 'Errore nel caricamento del post.');
                }
            } catch (err) {
                setError('Errore di rete. Impossibile caricare il post.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-gray-200"></div>
                <span className="ml-4 text-gray-600">Caricamento post...</span>
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

    if (!post) {
        return (
            <div className="text-center py-20 text-gray-600">
                Post non trovato.
            </div>
        );
    }

    const isAuthor = user && post.authorId === user.id;

    return (
        <main role="main" className="container mx-auto p-4 sm:p-6 md:p-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Scritto da <span className="font-semibold text-gray-700">{post.author}</span> il {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <div className="prose lg:prose-xl max-w-none text-gray-800">
                    <p>{post.content}</p>
                </div>

                {isAuthor && (
                    <div className="mt-8 flex justify-end">
                        <Link
                            to={`/edit-post/${post.id}`}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                        >
                            Modifica Post
                        </Link>
                    </div>
                )}

                <div className="mt-8">
                    <Link to="/dashboard" className="text-blue-500 hover:text-blue-700 font-medium">
                        ← Torna alla Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default PostDetailPage;
