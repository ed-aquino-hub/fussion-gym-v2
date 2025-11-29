import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import api, { completeExercise } from '../../services/api';

export default function EjercicioDetalleScreen() {
    const router = useRouter();
    const { exerciseId } = useLocalSearchParams();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        loadExercise();
    }, []);

    const loadExercise = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await api.get('/exercises', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const exerciseData = response.data.find(ex => ex.id === parseInt(exerciseId));
            setExercise(exerciseData);
        } catch (error) {
            console.error('Error loading exercise:', error);
            Alert.alert('Error', 'No se pudo cargar el ejercicio');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteExercise = async () => {
        Alert.alert(
            '¿Completar Rutina?',
            `¿Has completado el ejercicio "${exercise.nombre}"? Ganarás ${exercise.puntos} puntos.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sí, Completar',
                    onPress: async () => {
                        setCompleting(true);
                        try {
                            const token = await AsyncStorage.getItem('token');
                            const result = await completeExercise(token, exercise.id);
                            Alert.alert(
                                '¡Éxito!',
                                `${result.message}\n\nPuntos ganados: +${result.puntos_ganados}\nPuntos totales: ${result.puntos_totales}`,
                                [{ text: 'OK', onPress: () => router.back() }]
                            );
                        } catch (error) {
                            const errorMsg = error.response?.data?.error || 'No se pudo completar el ejercicio';
                            Alert.alert('Error', errorMsg);
                        } finally {
                            setCompleting(false);
                        }
                    }
                }
            ]
        );
    };

    const getDifficultyColor = (dificultad) => {
        switch (dificultad?.toLowerCase()) {
            case 'fácil':
            case 'facil':
                return '#37D67A';
            case 'intermedio':
                return '#FFA502';
            case 'difícil':
            case 'dificil':
                return '#FF4757';
            default:
                return '#1D8CFF';
        }
    };

    // Get YouTube embed URL from video_url
    const getEmbedUrl = (url) => {
        if (!url) return null;
        // If it's already an embed URL, return it
        if (url.includes('youtube.com/embed/')) return url;
        // If it's a regular YouTube URL, convert it
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        return url;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D8CFF" />
                <Text style={styles.loadingText}>Cargando ejercicio...</Text>
            </View>
        );
    }

    if (!exercise) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Ejercicio no encontrado</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButtonError}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const difficultyColor = getDifficultyColor(exercise.dificultad);
    const embedUrl = getEmbedUrl(exercise.video_url) || 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Placeholder

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{exercise.nombre}</Text>
                <View style={styles.headerMeta}>
                    <Text style={styles.category}>📂 {exercise.categoria_nombre}</Text>
                    {exercise.dificultad && (
                        <View style={[styles.difficultyBadge, { backgroundColor: `${difficultyColor}22`, borderColor: difficultyColor }]}>
                            <Text style={[styles.difficultyText, { color: difficultyColor }]}>{exercise.dificultad}</Text>
                        </View>
                    )}
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Video Tutorial */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📹 Video Tutorial</Text>
                    <View style={styles.videoContainer}>
                        <WebView
                            source={{ uri: embedUrl }}
                            style={styles.video}
                            allowsFullscreenVideo={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                        />
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📝 Descripción</Text>
                    <Text style={styles.description}>{exercise.descripcion}</Text>
                </View>

                {/* QR Code Simulation */}
                {exercise.qr_code && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📱 Código QR</Text>
                        <View style={styles.qrCodeContainer}>
                            <View style={styles.qrCodePlaceholder}>
                                <Text style={styles.qrCodeText}>QR</Text>
                                <Text style={styles.qrCodeValue}>{exercise.qr_code}</Text>
                            </View>
                            <Text style={styles.qrHint}>
                                Escanea este QR en el gimnasio para completar el ejercicio
                            </Text>
                        </View>
                    </View>
                )}

                {/* Instructor & Schedule Info */}
                {(exercise.instructor || exercise.horario) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ℹ️ Información Adicional</Text>
                        {exercise.instructor && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Instructor:</Text>
                                <Text style={styles.infoValue}>{exercise.instructor}</Text>
                            </View>
                        )}
                        {exercise.horario && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Horario:</Text>
                                <Text style={styles.infoValue}>{exercise.horario}</Text>
                            </View>
                        )}
                        {exercise.capacidad_maxima && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Capacidad:</Text>
                                <Text style={styles.infoValue}>
                                    {exercise.cupos_actuales || 0} / {exercise.capacidad_maxima}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Points Reward */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎁 Recompensa</Text>
                    <View style={styles.rewardBox}>
                        <Text style={styles.rewardText}>
                            Al completar esta rutina ganarás
                        </Text>
                        <Text style={styles.pointsReward}>+{exercise.puntos} puntos</Text>
                    </View>
                </View>

                {/* Complete Button */}
                <TouchableOpacity
                    style={[styles.completeButton, completing && styles.completeButtonDisabled]}
                    onPress={handleCompleteExercise}
                    disabled={completing}
                >
                    {completing ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.completeButtonText}>✓ Completar Rutina</Text>
                    )}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1419',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0F1419',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#B0B8C1',
        marginTop: 16,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#0F1419',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#FF4757',
        fontSize: 18,
        marginBottom: 20,
    },
    backButtonError: {
        backgroundColor: '#1D8CFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#2A3544',
    },
    backButton: {
        marginBottom: 12,
    },
    backButtonText: {
        color: '#1D8CFF',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    headerMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    category: {
        color: '#B0B8C1',
        fontSize: 14,
    },
    difficultyBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    difficultyText: {
        fontSize: 11,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2A3544',
    },
    sectionTitle: {
        color: '#1D8CFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    videoContainer: {
        height: 220,
        backgroundColor: '#000',
        borderRadius: 12,
        overflow: 'hidden',
    },
    video: {
        flex: 1,
    },
    description: {
        color: '#B0B8C1',
        fontSize: 15,
        lineHeight: 24,
    },
    qrCodeContainer: {
        alignItems: 'center',
    },
    qrCodePlaceholder: {
        width: 180,
        height: 180,
        backgroundColor: '#1A2332',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#1D8CFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    qrCodeText: {
        color: '#1D8CFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    qrCodeValue: {
        color: '#B0B8C1',
        fontSize: 10,
        fontFamily: 'monospace',
    },
    qrHint: {
        color: '#B0B8C1',
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        color: '#B0B8C1',
        fontSize: 14,
        width: 100,
    },
    infoValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    rewardBox: {
        backgroundColor: 'rgba(55, 214, 122, 0.1)',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(55, 214, 122, 0.3)',
    },
    rewardText: {
        color: '#B0B8C1',
        fontSize: 14,
        marginBottom: 8,
    },
    pointsReward: {
        color: '#37D67A',
        fontSize: 32,
        fontWeight: 'bold',
    },
    completeButton: {
        backgroundColor: '#37D67A',
        marginHorizontal: 20,
        marginTop: 20,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    completeButtonDisabled: {
        backgroundColor: '#2A3544',
    },
    completeButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
