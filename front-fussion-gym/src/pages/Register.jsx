import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Reuse login styles

const Register = () => {
    const navigate = useNavigate();
    const { register, login } = useAuth();
    const [formData, setFormData] = useState({
        nombre_completo: '',
        dni: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        edad: ''
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

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        const { confirmPassword, ...registerData } = formData;
        const result = await register(registerData);

        if (result.success) {
            // Auto login after successful registration
            const loginResult = await login(formData.email, formData.password);
            if (loginResult.success) {
                navigate('/dashboard');
            }
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container" style={{ maxWidth: '550px' }}>
                <div className="auth-card card">
                    <div className="auth-header">
                        <h1 className="text-gradient">Crear Cuenta</h1>
                        <p>Únete a la revolución del fitness gamificado</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="nombre_completo" className="form-label">Nombre Completo *</label>
                            <input
                                type="text"
                                id="nombre_completo"
                                name="nombre_completo"
                                className="form-input"
                                placeholder="Juan Pérez"
                                value={formData.nombre_completo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="dni" className="form-label">DNI</label>
                                <input
                                    type="text"
                                    id="dni"
                                    name="dni"
                                    className="form-input"
                                    placeholder="12345678"
                                    value={formData.dni}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edad" className="form-label">Edad</label>
                                <input
                                    type="number"
                                    id="edad"
                                    name="edad"
                                    className="form-input"
                                    placeholder="25"
                                    value={formData.edad}
                                    onChange={handleChange}
                                    min="1"
                                    max="120"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email *</label>
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
                            <label htmlFor="telefono" className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                className="form-input"
                                placeholder="555-1234"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Contraseña *</label>
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

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
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
                            {loading ? <span className="spinner"></span> : 'Crear Cuenta'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                        </p>
                        <Link to="/" className="back-link">← Volver al inicio</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
