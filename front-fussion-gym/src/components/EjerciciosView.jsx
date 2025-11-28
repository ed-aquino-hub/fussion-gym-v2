import React, { useState, useEffect } from 'react';
import { exercisesAPI } from '../services/api';
import QRCode from 'react-qr-code';
import './EjerciciosView.css';

const EjerciciosView = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try {
            const response = await exercisesAPI.getAll();
            setExercises(response.data);
        } catch (error) {
            console.error('Error loading exercises:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', ...new Set(exercises.map(e => e.categoria_nombre))];
    const filteredExercises = filter === 'all'
        ? exercises
        : exercises.filter(e => e.categoria_nombre === filter);

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="ejercicios-view">
            <div className="ejercicios-header">
                <h1>Ejercicios Disponibles</h1>
                <p>Escanea el código QR de cada ejercicio para ganar puntos</p>
            </div>

            <div className="filter-tabs">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`filter-tab ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat === 'all' ? 'Todos' : cat}
                    </button>
                ))}
            </div>

            <div className="ejercicios-grid">
                {filteredExercises.map(exercise => (
                    <div key={exercise.id} className="card ejercicio-card">
                        <div className="ejercicio-header">
                            <h3>{exercise.nombre}</h3>
                            <span className="badge badge-primary">{exercise.categoria_nombre}</span>
                        </div>
                        <p className="ejercicio-descripcion">{exercise.descripcion}</p>

                        <div className="ejercicio-meta">
                            <div className="meta-item">
                                <span className="meta-label">Puntos:</span>
                                <span className="meta-value text-gradient">{exercise.puntos}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Dificultad:</span>
                                <span className="meta-value">{exercise.dificultad}</span>
                            </div>
                        </div>

                        {exercise.instructor && (
                            <div className="ejercicio-class-info">
                                <p><strong>👤  {exercise.instructor}</strong></p>
                                <p>⏰ {exercise.horario}</p>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-small"
                            onClick={() => setSelectedExercise(exercise)}
                            style={{ width: '100%' }}
                        >
                            Ver Código QR
                        </button>
                    </div>
                ))}
            </div>

            {/* QR Modal */}
            {selectedExercise && (
                <div className="modal-overlay" onClick={() => setSelectedExercise(null)}>
                    <div className="modal-content card" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedExercise(null)}>✕</button>
                        <h2>{selectedExercise.nombre}</h2>
                        <div className="qr-display">
                            <QRCode value={selectedExercise.qr_code} size={250} />
                        </div>
                        <p className="qr-instructions">
                            Escanea este código con la app móvil para completar el ejercicio
                        </p>
                        <div className="points-badge">
                            <span>+{selectedExercise.puntos} puntos</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EjerciciosView;
