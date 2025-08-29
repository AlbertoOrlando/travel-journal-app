import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import Filters from './Filters';
import api from '../api/api';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ text: '', mood: '', tag: '', sort: 'date_desc' });
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const result = await api.getPosts(token);
                // L'API restituisce direttamente un array di post
                const list = Array.isArray(result) ? result : [];
                setPosts(list);
                setFilteredPosts(list);
            } catch (err) {
                setError(err.message || 'Errore nel caricamento dei post.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        let result = posts.filter(post => {
            const title = (post.title || '').toLowerCase();
            const body = (post.description || post.content || '').toLowerCase();
            const term = (filters.text || '').toLowerCase();
            const mood = (post.mood || '').toLowerCase();
            const moodFilter = (filters.mood || '').toLowerCase();
            const hasText = !term || title.includes(term) || body.includes(term);
            const hasMood = !moodFilter || mood.includes(moodFilter);
            const tagFilter = (filters.tag || '').toLowerCase();
            const hasTag = !tagFilter || (Array.isArray(post.tags) && post.tags.some(t => t.toLowerCase().includes(tagFilter)));
            return hasText && hasMood && hasTag;
        });

        // Sorting
        switch (filters.sort) {
            case 'date_asc':
                result = result.sort((a, b) => new Date(a.created_at || a.createdAt || 0) - new Date(b.created_at || b.createdAt || 0));
                break;
            case 'cost_desc':
                result = result.sort((a, b) => (parseFloat(b.actual_cost) || 0) - (parseFloat(a.actual_cost) || 0));
                break;
            case 'cost_asc':
                result = result.sort((a, b) => (parseFloat(a.actual_cost) || 0) - (parseFloat(b.actual_cost) || 0));
                break;
            case 'date_desc':
            default:
                result = result.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
        }

        setFilteredPosts(result);
    }, [filters, posts]);

    const handleFilter = (f) => setFilters(f);

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
            <div className="container mx-auto px-4 sm:px-6 py-20">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-6">
            {/* Barra controlli: filtri + scelta vista */}
            <div className="mb-4">
                <Filters onFilter={handleFilter} />
                <div className="flex items-center justify-end gap-2 mt-2">
                    <span className="text-sm text-gray-600">Vista:</span>
                    <button
                        type="button"
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1 rounded text-sm border ${viewMode === 'grid' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                        aria-pressed={viewMode === 'grid'}
                    >
                        Griglia
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1 rounded text-sm border ${viewMode === 'list' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                        aria-pressed={viewMode === 'list'}
                    >
                        Lista
                    </button>
                </div>
            </div>

            {filteredPosts.length === 0 ? (
                <div className="text-center py-10 text-gray-600">
                    Nessun post trovato con i criteri di ricerca.
                </div>
            ) : (
                viewMode === 'grid' ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 bg-white rounded-md shadow">
                        {filteredPosts.map(post => {
                            const createdAt = post.created_at || post.createdAt;
                            const preview = (post.description || post.content || '').toString();
                            const mediaUrl = post.media_url || '';
                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
                            return (
                                <a key={post.id} href={`#/post/${post.id}`} className="block p-4 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none">
                                    <div className="flex items-start gap-4">
                                        {isImage && (
                                            <div className="w-32 h-24 flex-shrink-0 bg-white overflow-hidden rounded">
                                                <img src={mediaUrl} alt={post.title} className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-800 truncate">{post.title}</h3>
                                            {createdAt && (
                                                <p className="text-xs text-gray-500 mt-1">{new Date(createdAt).toLocaleDateString()}</p>
                                            )}
                                            {!isImage && (
                                                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{preview}</p>
                                            )}
                                            {Array.isArray(post.tags) && post.tags.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {post.tags.map((t) => (
                                                        <span key={t} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">#{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
};

export default PostList;
