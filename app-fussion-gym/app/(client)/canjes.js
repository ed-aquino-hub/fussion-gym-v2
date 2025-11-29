import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function CanjesScreen() {
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

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.emoji}>{item.premio_nombre.match(/[^ ]+/)}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Canjeado</Text>
                    </View>
                </View>

                <Text style={styles.rewardName}>
                    {item.premio_nombre.replace(/^[^ ]+ /, '')}
                </Text>
                <Text style={styles.description}>{item.premio_descripcion}</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Puntos gastados:</Text>
                    <Text style={styles.pointsValue}>{item.puntos_necesarios}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Fecha de canje:</Text>
                    <Text style={styles.dateValue}>{formattedDate}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D8CFF" />
                <Text style={styles.loadingText}>Cargando historial...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={redemptions}
                renderItem={renderRedemption}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); loadRedemptions(); }}
                        tintColor="#1D8CFF"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>🎁</Text>
                        <Text style={styles.emptyTitle}>No has canjeado premios</Text>
                        <Text style={styles.emptyText}>
                            Cuando canjees premios aparecerán aquí
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1419'
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0F1419',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        color: '#B0B8C1',
        marginTop: 16,
        fontSize: 16
    },
    listContent: {
        padding: 16
    },
    card: {
        backgroundColor: '#1A2332',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2A3544'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12
    },
    emoji: {
        fontSize: 48
    },
    badge: {
        backgroundColor: 'rgba(55, 214, 122, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8
    },
    badgeText: {
        color: '#37D67A',
        fontSize: 12,
        fontWeight: '600'
    },
    rewardName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6
    },
    description: {
        color: '#B0B8C1',
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    label: {
        color: '#B0B8C1',
        fontSize: 14
    },
    pointsValue: {
        color: '#37D67A',
        fontSize: 16,
        fontWeight: 'bold'
    },
    dateValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500'
    },
    emptyContainer: {
        padding: 60,
        alignItems: 'center'
    },
    emptyEmoji: {
        fontSize: 80,
        marginBottom: 16,
        opacity: 0.5
    },
    emptyTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8
    },
    emptyText: {
        color: '#B0B8C1',
        fontSize: 14,
        textAlign: 'center'
    }
});
