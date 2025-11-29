import React from 'react';
import './PremiosList.css';

const PremiosList = () => {
    const premios = [
        { emoji: '🧴', nombre: 'Shaker FUSSION', puntos: 100 },
        { emoji: '👕', nombre: 'Camiseta Deportiva', puntos: 250 },
        { emoji: '🧢', nombre: 'Gorra FUSSION', puntos: 200 },
        { emoji: '💪', nombre: 'Guantes de Entrenamiento', puntos: 300 },
        { emoji: '🎒', nombre: 'Mochila Deportiva', puntos: 500 },
        { emoji: '🎟️', nombre: 'Clase Personal Gratis', puntos: 400 },
        { emoji: '🥤', nombre: 'Batido de Proteína', puntos: 150 },
        { emoji: '🧘', nombre: 'Mes de Yoga Gratis', puntos: 600 },
        { emoji: '🧖', nombre: 'Toalla Premium', puntos: 180 },
        { emoji: '🎧', nombre: 'Audífonos Deportivos', puntos: 350 }
    ];

    return (
        <section id="premios-section" className="premios-list section">
            <div className="container">
                <div className="section-header text-center">
                    <h2>Premios <span className="text-gradient">Increíbles</span></h2>
                    <p className="section-subtitle">
                        Canjea tus puntos por productos y servicios exclusivos
                    </p>
                </div>

                <div className="premios-grid">
                    {premios.map((premio, index) => (
                        <div
                            key={index}
                            className="premio-card card fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="premio-emoji">{premio.emoji}</div>
                            <h4 className="premio-nombre">{premio.nombre}</h4>
                            <div className="premio-puntos">
                                <span className="puntos-value">{premio.puntos}</span>
                                <span className="puntos-label">puntos</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="premios-cta text-center">
                    <p>¡Y muchos más premios disponibles en la app!</p>
                    <a href="/register" className="btn btn-success btn-large">
                        Únete Ahora
                    </a>
                </div>
            </div>
        </section>
    );
};

export default PremiosList;
