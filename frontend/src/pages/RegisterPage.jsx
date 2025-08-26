import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await register(formData);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.msg || 'Errore di registrazione. Riprova.');
            }
        } catch (err) {
            setError(err.message || 'Errore imprevisto. Riprova.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registrati</h2>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            autoComplete="username"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            autoComplete="email"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            autoComplete="new-password"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    {error && (
                        <div
                            role="alert"
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm"
                        >
                            {error}
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                                }`}
                        >
                            {loading ? 'Registrazione in corso...' : 'Registrati'}
                        </button>
                        <Link
                            to="/login"
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        >
                            Hai già un account? Accedi
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;