const API_URL = 'http://localhost:5001/api';

const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch {
        data = { msg: response.statusText };
    }

    if (!response.ok) {
        throw new Error(data.msg || 'Qualcosa è andato storto.');
    }
    return data;
};

const getHeaders = (token, hasBody = false) => {
    const headers = {};
    if (hasBody) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

const request = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        return await handleResponse(response);
    } catch (error) {
        throw new Error(error.message || 'Errore di rete');
    }
};

const api = {
    register: (userData) =>
        request(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(null, true),
            body: JSON.stringify(userData),
        }),

    login: (credentials) =>
        request(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(null, true),
            body: JSON.stringify(credentials),
        }),

    createPost: (postData, token) =>
        request(`${API_URL}/posts`, {
            method: 'POST',
            headers: getHeaders(token, true),
            body: JSON.stringify(postData),
        }),

    getPosts: (token) =>
        request(`${API_URL}/posts`, {
            method: 'GET',
            headers: getHeaders(token),
        }),

    getPostById: (postId, token) =>
        request(`${API_URL}/posts/${postId}`, {
            method: 'GET',
            headers: getHeaders(token),
        }),

    updatePost: (postId, postData, token) =>
        request(`${API_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: getHeaders(token, true),
            body: JSON.stringify(postData),
        }),

    deletePost: (postId, token) =>
        request(`${API_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: getHeaders(token),
        }),
};

export default api;
