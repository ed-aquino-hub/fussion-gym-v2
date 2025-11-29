import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Redirect based on role
            if (result.user.rol === 'Administrador') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card card">
                    <div className="auth-header">
                        <h1 className="text-gradient">Iniciar Sesión</h1>
                        <p>Bienvenido de vuelta a FUSSION GYM</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-large"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? <span className="spinner"></span> : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                        </p>
                        <Link to="/" className="back-link">← Volver al inicio</Link>
                    </div>

                    <div className="demo-credentials">
                        <p><strong>Credenciales de prueba:</strong></p>
                        <p>Admin: admin@fussion.gym / password123</p>
                        <p>Cliente: carlos@email.com / password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
