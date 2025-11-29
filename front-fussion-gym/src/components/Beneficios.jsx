import React from 'react';
import './Beneficios.css';

const Beneficios = () => {
    const benefits = [
        {
            icon: '🎮',
            title: 'Gamificación Total',
            description: 'Convierte cada entrenamiento en un juego donde ganas puntos, subes de nivel y desbloqueas logros.'
        },
        {
            icon: '🏆',
            title: 'Premios Reales',
            description: 'Canjea tus puntos por productos, servicios y experiencias exclusivas del gimnasio.'
        },
        {
            icon: '📊',
            title: 'Seguimiento Preciso',
            description: 'Monitorea tu progreso con estadísticas detalladas y visualiza tu evolución en tiempo real.'
        },
        {
            icon: '🤝',
            title: 'Competencia Sana',
            description: 'Compite en rankings con otros miembros y motívate a mejorar cada día.'
        },
        {
            icon: '⚡',
            title: 'QR Instantáneo',
            description: 'Registra ejercicios y asistencias con un simple escaneo de código QR.'
        },
        {
            icon: '📱',
            title: 'App Móvil',
            description: 'Accede a todas las funciones desde tu smartphone, en cualquier momento y lugar.'
        }
    ];

    return (
        <section id="beneficios-section" className="beneficios section gradient-bg">
            <div className="container">
                <div className="section-header text-center">
                    <h2>Beneficios que <span className="text-gradient">Transforman</span></h2>
                    <p className="section-subtitle">
                        Una experiencia de gimnasio diseñada para mantenerte motivado
                    </p>
                </div>

                <div className="benefits-grid">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="benefit-card card fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="benefit-icon">{benefit.icon}</div>
                            <h3 className="benefit-title">{benefit.title}</h3>
                            <p className="benefit-description">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Beneficios;
