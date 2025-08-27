import { useState } from 'react';

const Filter = ({ onFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onFilter(value);
    };

    return (
        <div className="mb-6">
            <input
                type="text"
                placeholder="Cerca un post per titolo o contenuto..."
                aria-label="Cerca post"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default Filter;