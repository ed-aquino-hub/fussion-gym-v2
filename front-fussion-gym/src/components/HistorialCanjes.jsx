import React, { useState, useEffect } from 'react';
import { rewardsAPI } from '../services/api';

const HistorialCanjes = () => {
    const [redemptions, setRedemptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRedemptions();
    }, []);

    const loadRedemptions = async () => {
        try {
            const response = await rewardsAPI.getRedemptionHistory();
            setRedemptions(response.data);
        } catch (error) {
            console.error('Error loading redemptions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div>
            <h1>Mis Canjes</h1>
            {redemptions.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</p>
                    <h3>Aún no has canjeado ningún premio</h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Empieza a entrenar y acumula puntos para canjear premios increíbles</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {redemptions.map(redemption => (
                        <div key={redemption.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <span style={{ fontSize: '2rem' }}>{redemption.premio_nombre.match(/[^ ]+/)}</span>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem 0' }}>{redemption.premio_nombre.replace(/^[^ ]+ /, '')}</h4>
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                            {new Date(redemption.fecha_reclamo).toLocaleDateString()} - {redemption.puntos_necesarios} puntos
                                        </p>
                                    </div>
                                </div>
                                <span className="badge badge-success">Canjeado</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistorialCanjes;
