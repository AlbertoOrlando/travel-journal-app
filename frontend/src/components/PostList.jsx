import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import Filters from './Filters'; // <-- aggiorna qui
import api from '../api/api';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const result = await api.getPosts(token);

                if (result.success) {
                    setPosts(result.data);
                    setFilteredPosts(result.data);
                } else {
                    setError(result.msg || 'Errore nel caricamento dei post.');
                }
            } catch (err) {
                setError('Errore di rete. Impossibile caricare i post.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
    }, [searchTerm, posts]);

    const handleFilter = (term) => setSearchTerm(term);

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
            <Filters onFilter={handleFilter} /> {/* <-- aggiorna anche qui */}
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
