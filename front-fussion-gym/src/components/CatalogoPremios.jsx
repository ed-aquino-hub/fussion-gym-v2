import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rewardsAPI } from '../services/api';

const CatalogoPremios = () => {
    const { user } = useAuth();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState(null);

    useEffect(() => {
        loadRewards();
    }, []);

    const loadRewards = async () => {
        try {
            const response = await rewardsAPI.getAll();
            setRewards(response.data);
        } catch (error) {
            console.error('Error loading rewards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async (reward) => {
        if (!confirm(`¿Seguro que quieres canjear ${reward.nombre} por ${reward.puntos_necesarios} puntos?`)) return;

        setRedeeming(reward.id);
        try {
            await rewardsAPI.redeem(reward.id);
            alert(`¡Premio "${reward.nombre}" canjeado exitosamente!`);
            loadRewards();
            window.location.reload(); // Reload to update user points
        } catch (error) {
            alert(error.response?.data?.error || 'Error al canjear premio');
        } finally {
            setRedeeming(null);
        }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div>
            <h1>Catálogo de Premios</h1>
            <div className="points-banner card" style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                <h3>Tus puntos disponibles: <span className="text-gradient">{user?.puntos || 0}</span></h3>
            </div>

            <div className="grid grid-3">
                {rewards.map(reward => {
                    const canAfford = (user?.puntos || 0) >= reward.puntos_necesarios;
                    const hasStock = reward.stock > 0;

                    return (
                        <div key={reward.id} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{reward.nombre.match(/[^ ]+/)}</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{reward.nombre.replace(/^[^ ]+ /, '')}</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{reward.descripcion}</p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>Puntos: <strong className="text-gradient">{reward.puntos_necesarios}</strong></span>
                                <span>Stock: <strong>{reward.stock}</strong></span>
                            </div>

                            <button
                                className={`btn ${canAfford && hasStock ? 'btn-success' : 'btn-secondary'}`}
                                onClick={() => handleRedeem(reward)}
                                disabled={!canAfford || !hasStock || redeeming === reward.id}
                                style={{ width: '100%' }}
                            >
                                {redeeming === reward.id ? 'Canjeando...' : !hasStock ? 'Sin Stock' : !canAfford ? 'Puntos Insuficientes' : 'Canjear'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CatalogoPremios;
