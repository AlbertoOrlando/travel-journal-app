import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav
            className="bg-white shadow-md p-4"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    MyBlog
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4 items-center">
                    {user ? (
                        <>
                            <span className="text-gray-700 font-medium">
                                Benvenuto, {user.username}!
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-gray-900 font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                            >
                                Accedi
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Registrati
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-gray-700 focus:outline-none text-2xl"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 space-y-2">
                    {user ? (
                        <>
                            <span className="block text-gray-700 font-medium">
                                Benvenuto, {user.username}!
                            </span>
                            <button
                                onClick={logout}
                                className="block w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="block text-gray-700 hover:text-gray-900 font-medium"
                            >
                                Accedi
                            </Link>
                            <Link
                                to="/register"
                                className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                            >
                                Registrati
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
