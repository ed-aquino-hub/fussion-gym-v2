import React from 'react';
import logo from '../assets/logo.svg';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <img src={logo} alt="FUSSION GYM" className="footer-logo" />
                        <h3>FUSSION GYM</h3>
                        <p>Gamifica tu entrenamiento</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Producto</h4>
                            <ul>
                                <li><a href="#beneficios">Beneficios</a></li>
                                <li><a href="#gamificacion">Gamificación</a></li>
                                <li><a href="#premios">Premios</a></li>
                                <li><a href="#app-section">App Móvil</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4>Compañía</h4>
                            <ul>
                                <li><a href="/about">Sobre Nosotros</a></li>
                                <li><a href="/contact">Contacto</a></li>
                                <li><a href="/careers">Carreras</a></li>
                                <li><a href="/blog">Blog</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4>Soporte</h4>
                            <ul>
                                <li><a href="/help">Centro de Ayuda</a></li>
                                <li><a href="/faq">Preguntas Frecuentes</a></li>
                                <li><a href="/privacy">Privacidad</a></li>
                                <li><a href="/terms">Términos</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4>Síguenos</h4>
                            <div className="social-links">
                                <a href="#" className="social-icon">📘</a>
                                <a href="#" className="social-icon">📷</a>
                                <a href="#" className="social-icon">🐦</a>
                                <a href="#" className="social-icon">💼</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} FUSSION GYM. Todos los derechos reservados.</p>
                    <div className="footer-bottom-links">
                        <a href="/privacy">Privacidad</a>
                        <span>•</span>
                        <a href="/terms">Términos</a>
                        <span>•</span>
                        <a href="/cookies">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
