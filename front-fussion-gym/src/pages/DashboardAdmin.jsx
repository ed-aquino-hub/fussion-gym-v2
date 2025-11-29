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
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', descripcion: '', puntos_necesarios: '', stock: '' });

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

    const openEditModal = (reward) => {
        setSelectedReward(reward);
        setFormData({
            nombre: reward.nombre,
            descripcion: reward.descripcion,
            puntos_necesarios: reward.puntos_necesarios,
            stock: reward.stock
        });
        setEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!formData.nombre || !formData.puntos_necesarios || formData.stock === '') {
            alert('Todos los campos son requeridos');
            return;
        }
        try {
            await rewardsAPI.update(selectedReward.id, formData);
            setEditModalOpen(false);
            loadData();
            alert('Premio actualizado exitosamente');
        } catch (error) {
            alert('Error al actualizar premio');
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
                                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                        Total: {users.length} usuarios
                                    </p>
                                    <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px', fontSize: '0.85rem' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                                    <th style={{ padding: '0.5rem 0.6rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600 }}>Nombre</th>
                                                    <th style={{ padding: '0.5rem 0.6rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600 }}>DNI</th>
                                                    <th style={{ padding: '0.5rem 0.6rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600 }}>Email</th>
                                                    <th style={{ padding: '0.5rem 0.6rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>Tel.</th>
                                                    <th style={{ padding: '0.5rem 0.6rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>Edad</th>
                                                    <th style={{ padding: '0.5rem 0.6rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>Pts</th>
                                                    <th style={{ padding: '0.5rem 0.6rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>Registro</th>
                                                    <th style={{ padding: '0.5rem 0.6rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map(u => {
                                                    const createdDate = new Date(u.createdAt);
                                                    const membershipEnd = new Date(createdDate);
                                                    membershipEnd.setMonth(membershipEnd.getMonth() + 1);
                                                    const now = new Date();
                                                    const isActive = now <= membershipEnd;

                                                    return (
                                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                            <td style={{ padding: '0.5rem 0.6rem', fontWeight: 500, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u.nombre_completo}>
                                                                {u.nombre_completo}
                                                            </td>
                                                            <td style={{ padding: '0.5rem 0.6rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                                {u.dni}
                                                            </td>
                                                            <td style={{ padding: '0.5rem 0.6rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u.email}>
                                                                {u.email}
                                                            </td>
                                                            <td style={{ padding: '0.5rem 0.6rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                                                                {u.telefono || '-'}
                                                            </td>
                                                            <td style={{ padding: '0.5rem 0.6rem', textAlign: 'center', fontSize: '0.85rem' }}>
                                                                {u.edad}
                                                            </td>
                                                            <td style={{ padding: '0.5rem 0.6rem', textAlign: 'center', fontWeight: 700, color: 'var(--color-points)', fontSize: '0.9rem' }}>
                                                                {u.puntos}
                                                            </td>
                                                            <td style={{ padding: '0.5rem 0.6rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                                                                {createdDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
                                                            </td>
                                                            <td style={{ padding: '0.5rem 0.6rem', textAlign: 'center' }}>
                                                                <span className={`badge ${isActive ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                                                                    {isActive ? 'Activa' : 'Vencida'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
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
                                                    <span>Stock: <strong style={{ color: r.stock < 10 ? 'var(--color-error)' : 'inherit' }}>{r.stock}</strong></span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button className="btn btn-primary btn-small" onClick={() => openEditModal(r)} style={{ flex: 1 }}>
                                                        ✏️ Editar
                                                    </button>
                                                    <button className="btn btn-secondary btn-small" onClick={() => handleDeleteReward(r.id)} style={{ flex: 1 }}>
                                                        🗑️ Eliminar
                                                    </button>
                                                </div>
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

            {/* Edit Modal */}
            {editModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{
                        maxWidth: '500px',
                        width: '90%',
                        padding: '2rem',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Editar Premio</h2>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                Nombre (incluye emoji)
                            </label>
                            <input
                                type="text"
                                className="input"
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                placeholder="🎁 Nombre del premio"
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                Descripción
                            </label>
                            <textarea
                                className="input"
                                value={formData.descripcion}
                                onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                placeholder="Descripción del premio"
                                rows="3"
                                style={{ width: '100%', resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                    Puntos Necesarios
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.puntos_necesarios}
                                    onChange={e => setFormData({ ...formData, puntos_necesarios: parseInt(e.target.value) || 0 })}
                                    placeholder="100"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                    placeholder="50"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setEditModalOpen(false)}
                                style={{ flex: 1 }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={handleSaveEdit}
                                style={{ flex: 1 }}
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardAdmin;
