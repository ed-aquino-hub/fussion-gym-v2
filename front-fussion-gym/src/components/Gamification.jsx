import React from 'react';
import './Gamification.css';

const Gamification = () => {
    return (
        <section id="gamification-section" className="gamification section">
            <div className="container">
                <div className="section-header text-center">
                    <h2>¿Cómo funciona la <span className="text-gradient">Gamificación</span>?</h2>
                    <p className="section-subtitle">
                        Tres simples pasos para empezar a ganar
                    </p>
                </div>

                <div className="gamification-flow">
                    <div className="flow-step">
                        <div className="step-number">1</div>
                        <div className="step-content card">
                            <div className="step-icon">📲</div>
                            <h3>Escanea QR</h3>
                            <p>
                                Usa la app móvil para escanear códigos QR en máquinas, clases o al registrar tu asistencia.
                            </p>
                        </div>
                        <div className="step-connector"></div>
                    </div>

                    <div className="flow-step">
                        <div className="step-number">2</div>
                        <div className="step-content card">
                            <div className="step-icon">⭐</div>
                            <h3>Gana Puntos</h3>
                            <p>
                                Cada actividad suma puntos: asistencias, ejercicios completados, clases grupales y más.
                            </p>
                        </div>
                        <div className="step-connector"></div>
                    </div>

                    <div className="flow-step">
                        <div className="step-number">3</div>
                        <div className="step-content card">
                            <div className="step-icon">🎁</div>
                            <h3>Canjea Premios</h3>
                            <p>
                                Usa tus puntos para obtener productos, servicios premium y experiencias exclusivas.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="gamification-features">
                    <div className="feature-highlight card glass">
                        <h4>🔥 Rachas de Asistencia</h4>
                        <p>Mantén tu racha diaria y gana puntos bonus</p>
                        <div className="streak-visual">
                            <span className="streak-day active">L</span>
                            <span className="streak-day active">M</span>
                            <span className="streak-day active">X</span>
                            <span className="streak-day">J</span>
                            <span className="streak-day">V</span>
                            <span className="streak-day">S</span>
                            <span className="streak-day">D</span>
                        </div>
                    </div>

                    <div className="feature-highlight card glass">
                        <h4>🏅 Sistema de Niveles</h4>
                        <p>Sube de nivel completando desafíos</p>
                        <div className="level-visual">
                            <div className="level-badge">
                                <span className="level-number">12</span>
                                <span className="level-label">Nivel</span>
                            </div>
                            <div className="level-progress">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '65%' }}></div>
                                </div>
                                <span className="progress-text">650 / 1000 XP</span>
                            </div>
                        </div>
                    </div>

                    <div className="feature-highlight card glass">
                        <h4>👥 Ranking Global</h4>
                        <p>Compite con otros miembros del gym</p>
                        <div className="ranking-preview">
                            <div className="rank-item">
                                <span className="rank-position">🥇 1°</span>
                                <span className="rank-name">María G.</span>
                                <span className="rank-points">2,450 pts</span>
                            </div>
                            <div className="rank-item">
                                <span className="rank-position">🥈 2°</span>
                                <span className="rank-name">Carlos R.</span>
                                <span className="rank-points">2,100 pts</span>
                            </div>
                            <div className="rank-item highlight">
                                <span className="rank-position">🏆 3°</span>
                                <span className="rank-name">Tú</span>
                                <span className="rank-points">1,850 pts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gamification;
