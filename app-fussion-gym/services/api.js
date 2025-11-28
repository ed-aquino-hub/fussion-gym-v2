import axios from 'axios';


const API_URL = 'http://192.168.1.45:3307/api'; // Backend on port 3307

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auth
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

// Users
export const getUserProfile = async (token, userId) => {
    const response = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Exercises
export const scanExerciseQR = async (token, qrCode) => {
    const response = await api.post(
        '/exercises/scan',
        { qr_code: qrCode },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// Rewards
export const getRewards = async (token) => {
    const response = await api.get('/rewards', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getRedemptions = async (token) => {
    const response = await api.get('/rewards/redemptions/history', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Assistance (Admin)
export const scanAttendanceQR = async (token, usuarioId) => {
    const response = await api.post(
        '/assistance/scan',
        { usuarioId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export default api;
