import React from 'react';
import './WhatIsFussion.css';

const WhatIsFussion = () => {
    return (
        <section className="what-is-fussion section">
            <div className="container">
                <div className="section-header text-center">
                    <h2>¿Qué es <span className="text-gradient">FUSSION GYM</span>?</h2>
                    <p className="section-subtitle">
                        La revolución del fitness gamificado
                    </p>
                </div>

                <div className="content-grid">
                    <div className="content-text">
                        <p>
                            <strong>FUSSION GYM</strong> es un ecosistema innovador que transforma la experiencia tradicional del gimnasio en una aventura gamificada donde cada ejercicio suma, cada asistencia cuenta y cada logro te acerca a premios reales.
                        </p>
                        <p>
                            Utilizamos tecnología QR para registrar tus entrenamientos instantáneamente, un sistema de puntos que recompensa tu esfuerzo y dedicación, y un catálogo de premios exclusivos que puedes canjear con tus puntos ganados.
                        </p>
                        <div className="features-list">
                            <div className="feature-item">
                                <span className="feature-icon">📱</span>
                                <div>
                                    <h4>App Móvil Completa</h4>
                                    <p>Escanea QR, ve tu perfil y canjea premios desde tu celular</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">💪</span>
                                <div>
                                    <h4>Seguimiento en Tiempo Real</h4>
                                    <p>Visualiza tu progreso, puntos y ranking al instante</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🎯</span>
                                <div>
                                    <h4>Objetivos y Logros</h4>
                                    <p>Alcanza metas y desbloquea recompensas especiales</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content-visual">
                        <div className="visual-card card-glow">
                            <div className="visual-header">
                                <h3>Sistema de Puntos</h3>
                            </div>
                            <div className="points-simulation">
                                <div className="point-item slide-in-right">
                                    <span className="point-activity">Asistencia al gym</span>
                                    <span className="point-value">+50 pts</span>
                                </div>
                                <div className="point-item slide-in-right" style={{ animationDelay: '0.1s' }}>
                                    <span className="point-activity">Clase de Spinning</span>
                                    <span className="point-value">+30 pts</span>
                                </div>
                                <div className="point-item slide-in-right" style={{ animationDelay: '0.2s' }}>
                                    <span className="point-activity">Ejercicio completado</span>
                                    <span className="point-value">+20 pts</span>
                                </div>
                                <div className="point-item slide-in-right" style={{ animationDelay: '0.3s' }}>
                                    <span className="point-activity">Cardio 30 min</span>
                                    <span className="point-value">+15 pts</span>
                                </div>
                                <div className="total-points">
                                    <span>Total acumulado:</span>
                                    <span className="text-gradient total-number">1,250 pts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatIsFussion;
