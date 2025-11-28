import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rankingAPI } from '../services/api';

const Ranking = () => {
    const { user } = useAuth();
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRanking();
    }, []);

    const loadRanking = async () => {
        try {
            const response = await rankingAPI.get(50);
            setRanking(response.data);
        } catch (error) {
            console.error('Error loading ranking:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMedalEmoji = (position) => {
        if (position === 1) return '🥇';
        if (position === 2) return '🥈';
        if (position === 3) return '🥉';
        return `#${position}`;
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div>
            <h1>Ranking de Atletas</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                Top {ranking.length} miembros con más puntos
            </p>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
                {ranking.map((member, index) => {
                    const isCurrentUser = member.id === user?.id;

                    return (
                        <div
                            key={member.id}
                            className={`card ${isCurrentUser ? 'card-glow' : ''}`}
                            style={{
                                padding: '1.25rem',
                                background: isCurrentUser ? 'rgba(29, 140, 255, 0.15)' : undefined,
                                border: isCurrentUser ? '2px solid var(--color-primary)' : undefined
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{
                                    fontSize: index < 3 ? '2rem' : '1.25rem',
                                    minWidth: '50px',
                                    fontWeight: 800,
                                    textAlign: 'center',
                                    color: index < 3 ? undefined : 'var(--color-text-secondary)'
                                }}>
                                    {getMedalEmoji(member.posicion)}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: ' center', gap: '0.5rem' }}>
                                        {member.nombre_completo}
                                        {isCurrentUser && <span className="badge badge-primary">Tú</span>}
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                        {member.ejercicios_completados} ejercicios completados
                                    </p>
                                </div>

                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    color: 'var(--color-points)',
                                    fontFamily: 'var(--font-heading)'
                                }}>
                                    {member.puntos.toLocaleString()} pts
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Ranking;
