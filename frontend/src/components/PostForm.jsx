import React, { useState, useEffect } from 'react';

const PostForm = ({ initialData = {}, onSubmit, loading, error }) => {
    // Stato iniziale stabile: evita reset involontari durante la digitazione
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        content: initialData.content || '',
    });

    // Aggiorna lo stato solo se initialData cambia realmente
    useEffect(() => {
        if (initialData && (initialData.title || initialData.content)) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Titolo */}
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                    Titolo
                </label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Inserisci il titolo del post"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {/* Contenuto */}
            <div className="mb-6">
                <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                    Contenuto
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Scrivi il tuo post qui..."
                    rows="10"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                />
            </div>

            {/* Messaggio di errore */}
            {error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {/* Bottone di submit */}
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                    {loading ? 'Operazione in corso...' : 'Salva Post'}
                </button>
            </div>
        </form>
    );
};

export default PostForm;
