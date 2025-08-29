import { useState } from 'react';

// onFilter riceve un oggetto: { text, mood, tag, sort }
const Filters = ({ onFilter }) => {
    const [text, setText] = useState('');
    const [mood, setMood] = useState('');
    const [tag, setTag] = useState('');
    const [sort, setSort] = useState('date_desc');

    const emit = (next) => onFilter({ text, mood, tag, sort, ...next });

    return (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
                type="text"
                placeholder="Cerca per testo..."
                aria-label="Cerca post"
                value={text}
                onChange={(e) => { setText(e.target.value); emit({ text: e.target.value }); }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="text"
                placeholder="Filtro tag (es. mare)"
                aria-label="Filtro tag"
                value={tag}
                onChange={(e) => { setTag(e.target.value); emit({ tag: e.target.value }); }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
                aria-label="Filtro umore"
                value={mood}
                onChange={(e) => { setMood(e.target.value); emit({ mood: e.target.value }); }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Umore</option>
                <option value="entusiasta">Entusiasta</option>
                <option value="bella esperienza">Bella esperienza</option>
                <option value="normale">Normale</option>
                <option value="così così">Così così</option>
                <option value="delusione totale">Delusione totale</option>
            </select>
            <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); emit({ sort: e.target.value }); }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Ordinamento"
            >
                <option value="date_desc">Data decrescente</option>
                <option value="date_asc">Data crescente</option>
                <option value="cost_desc">Costo decrescente</option>
                <option value="cost_asc">Costo crescente</option>
            </select>
        </div>
    );
};

export default Filters;
