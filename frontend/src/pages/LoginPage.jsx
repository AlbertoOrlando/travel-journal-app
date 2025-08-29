import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Validazione dinamica password e pulizia errori
        setErrors((prev) => {
            const next = { ...prev };
            if (name === 'password') {
                if (!value) next.password = 'Password richiesta';
                else if (value.length < 6) next.password = 'La password deve avere almeno 6 caratteri';
                else next.password = '';
            } else {
                next[name] = '';
            }
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Validazione sincrona minima prima dell'invio
        const localErrors = {};
        if (!formData.identifier.trim()) localErrors.identifier = 'Email o username richiesti';
        if (!formData.password) localErrors.password = 'Password richiesta';
        else if (formData.password.length < 6) localErrors.password = 'La password deve avere almeno 6 caratteri';

        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors);
            return;
        }
        setLoading(true);

        try {
            const result = await login(formData);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.msg || 'Email o password non validi.');
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
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Accedi</h2>
                <form onSubmit={handleSubmit} autoComplete="on">
                    <div className="mb-4">
                        <label htmlFor="identifier" className="block text-gray-700 text-sm font-bold mb-2">
                            Email o Username
                        </label>
                        <input
                            id="identifier"
                            type="text"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            placeholder="Email o Username"
                            autoComplete="username"
                            required
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.identifier ? 'border-red-500' : ''}`}
                        />
                        {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>}
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
                            autoComplete="current-password"
                            required
                            minLength={6}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                }`}
                        >
                            {loading ? 'Accesso in corso...' : 'Accedi'}
                        </button>
                        <Link
                            to="/register"
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        >
                            Non hai un account? Registrati
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
