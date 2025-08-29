import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const PostDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const result = await api.getPostById(id, token);
                // API ritorna direttamente l'oggetto post
                setPost(result);
            } catch (err) {
                setError(err.message || 'Errore nel caricamento del post.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
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

    const isAuthor = user && user.id && post.user_id === user.id;

    return (
        <main role="main" className="container mx-auto p-4 sm:p-6 md:p-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
                {post.created_at && (
                    <p className="text-gray-500 text-sm mb-6">
                        Creato il {new Date(post.created_at).toLocaleDateString()}
                    </p>
                )}
                <div className="prose lg:prose-xl max-w-none text-gray-800">
                    <p>{post.description || post.content}</p>
                </div>

                {/* Extra details */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    {post.location && (
                        <div>
                            <span className="font-semibold">Località:</span> {post.location}
                        </div>
                    )}
                    {(post.latitude !== null && post.latitude !== undefined) || (post.longitude !== null && post.longitude !== undefined) ? (
                        <div>
                            <span className="font-semibold">Coordinate:</span> {post.latitude ?? '—'}, {post.longitude ?? '—'}
                        </div>
                    ) : null}
                    {post.mood && (
                        <div>
                            <span className="font-semibold">Umore:</span> {post.mood}
                        </div>
                    )}
                    {(post.physical_effort || post.economic_effort) && (
                        <div>
                            <span className="font-semibold">Sforzo fisico/economico:</span> {post.physical_effort ?? '—'}/{post.economic_effort ?? '—'}
                        </div>
                    )}
                    {(post.actual_cost !== null && post.actual_cost !== undefined) && (
                        <div>
                            <span className="font-semibold">Costo effettivo:</span> € {post.actual_cost}
                        </div>
                    )}
                    {post.media_url && (
                        <div className="md:col-span-2">
                            <span className="font-semibold">Media:</span>
                            <div className="mt-2">
                                {/\.(jpg|jpeg|png|gif|webp)$/i.test(post.media_url) ? (
                                    <div className="w-full h-64 md:h-96 overflow-hidden rounded bg-white flex items-center justify-center">
                                        <img src={post.media_url} alt="media" className="max-w-full max-h-full object-contain" />
                                    </div>
                                ) : /\.(mp4|webm|ogg)$/i.test(post.media_url) ? (
                                    <video src={post.media_url} controls className="w-full rounded" />
                                ) : (
                                    <a href={post.media_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Apri</a>
                                )}
                            </div>
                        </div>
                    )}
                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="md:col-span-2">
                            <span className="font-semibold">Tags:</span>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {post.tags.map((t) => (
                                    <span key={t} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">#{t}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {isAuthor && (
                    <div className="mt-8 flex justify-end gap-3">
                        <Link
                            to={`/edit-post/${post.id}`}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                        >
                            Modifica Post
                        </Link>
                        <button
                            type="button"
                            disabled={deleting}
                            onClick={async () => {
                                setError('');
                                if (!window.confirm('Sei sicuro di voler eliminare questo post?')) return;
                                setDeleting(true);
                                try {
                                    const token = localStorage.getItem('token');
                                    await api.deletePost(post.id, token);
                                    navigate('/dashboard');
                                } catch (err) {
                                    setError(err.message || "Errore nell'eliminazione del post.");
                                } finally {
                                    setDeleting(false);
                                }
                            }}
                            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 ${deleting ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {deleting ? 'Eliminazione...' : 'Elimina Post'}
                        </button>
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
