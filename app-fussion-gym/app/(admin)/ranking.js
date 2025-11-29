import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function RankingScreen() {
    const router = useRouter();
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadRanking();
    }, []);

    const loadRanking = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await api.get('/ranking?limit=50', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRanking(response.data);
        } catch (error) {
            console.error('Error loading ranking:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getMedalEmoji = (position) => {
        switch (position) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return null;
        }
    };

    const renderRankingItem = ({ item }) => {
        const medal = getMedalEmoji(item.posicion);
        const isTopThree = item.posicion <= 3;

        return (
            <View style={[
                styles.rankingCard,
                isTopThree && styles.topThreeCard
            ]}>
                <View style={styles.positionContainer}>
                    {medal ? (
                        <Text style={styles.medalEmoji}>{medal}</Text>
                    ) : (
                        <View style={styles.positionBadge}>
                            <Text style={styles.positionText}>{item.posicion}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.userInfoContainer}>
                    <Text style={[
                        styles.userName,
                        isTopThree && styles.topThreeName
                    ]}>
                        {item.nombre_completo}
                    </Text>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statLabel}>Ejercicios</Text>
                            <Text style={styles.statValue}>{item.ejercicios_completados || 0}</Text>
                        </View>
                    </View>
                </View>

                <View style={[
                    styles.pointsContainer,
                    isTopThree && styles.topThreePoints
                ]}>
                    <Text style={styles.pointsValue}>{item.puntos}</Text>
                    <Text style={styles.pointsLabel}>pts</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D8CFF" />
                <Text style={styles.loadingText}>Cargando ranking...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Ranking de Usuarios</Text>
                <Text style={styles.subtitle}>Top {ranking.length} clientes por puntos</Text>
            </View>

            <FlatList
                data={ranking}
                renderItem={renderRankingItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            loadRanking();
                        }}
                        tintColor="#1D8CFF"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>📊</Text>
                        <Text style={styles.emptyText}>No hay usuarios en el ranking</Text>
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
    rankingCard: {
        backgroundColor: '#1A2332',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A3544',
    },
    topThreeCard: {
        borderColor: '#FFD700',
        borderWidth: 2,
        backgroundColor: 'rgba(255, 215, 0, 0.05)',
    },
    positionContainer: {
        width: 50,
        alignItems: 'center',
        marginRight: 12,
    },
    medalEmoji: {
        fontSize: 36,
    },
    positionBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A3544',
        justifyContent: 'center',
        alignItems: 'center',
    },
    positionText: {
        color: '#B0B8C1',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userInfoContainer: {
        flex: 1,
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    topThreeName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
    },
    stat: {
        marginRight: 16,
    },
    statLabel: {
        color: '#B0B8C1',
        fontSize: 11,
        marginBottom: 2,
    },
    statValue: {
        color: '#1D8CFF',
        fontSize: 14,
        fontWeight: '600',
    },
    pointsContainer: {
        backgroundColor: 'rgba(55, 214, 122, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(55, 214, 122, 0.3)',
        minWidth: 80,
    },
    topThreePoints: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    pointsValue: {
        color: '#37D67A',
        fontSize: 22,
        fontWeight: 'bold',
    },
    pointsLabel: {
        color: '#37D67A',
        fontSize: 10,
        marginTop: 2,
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
