import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardUser from './pages/DashboardUser';
import DashboardAdmin from './pages/DashboardAdmin';
import Exercises from './pages/Exercises';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <div className="spinner" style={{ width: '50px', height: '50px' }}></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Client Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardUser />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/exercises"
                element={
                    <ProtectedRoute>
                        <Exercises />
                    </ProtectedRoute>
                }
            />

            {/* Protected Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <DashboardAdmin />
                    </ProtectedRoute>
                }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
