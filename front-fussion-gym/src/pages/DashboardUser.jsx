import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Perfil from '../components/Perfil';
import EjerciciosView from '../components/EjerciciosView';
import CatalogoPremios from '../components/CatalogoPremios';
import HistorialCanjes from '../components/HistorialCanjes';
import Ranking from '../components/Ranking';
import './DashboardUser.css';

const DashboardUser = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('perfil');
    const [menuOpen, setMenuOpen] = useState(false);

    const tabs = [
        { id: 'perfil', label: 'Mi Perfil', icon: '👤' },
        { id: 'ejercicios', label: 'Ejercicios', icon: '💪' },
        { id: 'premios', label: 'Premios', icon: '🎁' },
        { id: 'canjes', label: 'Mis Canjes', icon: '🎟️' },
        { id: 'ranking', label: 'Ranking', icon: '🏆' }
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="text-gradient">FUSSION</h2>
                    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setMenuOpen(false);
                            }}
                        >
                            <span className="nav-icon">{tab.icon}</span>
                            <span className="nav-label">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">👤</div>
                        <div className="user-details">
                            <div className="user-name">{user?.nombre_completo}</div>
                            <div className="user-points">{user?.puntos || 0} puntos</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary btn-small">
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="dashboard-content">
                    {activeTab === 'perfil' && <Perfil />}
                    {activeTab === 'ejercicios' && <EjerciciosView />}
                    {activeTab === 'premios' && <CatalogoPremios />}
                    {activeTab === 'canjes' && <HistorialCanjes />}
                    {activeTab === 'ranking' && <Ranking />}
                </div>
            </main>
        </div>
    );
};

export default DashboardUser;
