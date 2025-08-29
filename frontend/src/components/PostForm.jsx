import React, { useState, useEffect } from 'react';

const PostForm = ({ initialData = {}, onSubmit, loading, error }) => {
    // Stato iniziale stabile: evita reset involontari durante la digitazione
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || initialData.content || '',
        location: initialData.location || '',
        latitude: initialData.latitude ?? '',
        longitude: initialData.longitude ?? '',
        mood: initialData.mood || 'normale',
        positive_note: initialData.positive_note || '',
        negative_note: initialData.negative_note || '',
        physical_effort: initialData.physical_effort ?? '',
        economic_effort: initialData.economic_effort ?? '',
        actual_cost: initialData.actual_cost ?? '',
        media_url: initialData.media_url || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
    });
    const [mediaMethod, setMediaMethod] = useState(initialData.media_url ? 'url' : 'upload');
    const [mediaFile, setMediaFile] = useState(null);

    // Aggiorna lo stato solo se initialData cambia realmente
    useEffect(() => {
        if (initialData && (initialData.title || initialData.description || initialData.content)) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || initialData.content || '',
                location: initialData.location || '',
                latitude: initialData.latitude ?? '',
                longitude: initialData.longitude ?? '',
                mood: initialData.mood || 'normale',
                positive_note: initialData.positive_note || '',
                negative_note: initialData.negative_note || '',
                physical_effort: initialData.physical_effort ?? '',
                economic_effort: initialData.economic_effort ?? '',
                actual_cost: initialData.actual_cost ?? '',
                media_url: initialData.media_url || '',
                tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
            });
            setMediaMethod(initialData.media_url ? 'url' : 'upload');
            setMediaFile(null);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (mediaMethod === 'upload') {
            // Invia il file al parent per creare un FormData
            payload.media_file = mediaFile || null;
            // Se si sceglie upload, ignora media_url testuale
            delete payload.media_url;
        } else {
            // URL: ignora media_file
            payload.media_file = null;
        }
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Titolo */}
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                    Titolo(obbligatorio)
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

            {/* Descrizione */}
            <div className="mb-6">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                    Descrizione(obbligatorio)
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Scrivi il tuo post qui..."
                    rows="10"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                />
            </div>

            {/* Location */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                        Località
                    </label>
                    <input
                        id="location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Es. Roma, IT"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="latitude" className="block text-gray-700 text-sm font-bold mb-2">
                        Latitudine
                    </label>
                    <input
                        id="latitude"
                        type="number"
                        step="0.00000001"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="Es. 41.9028"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="longitude" className="block text-gray-700 text-sm font-bold mb-2">
                        Longitudine
                    </label>
                    <input
                        id="longitude"
                        type="number"
                        step="0.00000001"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="Es. 12.4964"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>

            {/* Mood - menu a tendina */}
            <div className="mb-4">
                <label htmlFor="mood" className="block text-gray-700 text-sm font-bold mb-2">
                    Umore
                </label>
                <select
                    id="mood"
                    name="mood"
                    value={formData.mood}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="entusiasta">Entusiasta</option>
                    <option value="bella esperienza">Bella esperienza</option>
                    <option value="normale">Normale</option>
                    <option value="così così">Così così</option>
                    <option value="delusione totale">Delusione totale</option>
                </select>
            </div>

            {/* Note positive/negative */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="positive_note" className="block text-gray-700 text-sm font-bold mb-2">
                        Nota positiva
                    </label>
                    <textarea
                        id="positive_note"
                        name="positive_note"
                        value={formData.positive_note}
                        onChange={handleChange}
                        placeholder="Cosa è andato bene?"
                        rows="4"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                    />
                </div>
                <div>
                    <label htmlFor="negative_note" className="block text-gray-700 text-sm font-bold mb-2">
                        Nota negativa
                    </label>
                    <textarea
                        id="negative_note"
                        name="negative_note"
                        value={formData.negative_note}
                        onChange={handleChange}
                        placeholder="Cosa poteva andare meglio?"
                        rows="4"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                    />
                </div>
            </div>

            {/* Sforzi e costo */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="physical_effort" className="block text-gray-700 text-sm font-bold mb-2">
                        Sforzo fisico (1-5)
                    </label>
                    <select
                        id="physical_effort"
                        name="physical_effort"
                        value={formData.physical_effort}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">N/D</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="economic_effort" className="block text-gray-700 text-sm font-bold mb-2">
                        Sforzo economico (1-5)
                    </label>
                    <select
                        id="economic_effort"
                        name="economic_effort"
                        value={formData.economic_effort}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">N/D</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="actual_cost" className="block text-gray-700 text-sm font-bold mb-2">
                        Costo effettivo (€)
                    </label>
                    <input
                        id="actual_cost"
                        type="number"
                        step="0.01"
                        name="actual_cost"
                        value={formData.actual_cost}
                        onChange={handleChange}
                        placeholder="Es. 123.45"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>

            {/* Media URL */}
            <div className="mb-6">
                <span className="block text-gray-700 text-sm font-bold mb-2">Media</span>
                <div className="flex items-center gap-4 mb-3">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="media_method"
                            checked={mediaMethod === 'url'}
                            onChange={() => setMediaMethod('url')}
                        />
                        <span>URL</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="media_method"
                            checked={mediaMethod === 'upload'}
                            onChange={() => setMediaMethod('upload')}
                        />
                        <span>Upload</span>
                    </label>
                </div>
                {mediaMethod === 'url' ? (
                    <input
                        id="media_url"
                        type="text"
                        name="media_url"
                        value={formData.media_url}
                        onChange={handleChange}
                        placeholder="Link a foto/video"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                ) : (
                    <input
                        id="media_file"
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                )}
            </div>

            {/* Tags */}
            <div className="mb-6">
                <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">
                    Tags (separati da virgola)
                </label>
                <input
                    id="tags"
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="es. mare, estate, relax"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
