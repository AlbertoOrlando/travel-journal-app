import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import api from '../api/api';

// Fix icone Leaflet con bundler (Vite)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Bounds approssimativi dell'Italia (SW, NE)
const ITALY_BOUNDS = [
  [36.619987, 6.749955], // Sud-Ovest
  [47.115393, 18.480247], // Nord-Est
];

const FitItalyOnMount = () => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(ITALY_BOUNDS, { padding: [20, 20] });
  }, [map]);
  return null;
};

const normalizeNumber = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const n = parseFloat(String(val).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

const MapView = ({ posts: postsProp }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (postsProp) {
      setPosts(postsProp);
      setLoading(false);
      setError('');
      return;
    }
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const result = await api.getPosts(token);
        const list = Array.isArray(result) ? result : [];
        setPosts(list);
      } catch (err) {
        setError(err.message || 'Errore nel caricamento dei post per la mappa.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [postsProp]);

  const markers = useMemo(() => {
    return posts
      .map((p) => {
        const lat = normalizeNumber(p.latitude);
        const lon = normalizeNumber(p.longitude);
        if (lat === null || lon === null) return null;
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
        return {
          id: p.id,
          title: p.title || 'Senza titolo',
          location: p.location || '',
          lat,
          lon,
          mood: p.mood || '',
          cost: p.actual_cost,
        };
      })
      .filter(Boolean);
  }, [posts]);

  return (
    <div className="w-full mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">I miei viaggi sulla mappa</h2>
      <div className="w-full" style={{ height: '60vh' }}>
        <MapContainer
          className="w-full h-full rounded overflow-hidden"
          center={[41.8719, 12.5674]} // centro approssimativo Italia
          zoom={5}
          scrollWheelZoom
        >
          <FitItalyOnMount />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lon]} eventHandlers={{ click: () => navigate(`/post/${m.id}`) }}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold text-gray-800">{m.title}</div>
                  {m.location && <div className="text-gray-600">{m.location}</div>}
                  <div className="text-gray-600">
                    {m.mood && <span>Umore: {m.mood}</span>}
                    {m.cost !== undefined && m.cost !== null && m.cost !== '' && (
                      <span className="ml-2">Costo: €{String(m.cost)}</span>
                    )}
                  </div>
                  <button
                    className="mt-2 px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                    onClick={() => navigate(`/post/${m.id}`)}
                  >
                    Apri dettagli
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {loading && (
        <div className="text-sm text-gray-600 mt-2">Caricamento mappa…</div>
      )}
      {error && (
        <div className="text-sm text-red-600 mt-2">{error}</div>
      )}
      {!loading && !error && markers.length === 0 && (
        <div className="text-sm text-gray-600 mt-2">
          Nessun post con coordinate. Aggiungi un viaggio con posizione per vederlo sulla mappa.
        </div>
      )}
    </div>
  );
};

export default MapView;
