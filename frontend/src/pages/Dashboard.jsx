import { useAuth } from '../context/AuthContext';
import PostList from '../components/PostList';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <main role="main" className="container mx-auto p-4 sm:p-6 md:p-8">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
                <p className="text-gray-600 mb-4">
                    Benvenuto, <span className="font-semibold text-blue-600">{user.username}</span>!
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

                {/* Sezione che visualizza l'elenco dei post */}
                <div className="mt-6">
                    <PostList />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;