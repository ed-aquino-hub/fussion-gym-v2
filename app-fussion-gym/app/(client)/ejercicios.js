import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getExercises } from '../../services/api';

export default function EjerciciosScreen() {
    const router = useRouter();
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const data = await getExercises(token);
            setExercises(data);
        } catch (error) {
            console.error('Error loading exercises:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
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

    const renderExercise = ({ item }) => {
        const difficultyColor = getDifficultyColor(item.dificultad);

        return (
            <TouchableOpacity
                style={styles.exerciseCard}
                onPress={() => router.push({
                    pathname: '/(client)/ejercicio-detalle',
                    params: { exerciseId: item.id }
                })}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.exerciseName}>{item.nombre}</Text>
                        <Text style={styles.categoryBadge}>📂 {item.categoria_nombre}</Text>
                    </View>
                    {item.dificultad && (
                        <View style={[styles.difficultyBadge, { backgroundColor: `${difficultyColor}22`, borderColor: difficultyColor }]}>
                            <Text style={[styles.difficultyText, { color: difficultyColor }]}>
                                {item.dificultad}
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={styles.description} numberOfLines={3}>
                    {item.descripcion}
                </Text>

                <View style={styles.cardFooter}>
                    <View style={styles.pointsInfo}>
                        <Text style={styles.pointsLabel}>Recompensa</Text>
                        <Text style={styles.pointsValue}>+{item.puntos} pts</Text>
                    </View>
                    <TouchableOpacity style={styles.viewButton}>
                        <Text style={styles.viewButtonText}>Ver Ejercicio →</Text>
                    </TouchableOpacity>
                </View>

                {item.qr_code && (
                    <View style={styles.qrIndicator}>
                        <Text style={styles.qrText}>📱 QR</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D8CFF" />
                <Text style={styles.loadingText}>Cargando ejercicios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Catálogo de Ejercicios</Text>
                <Text style={styles.subtitle}>Completa ejercicios y gana puntos</Text>
            </View>

            <FlatList
                data={exercises}
                renderItem={renderExercise}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            loadExercises();
                        }}
                        tintColor="#1D8CFF"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>🏋️</Text>
                        <Text style={styles.emptyText}>No hay ejercicios disponibles</Text>
                    </View>
                }
            />
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
        color: '#1D8CFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#B0B8C1',
        fontSize: 14,
    },
    listContent: {
        padding: 16,
    },
    exerciseCard: {
        backgroundColor: '#1A2332',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2A3544',
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
        marginRight: 12,
    },
    exerciseName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    categoryBadge: {
        color: '#B0B8C1',
        fontSize: 12,
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
    description: {
        color: '#B0B8C1',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pointsInfo: {
        flex: 1,
    },
    pointsLabel: {
        color: '#B0B8C1',
        fontSize: 11,
        marginBottom: 2,
    },
    pointsValue: {
        color: '#37D67A',
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewButton: {
        backgroundColor: '#1D8CFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    viewButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    qrIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(29, 140, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(29, 140, 255, 0.3)',
    },
    qrText: {
        fontSize: 10,
    },
    emptyContainer: {
        padding: 60,
        alignItems: 'center',
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        color: '#B0B8C1',
        fontSize: 16,
        textAlign: 'center',
    },
});
