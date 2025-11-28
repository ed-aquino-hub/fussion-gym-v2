import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, rewardsAPI } from '../services/api';
import '../pages/DashboardUser.css'; // Reuse dashboard styles

const DashboardAdmin = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [redemptions, setRedemptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersRes, rewardsRes, redemptionsRes] = await Promise.all([
                usersAPI.getAll(),
                rewardsAPI.getAll(),
                rewardsAPI.getRedemptionHistory()
            ]);
            setUsers(usersRes.data);
            setRewards(rewardsRes.data);
            setRedemptions(redemptionsRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReward = async (id) => {
        if (!confirm('¿Seguro que quieres eliminar este premio?')) return;
        try {
            await rewardsAPI.delete(id);
            loadData();
            alert('Premio eliminado exitosamente');
        } catch (error) {
            alert('Error al eliminar premio');
        }
    };

    const totalPoints = users.reduce((sum, u) => sum + u.puntos, 0);
    const totalClients = users.filter(u => u.rol === 'Cliente').length;

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2 className="text-gradient">ADMIN</h2>
                </div>

                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <span className="nav-icon">📊</span>
                        <span className="nav-label">Dashboard</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <span className="nav-icon">👥</span>
                        <span className="nav-label">Usuarios</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'rewards' ? 'active' : ''}`} onClick={() => setActiveTab('rewards')}>
                        <span className="nav-icon">🎁</span>
                        <span className="nav-label">Premios</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'redemptions' ? 'active' : ''}`} onClick={() => setActiveTab('redemptions')}>
                        <span className="nav-icon">🎟️</span>
                        <span className="nav-label">Canjes</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={() => { logout(); navigate('/'); }} className="btn btn-secondary btn-small">
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-content">
                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : (
                        <>
                            {activeTab === 'overview' && (
                                <div>
                                    <h1>Panel Administrativo</h1>
                                    <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
                                        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>{totalClients}</div>
                                            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Clientes Activos</p>
                                        </div>
                                        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-points)', fontFamily: 'var(--font-heading)' }}>{totalPoints.toLocaleString()}</div>
                                            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Puntos en Circulación</p>
                                        </div>
                                        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-warning)', fontFamily: 'var(--font-heading)' }}>{redemptions.length}</div>
                                            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Canjes Realizados</p>
                                        </div>
                                    </div>

                                    <h2>Top 10 Usuarios</h2>
                                    <div className="card" style={{ padding: '1.5rem' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Usuario</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Puntos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.slice(0, 10).map(u => (
                                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                        <td style={{ padding: '0.75rem' }}>{u.nombre_completo}</td>
                                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-points)' }}>{u.puntos}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div>
                                    <h1>Gestión de Usuarios</h1>
                                    <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nombre</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Rol</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Puntos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map(u => (
                                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                        <td style={{ padding: '0.75rem' }}>{u.nombre_completo}</td>
                                                        <td style={{ padding: '0.75rem', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                                                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                            <span className={`badge ${u.rol === 'Administrador' ? 'badge-warning' : 'badge-primary'}`}>{u.rol}</span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-points)' }}>{u.puntos}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'rewards' && (
                                <div>
                                    <h1>Gestión de Premios</h1>
                                    <div className="grid grid-3">
                                        {rewards.map(r => (
                                            <div key={r.id} className="card" style={{ padding: '1.5rem' }}>
                                                <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>{r.nombre.match(/[^ ]+/)}</div>
                                                <h3 style={{ marginBottom: '0.5rem' }}>{r.nombre.replace(/^[^ ]+ /, '')}</h3>
                                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{r.descripcion}</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                    <span>Puntos: <strong>{r.puntos_necesarios}</strong></span>
                                                    <span>Stock: <strong>{r.stock}</strong></span>
                                                </div>
                                                <button className="btn btn-secondary btn-small" onClick={() => handleDeleteReward(r.id)} style={{ width: '100%' }}>
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'redemptions' && (
                                <div>
                                    <h1>Historial de Canjes</h1>
                                    <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Usuario</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Premio</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Puntos</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Fecha</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {redemptions.map(r => (
                                                    <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                        <td style={{ padding: '0.75rem' }}>{r.nombre_completo}</td>
                                                        <td style={{ padding: '0.75rem' }}>{r.premio_nombre}</td>
                                                        <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700, color: 'var(--color-points)' }}>{r.puntos_necesarios}</td>
                                                        <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--color-text-secondary)' }}>{new Date(r.fecha_reclamo).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardAdmin;
