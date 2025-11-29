import axios from 'axios';
import { API_URL } from '../config';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized - redirect to login
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }

            // Handle 403 Forbidden
            if (error.response.status === 403) {
                console.error('Acceso denegado');
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// API Service Functions

// Auth
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials)
};

// Users
export const usersAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    getExerciseHistory: (id) => api.get(`/users/${id}/exercises`)
};

// Exercises
export const exercisesAPI = {
    getAll: () => api.get('/exercises'),
    getByQR: (qrCode) => api.get(`/exercises/qr/${qrCode}`),
    scan: (data) => api.post('/exercises/scan', data)
};

// Rewards
export const rewardsAPI = {
    getAll: () => api.get('/rewards'),
    getById: (id) => api.get(`/rewards/${id}`),
    create: (rewardData) => api.post('/rewards', rewardData),
    update: (id, rewardData) => api.put(`/rewards/${id}`, rewardData),
    delete: (id) => api.delete(`/rewards/${id}`),
    redeem: (premioId) => api.post('/rewards/redeem', { premioId }),
    getRedemptionHistory: () => api.get('/rewards/redemptions/history')
};

// Assistance
export const assistanceAPI = {
    scan: (usuarioId) => api.post('/assistance/scan', { usuarioId }),
    getHistory: () => api.get('/assistance/history')
};

// Ranking
export const rankingAPI = {
    get: (limit = 50) => api.get(`/ranking?limit=${limit}`)
};
