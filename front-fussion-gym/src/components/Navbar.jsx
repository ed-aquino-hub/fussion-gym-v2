import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setMenuOpen(false);
        }
    };

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 12H4V20H8V12Z" fill="url(#gradient1)" />
                            <path d="M28 12H24V20H28V12Z" fill="url(#gradient1)" />
                            <path d="M12 8H10V24H12V8Z" fill="url(#gradient2)" />
                            <path d="M22 8H20V24H22V8Z" fill="url(#gradient2)" />
                            <rect x="12" y="14" width="8" height="4" rx="1" fill="url(#gradient3)" />
                            <defs>
                                <linearGradient id="gradient1" x1="4" y1="12" x2="28" y2="20" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#1D8CFF" />
                                    <stop offset="1" stopColor="#37D67A" />
                                </linearGradient>
                                <linearGradient id="gradient2" x1="10" y1="8" x2="22" y2="24" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#1D8CFF" />
                                    <stop offset="1" stopColor="#37D67A" />
                                </linearGradient>
                                <linearGradient id="gradient3" x1="12" y1="14" x2="20" y2="18" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#37D67A" />
                                    <stop offset="1" stopColor="#1D8CFF" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="logo-text">
                        <span className="text-gradient">FUSSION</span> GYM
                    </span>
                </Link>

                {/* Menu Toggle Button */}
                <button
                    className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation Links */}
                <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                    <div className="navbar-links">
                        <a
                            href="#inicio"
                            className="navbar-link"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setMenuOpen(false);
                            }}
                        >
                            Inicio
                        </a>
                        <a
                            href="#beneficios"
                            className="navbar-link"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection('beneficios-section');
                            }}
                        >
                            Beneficios
                        </a>
                        <a
                            href="#gamification"
                            className="navbar-link"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection('gamification-section');
                            }}
                        >
                            Gamificación
                        </a>
                        <a
                            href="#premios"
                            className="navbar-link"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection('premios-section');
                            }}
                        >
                            Premios
                        </a>
                        <a
                            href="#app"
                            className="navbar-link"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection('app-section');
                            }}
                        >
                            App
                        </a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="navbar-auth">
                        {isAuthenticated ? (
                            <>
                                {isAdmin && isAdmin() ? (
                                    <Link
                                        to="/admin"
                                        className="btn btn-secondary btn-small"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Dashboard Admin
                                    </Link>
                                ) : (
                                    <Link
                                        to="/dashboard"
                                        className="btn btn-secondary btn-small"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Mi Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-primary btn-small"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="btn btn-secondary btn-small"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-primary btn-small"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
