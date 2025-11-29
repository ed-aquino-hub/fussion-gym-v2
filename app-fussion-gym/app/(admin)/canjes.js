import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function CanjesScreen() {
    const router = useRouter();
    const [redemptions, setRedemptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadRedemptions();
    }, []);

    const loadRedemptions = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await api.get('/rewards/redemptions/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRedemptions(response.data);
        } catch (error) {
            console.error('Error loading redemptions:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const renderRedemption = ({ item }) => {
        const date = new Date(item.fecha_reclamo);
        const formattedDate = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return (
            <View style={styles.redemptionCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{item.nombre_completo}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                    </View>
                    <View style={styles.pointsBadge}>
                        <Text style={styles.pointsText}>{item.puntos_necesarios}</Text>
                        <Text style={styles.pointsLabel}>pts</Text>
                    </View>
                </View>

                <View style={styles.rewardInfo}>
                    <Text style={styles.rewardName}>🎁 {item.premio_nombre}</Text>
                    {item.premio_descripcion && (
                        <Text style={styles.rewardDescription}>{item.premio_descripcion}</Text>
                    )}
                </View>

                <View style={styles.dateInfo}>
                    <Text style={styles.dateText}>📅 {formattedDate}</Text>
                    <Text style={styles.timeText}>🕐 {formattedTime}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D8CFF" />
                <Text style={styles.loadingText}>Cargando canjes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Historial de Canjes</Text>
                <Text style={styles.subtitle}>Total: {redemptions.length} canjes</Text>
            </View>

            <FlatList
                data={redemptions}
                renderItem={renderRedemption}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            loadRedemptions();
                        }}
                        tintColor="#1D8CFF"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>📦</Text>
                        <Text style={styles.emptyText}>No hay canjes registrados</Text>
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
    redemptionCard: {
        backgroundColor: '#1A2332',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2A3544',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        color: '#B0B8C1',
        fontSize: 14,
    },
    pointsBadge: {
        backgroundColor: 'rgba(55, 214, 122, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(55, 214, 122, 0.3)',
    },
    pointsText: {
        color: '#37D67A',
        fontSize: 20,
        fontWeight: 'bold',
    },
    pointsLabel: {
        color: '#37D67A',
        fontSize: 10,
        marginTop: 2,
    },
    rewardInfo: {
        marginBottom: 12,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#2A3544',
    },
    rewardName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    rewardDescription: {
        color: '#B0B8C1',
        fontSize: 14,
        lineHeight: 20,
    },
    dateInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        color: '#B0B8C1',
        fontSize: 13,
    },
    timeText: {
        color: '#B0B8C1',
        fontSize: 13,
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
