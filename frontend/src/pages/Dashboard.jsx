import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostList from '../components/PostList';
import MapView from '../components/MapView';
import { Link } from 'react-router-dom';
import api from '../api/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ text: '', mood: '', tag: '', sort: 'date_desc' });

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const result = await api.getPosts(token);
                const list = Array.isArray(result) ? result : [];
                setPosts(list);
            } catch (err) {
                setError(err.message || 'Errore nel caricamento dei post.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filteredPosts = useMemo(() => {
        let result = posts.filter(post => {
            const title = (post.title || '').toLowerCase();
            const body = (post.description || post.content || '').toLowerCase();
            const term = (filters.text || '').toLowerCase();
            const mood = (post.mood || '').toLowerCase();
            const moodFilter = (filters.mood || '').toLowerCase();
            const hasText = !term || title.includes(term) || body.includes(term);
            const hasMood = !moodFilter || mood === moodFilter;
            const tagFilter = (filters.tag || '').toLowerCase();
            const hasTag = !tagFilter || (Array.isArray(post.tags) && post.tags.some(t => t.toLowerCase().includes(tagFilter)));
            return hasText && hasMood && hasTag;
        });

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
        return result;
    }, [posts, filters]);

    return (
        <main role="main" className="container mx-auto p-4 sm:p-6 md:p-8">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
                <p className="text-gray-600 mb-4">
                    Benvenuto, <span className="font-semibold text-blue-600">{user.username || user.email || 'Utente'}</span>!
                    Questa è la tua dashboard.
                </p>

                {/* Pulsante per creare un nuovo post */}
                <div className="flex justify-end mb-6">
                    <Link
                        to="/create-post"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                    >
                        + Crea un nuovo post
                    </Link>
                </div>

                {/* Mappa viaggi (filtrata come la lista) */}
                <div className="mt-4">
                    <MapView posts={filteredPosts} />
                </div>

                {/* Sezione che visualizza l'elenco dei post */}
                <div className="mt-6">
                    <PostList posts={posts} filters={filters} onFilter={setFilters} />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
