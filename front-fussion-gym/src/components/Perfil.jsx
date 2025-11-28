import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import QRCode from 'react-qr-code';
import './Perfil.css';

const Perfil = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            const [profileRes, historyRes] = await Promise.all([
                usersAPI.getById(user.id),
                usersAPI.getExerciseHistory(user.id)
            ]);
            setProfileData(profileRes.data);
            setExerciseHistory(historyRes.data);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="perfil">
            <h1>Mi Perfil</h1>

            <div className="perfil-grid">
                {/* User Card */}
                <div className="card perfil-card">
                    <div className="perfil-avatar">👤</div>
                    <h2>{profileData?.nombre_completo}</h2>
                    <p className="perfil-email">{profileData?.email}</p>

                    <div className="perfil-stats">
                        <div className="stat-item">
                            <div className="stat-value text-gradient">{profileData?.puntos || 0}</div>
                            <div className="stat-label">Puntos Totales</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value text-gradient">{exerciseHistory.length}</div>
                            <div className="stat-label">Ejercicios Completados</div>
                        </div>
                    </div>

                    {profileData?.membresia_nombre && (
                        <div className="membresia-info">
                            <h4>Membresía</h4>
                            <div className="badge badge-success">{profileData.membresia_nombre}</div>
                            <p className="membresia-dates">
                                {new Date(profileData.membresia_inicio).toLocaleDateString()} - {new Date(profileData.membresia_fin).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>

                {/* QR Code Card */}
                <div className="card qr-card">
                    <h3>Mi Código QR</h3>
                    <p>Preséntalo en recepción para registrar tu asistencia</p>
                    <div className="qr-code-container">
                        <QRCode value={`USER-${user.id}`} size={200} />
                    </div>
                    <p className="qr-id">ID: #{user.id}</p>
                </div>

                {/* Recent Activity */}
                <div className="card activity-card">
                    <h3>Actividad Reciente</h3>
                    <div className="activity-list">
                        {exerciseHistory.slice(0, 5).map((item, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-icon">💪</div>
                                <div className="activity-details">
                                    <div className="activity-name">{item.nombre}</div>
                                    <div className="activity-date">{new Date(item.fecha_completado).toLocaleDateString()}</div>
                                </div>
                                <div className="activity-points">+{item.puntos} pts</div>
                            </div>
                        ))}
                        {exerciseHistory.length === 0 && (
                            <p className="empty-state">Aún no has completado ningún ejercicio</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
