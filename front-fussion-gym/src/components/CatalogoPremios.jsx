import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rewardsAPI } from '../services/api';
import './CatalogoPremios.css';

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

    const userPoints = user?.puntos || 0;

    return (
        <div>
            <h1>Catálogo de Premios</h1>
            <div className="points-banner card" style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-bg-card) 0%, rgba(29, 140, 255, 0.1) 100%)' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Tus puntos disponibles</h3>
                <div style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-points) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {userPoints}
                </div>
            </div>

            <div className="grid grid-3">
                {rewards.map(reward => {
                    const canAfford = userPoints >= reward.puntos_necesarios;
                    const hasStock = reward.stock > 0;
                    const pointsProgress = Math.min((userPoints / reward.puntos_necesarios) * 100, 100);
                    const pointsNeeded = reward.puntos_necesarios - userPoints;

                    return (
                        <div
                            key={reward.id}
                            className={`card reward-card ${!canAfford ? 'insufficient-points' : ''} ${!hasStock ? 'out-of-stock' : ''}`}
                            style={{
                                padding: '1.5rem',
                                textAlign: 'center',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                border: canAfford && hasStock ? '2px solid var(--color-points)' : '1px solid var(--color-border)'
                            }}
                        >
                            {/* Status badge */}
                            {!hasStock && (
                                <div className="badge badge-warning" style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.7rem' }}>
                                    Sin Stock
                                </div>
                            )}
                            {canAfford && hasStock && (
                                <div className="badge badge-success" style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.7rem' }}>
                                    ✓ Disponible
                                </div>
                            )}

                            <div style={{ fontSize: '4rem', marginBottom: '1rem', filter: !canAfford || !hasStock ? 'grayscale(50%) opacity(0.6)' : 'none' }}>
                                {reward.nombre.match(/[^ ]+/)}
                            </div>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{reward.nombre.replace(/^[^ ]+ /, '')}</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', minHeight: '3rem' }}>
                                {reward.descripcion}
                            </p>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>Puntos necesarios:</span>
                                    <span style={{ fontWeight: 700, color: canAfford ? 'var(--color-points)' : 'var(--color-warning)' }}>
                                        {reward.puntos_necesarios}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                {!canAfford && (
                                    <>
                                        <div style={{
                                            width: '100%',
                                            height: '8px',
                                            background: 'var(--color-border)',
                                            borderRadius: 'var(--radius-full)',
                                            overflow: 'hidden',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{
                                                width: `${pointsProgress}%`,
                                                height: '100%',
                                                background: 'linear-gradient(90deg, var(--color-primary), var(--color-points))',
                                                transition: 'width 0.5s ease'
                                            }} />
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', margin: 0 }}>
                                            Te faltan {pointsNeeded} puntos
                                        </p>
                                    </>
                                )}

                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>Stock disponible: </span>
                                    <strong style={{ color: hasStock ? 'var(--color-white)' : 'var(--color-error)' }}>
                                        {reward.stock}
                                    </strong>
                                </div>
                            </div>

                            <button
                                className={`btn ${canAfford && hasStock ? 'btn-success' : 'btn-secondary'}`}
                                onClick={() => handleRedeem(reward)}
                                disabled={!canAfford || !hasStock || redeeming === reward.id}
                                style={{
                                    width: '100%',
                                    opacity: (!canAfford || !hasStock) ? 0.6 : 1,
                                    cursor: (!canAfford || !hasStock) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {redeeming === reward.id ? (
                                    <>
                                        <span className="spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}></span>
                                        Canjeando...
                                    </>
                                ) : !hasStock ? (
                                    '❌ Sin Stock'
                                ) : !canAfford ? (
                                    '💰 Puntos Insuficientes'
                                ) : (
                                    '✓ Canjear Ahora'
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {
                rewards.length === 0 && (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--color-text-secondary)' }}>No hay premios disponibles en este momento</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>Vuelve pronto para ver nuevas recompensas</p>
                    </div>
                )
            }
        </div >
    );
};

export default CatalogoPremios;
