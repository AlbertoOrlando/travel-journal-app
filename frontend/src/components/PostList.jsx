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
            <Filters onFilter={handleFilter} />
            {filteredPosts.length === 0 ? (
                <div className="text-center py-10 text-gray-600">
                    Nessun post trovato con i criteri di ricerca.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;
