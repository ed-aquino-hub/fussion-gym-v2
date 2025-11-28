import React from 'react';
import './Hero.css';

const Hero = () => {
    const scrollToApp = () => {
        const appSection = document.getElementById('app-section');
        if (appSection) {
            appSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero">
            <div className="hero-background">
                <div className="hero-glow"></div>
            </div>

            <div className="container hero-content">
                <div className="hero-text fade-in">
                    <h1 className="hero-title">
                        Transforma tu rutina en un
                        <span className="text-gradient"> JUEGO</span>
                    </h1>
                    <p className="hero-subtitle">
                        Sistema de gamificación para gimnasios que convierte cada entrenamiento en una aventura de puntos, niveles y recompensas reales.
                    </p>
                    <div className="hero-ctas">
                        <a href="/register" className="btn btn-primary btn-large">
                            Comienza Ahora
                        </a>
                        <button onClick={scrollToApp} className="btn btn-secondary btn-large">
                            Ver Demo
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <div className="stat-number text-gradient">50+</div>
                            <div className="stat-label">Puntos por Asistencia</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number text-gradient">30+</div>
                            <div className="stat-label">Ejercicios Disponibles</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number text-gradient">10+</div>
                            <div className="stat-label">Premios Exclusivos</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hero-scroll-indicator">
                <div className="scroll-arrow"></div>
            </div>
        </section>
    );
};

export default Hero;
