import React, { useState } from 'react';
import { exercisesAPI } from '../services/api';

const ExerciseDetail = ({ exercise, onClose, onCompleted }) => {
    const [completing, setCompleting] = useState(false);

    const handleCompleteExercise = async () => {
        if (!confirm(`¿Has completado el ejercicio "${exercise.nombre}"? Ganarás ${exercise.puntos} puntos.`)) {
            return;
        }

        setCompleting(true);
        try {
            const result = await exercisesAPI.scan({ ejercicioId: exercise.id });
            alert(`${result.data.message}\n\nPuntos ganados: +${result.data.puntos_ganados}\nPuntos totales: ${result.data.puntos_totales}`);
            onCompleted();
            onClose();
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'No se pudo completar el ejercicio';
            alert(errorMsg);
        } finally {
            setCompleting(false);
        }
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

    // Get YouTube embed URL
    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/embed/')) return url;
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        return url;
    };

    const embedUrl = getEmbedUrl(exercise.video_url) || 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Placeholder
    const difficultyColor = getDifficultyColor(exercise.dificultad);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
            overflowY: 'auto'
        }}>
            <div className="card" style={{
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                position: 'relative'
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.5rem',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        lineHeight: 1
                    }}
                >
                    ✕
                </button>

                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', fontSize: '1.8rem' }}>
                        {exercise.nombre}
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                            📂 {exercise.categoria_nombre}
                        </span>
                        {exercise.dificultad && (
                            <span
                                className="badge"
                                style={{
                                    backgroundColor: `${difficultyColor}22`,
                                    color: difficultyColor,
                                    borderColor: difficultyColor
                                }}
                            >
                                {exercise.dificultad}
                            </span>
                        )}
                    </div>
                </div>

                {/* Video Tutorial */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', fontSize: '1.2rem' }}>
                        📹 Video Tutorial
                    </h3>
                    <div style={{
                        position: 'relative',
                        paddingBottom: '56.25%', // 16:9 aspect ratio
                        height: 0,
                        overflow: 'hidden',
                        borderRadius: '0.5rem',
                        backgroundColor: '#000'
                    }}>
                        <iframe
                            src={embedUrl}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', fontSize: '1.2rem' }}>
                        📝 Descripción
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                        {exercise.descripcion}
                    </p>
                </div>

                {/* QR Code */}
                {exercise.qr_code && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', fontSize: '1.2rem' }}>
                            📱 Código QR
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '150px',
                                height: '150px',
                                backgroundColor: 'var(--color-bg)',
                                borderRadius: '0.5rem',
                                border: '2px solid var(--color-primary)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '1rem'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>QR</div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--color-text-secondary)',
                                    fontFamily: 'monospace',
                                    textAlign: 'center',
                                    wordBreak: 'break-all'
                                }}>
                                    {exercise.qr_code}
                                </div>
                            </div>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                Escanea este QR en el gimnasio para completar el ejercicio
                            </p>
                        </div>
                    </div>
                )}

                {/* Additional Info */}
                {(exercise.instructor || exercise.horario || exercise.capacidad_maxima) && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', fontSize: '1.2rem' }}>
                            ℹ️ Información Adicional
                        </h3>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {exercise.instructor && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <strong style={{ minWidth: '100px' }}>Instructor:</strong>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>{exercise.instructor}</span>
                                </div>
                            )}
                            {exercise.horario && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <strong style={{ minWidth: '100px' }}>Horario:</strong>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>{exercise.horario}</span>
                                </div>
                            )}
                            {exercise.capacidad_maxima && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <strong style={{ minWidth: '100px' }}>Capacidad:</strong>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>
                                        {exercise.cupos_actuales || 0} / {exercise.capacidad_maxima}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Reward Info */}
                <div style={{
                    backgroundColor: 'rgba(55, 214, 122, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(55, 214, 122, 0.3)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                        🎁 Recompensa
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                        Al completar esta rutina ganarás
                    </p>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-success)' }}>
                        +{exercise.puntos} puntos
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        style={{ flex: 1 }}
                    >
                        Cancelar
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={handleCompleteExercise}
                        disabled={completing}
                        style={{ flex: 1 }}
                    >
                        {completing ? 'Completando...' : '✓ Completar Rutina'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseDetail;
