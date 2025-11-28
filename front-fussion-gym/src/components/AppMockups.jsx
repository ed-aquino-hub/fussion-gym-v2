import React from 'react';
import './AppMockups.css';

const AppMockups = () => {
    return (
        <section id="app-section" className="app-mockups section gradient-bg">
            <div className="container">
                <div className="section-header text-center">
                    <h2>La App en <span className="text-gradient">tu Bolsillo</span></h2>
                    <p className="section-subtitle">
                        Gestiona tu progreso desde cualquier lugar
                    </p>
                </div>

                <div className="mockups-container">
                    <div className="mockup-card glass">
                        <div className="mockup-phone">
                            <div className="phone-screen">
                                <div className="screen-header">
                                    <div className="status-bar">
                                        <span>9:41</span>
                                        <div className="indicators">📶 🔋</div>
                                    </div>
                                    <h3>Mi Perfil</h3>
                                </div>
                                <div className="screen-content">
                                    <div className="profile-avatar">👤</div>
                                    <h4>Carlos Ramírez</h4>
                                    <div className="profile-stats">
                                        <div className="stat-box">
                                            <div className="stat-value text-gradient">1,250</div>
                                            <div className="stat-label">Puntos</div>
                                        </div>
                                        <div className="stat-box">
                                            <div className="stat-value text-gradient">12</div>
                                            <div className="stat-label">Nivel</div>
                                        </div>
                                    </div>
                                    <div className="qr-code">
                                        <div className="qr-placeholder">
                                            <span>QR</span>
                                        </div>
                                        <p>Mi código personal</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mockup-label">Perfil de Usuario</div>
                    </div>

                    <div className="mockup-card glass">
                        <div className="mockup-phone">
                            <div className="phone-screen">
                                <div className="screen-header">
                                    <div className="status-bar">
                                        <span>9:41</span>
                                        <div className="indicators">📶 🔋</div>
                                    </div>
                                    <h3>Escáner QR</h3>
                                </div>
                                <div className="screen-content scanner-screen">
                                    <div className="scanner-frame">
                                        <div className="scan-corner tl"></div>
                                        <div className="scan-corner tr"></div>
                                        <div className="scan-corner bl"></div>
                                        <div className="scan-corner br"></div>
                                        <div className="scan-line"></div>
                                    </div>
                                    <p className="scanner-text">Apunta al código QR del ejercicio</p>
                                </div>
                            </div>
                        </div>
                        <div className="mockup-label">Escáner de Ejercicios</div>
                    </div>

                    <div className="mockup-card glass">
                        <div className="mockup-phone">
                            <div className="phone-screen">
                                <div className="screen-header">
                                    <div className="status-bar">
                                        <span>9:41</span>
                                        <div className="indicators">📶 🔋</div>
                                    </div>
                                    <h3>Premios</h3>
                                </div>
                                <div className="screen-content">
                                    <div className="premio-mini-card">
                                        <span className="premio-mini-emoji">👕</span>
                                        <div className="premio-mini-info">
                                            <div className="premio-mini-name">Camiseta</div>
                                            <div className="premio-mini-points">250 pts</div>
                                        </div>
                                    </div>
                                    <div className="premio-mini-card">
                                        <span className="premio-mini-emoji">🧢</span>
                                        <div className="premio-mini-info">
                                            <div className="premio-mini-name">Gorra</div>
                                            <div className="premio-mini-points">200 pts</div>
                                        </div>
                                    </div>
                                    <div className="premio-mini-card">
                                        <span className="premio-mini-emoji">🎒</span>
                                        <div className="premio-mini-info">
                                            <div className="premio-mini-name">Mochila</div>
                                            <div className="premio-mini-points">500 pts</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mockup-label">Catálogo de Premios</div>
                    </div>
                </div>

                <div className="app-features">
                    <div className="feature-pill">📱 App iOS & Android</div>
                    <div className="feature-pill">⚡ QR Instantáneo</div>
                    <div className="feature-pill">📊 Estadísticas en Vivo</div>
                    <div className="feature-pill">🏆 Rankings Actualizados</div>
                </div>
            </div>
        </section>
    );
};

export default AppMockups;
