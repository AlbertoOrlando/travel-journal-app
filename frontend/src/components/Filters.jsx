import { useState, useEffect } from 'react';

// onFilter riceve un oggetto: { text, mood, tag, sort }
// values (opzionale) permette il controllo da parent: { text, mood, tag, sort }
const Filters = ({ onFilter, values }) => {
    const [text, setText] = useState(values?.text || '');
    const [mood, setMood] = useState(values?.mood || '');
    const [tag, setTag] = useState(values?.tag || '');
    const [sort, setSort] = useState(values?.sort || 'date_desc');

    // Se il parent fornisce values, sincronizza lo stato locale
    useEffect(() => {
        if (values) {
            setText(values.text || '');
            setMood(values.mood || '');
            setTag(values.tag || '');
            setSort(values.sort || 'date_desc');
        }
    }, [values]);

    const emit = (next) => onFilter({
        text: values ? (next.text ?? values.text ?? '') : (next.text ?? text),
        mood: values ? (next.mood ?? values.mood ?? '') : (next.mood ?? mood),
        tag: values ? (next.tag ?? values.tag ?? '') : (next.tag ?? tag),
        sort: values ? (next.sort ?? values.sort ?? 'date_desc') : (next.sort ?? sort),
    });

    return (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
                type="text"
                placeholder="Cerca per testo..."
                aria-label="Cerca post"
                value={values ? (values.text || '') : text}
                onChange={(e) => { setText(e.target.value); emit({ text: e.target.value }); }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="text"
                placeholder="Filtro tag (es. mare)"
                aria-label="Filtro tag"
                value={values ? (values.tag || '') : tag}
                onChange={(e) => { setTag(e.target.value); emit({ tag: e.target.value }); }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
                aria-label="Filtro umore"
                value={values ? (values.mood || '') : mood}
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
                value={values ? (values.sort || 'date_desc') : sort}
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
