import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exercisesAPI } from '../services/api';
import ExerciseDetail from '../components/ExerciseDetail';
import '../pages/DashboardUser.css';

const Exercises = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try {
            const response = await exercisesAPI.getAll();
            setExercises(response.data);
        } catch (error) {
            console.error('Error loading exercises:', error);
            alert('Error al cargar ejercicios');
        } finally {
            setLoading(false);
        }
    };

    const handleViewExercise = (exercise) => {
        setSelectedExercise(exercise);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedExercise(null);
    };

    const handleExerciseCompleted = () => {
        loadExercises();
    };

    const getDifficultyColor = (dificultad) => {
        switch (dificultad?.toLowerCase()) {
            case 'fácil':
            case 'facil':
                return 'var(--color-success)';
            case 'intermedio':
                return 'var(--color-warning)';
            case 'difícil':
            case 'dificil':
                return 'var(--color-error)';
            default:
                return 'var(--color-primary)';
        }
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2 className="text-gradient">CLIENTE</h2>
                </div>

                <nav className="sidebar-nav">
                    <button className="nav-item" onClick={() => navigate('/dashboard')}>
                        <span className="nav-icon">🏠</span>
                        <span className="nav-label">Inicio</span>
                    </button>
                    <button className="nav-item active">
                        <span className="nav-icon">🏋️</span>
                        <span className="nav-label">Ejercicios</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-small">
                        ← Volver
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-content">
                    <h1>Catálogo de Ejercicios</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                        Completa ejercicios y gana puntos
                    </p>

                    {exercises.length === 0 ? (
                        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏋️</div>
                            <p style={{ color: 'var(--color-text-secondary)' }}>No hay ejercicios disponibles</p>
                        </div>
                    ) : (
                        <div className="grid grid-3">
                            {exercises.map(exercise => {
                                const difficultyColor = getDifficultyColor(exercise.dificultad);

                                return (
                                    <div key={exercise.id} className="card" style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{exercise.nombre}</h3>
                                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                                    📂 {exercise.categoria_nombre}
                                                </p>
                                            </div>
                                            {exercise.dificultad && (
                                                <span
                                                    className="badge"
                                                    style={{
                                                        backgroundColor: `${difficultyColor}22`,
                                                        color: difficultyColor,
                                                        borderColor: difficultyColor,
                                                        fontSize: '0.75rem',
                                                        padding: '0.25rem 0.6rem'
                                                    }}
                                                >
                                                    {exercise.dificultad}
                                                </span>
                                            )}
                                        </div>

                                        <p style={{
                                            color: 'var(--color-text-secondary)',
                                            fontSize: '0.9rem',
                                            marginBottom: '1rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {exercise.descripcion}
                                        </p>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderTop: '1px solid var(--color-border)',
                                            paddingTop: '1rem',
                                            marginTop: 'auto'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                                                    Recompensa
                                                </div>
                                                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-success)' }}>
                                                    +{exercise.puntos} pts
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-primary btn-small"
                                                onClick={() => handleViewExercise(exercise)}
                                            >
                                                Ver Ejercicio →
                                            </button>
                                        </div>

                                        {exercise.qr_code && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                backgroundColor: 'rgba(29, 140, 255, 0.2)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.7rem',
                                                border: '1px solid rgba(29, 140, 255, 0.3)'
                                            }}>
                                                📱 QR
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {modalOpen && selectedExercise && (
                <ExerciseDetail
                    exercise={selectedExercise}
                    onClose={handleCloseModal}
                    onCompleted={handleExerciseCompleted}
                />
            )}
        </div>
    );
};

export default Exercises;
