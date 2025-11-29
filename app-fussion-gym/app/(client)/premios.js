import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function PremiosScreen() {
    const router = useRouter();
    const [rewards, setRewards] = useState([]);
    const [userPoints, setUserPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [redeeming, setRedeeming] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');

            if (!userStr) {
                Alert.alert('Error', 'No se pudo obtener información del usuario');
                return;
            }

            const user = JSON.parse(userStr);
            const userId = user.id;

            const [rewardsRes, userRes] = await Promise.all([
                api.get('/rewards', { headers: { Authorization: `Bearer ${token}` } }),
                api.get(`/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setRewards(rewardsRes.data);
            setUserPoints(userRes.data.puntos || 0);

            console.log('Puntos del usuario:', userRes.data.puntos); // Debug
        } catch (error) {
            console.error('Error loading data:', error);
            Alert.alert('Error', 'No se pudieron cargar los premios');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRedeem = async (reward) => {
        Alert.alert(
            '¿Canjear Premio?',
            `¿Quieres canjear "${reward.nombre.replace(/^[^ ]+ /, '')}" por ${reward.puntos_necesarios} puntos?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sí, Canjear',
                    onPress: async () => {
                        setRedeeming(reward.id);
                        try {
                            const token = await AsyncStorage.getItem('token');
                            await api.post('/rewards/redeem',
                                { premioId: reward.id },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            Alert.alert('¡Éxito!', `Premio "${reward.nombre.replace(/^[^ ]+ /, '')}" canjeado exitosamente`);
                            loadData();
                        } catch (error) {
                            Alert.alert('Error', error.response?.data?.error || 'No se pudo canjear el premio');
                        } finally {
                            setRedeeming(null);
                        }
                    }
                }
            ]
        );
    };

    const renderReward = ({ item: reward }) => {
        const canAfford = userPoints >= reward.puntos_necesarios;
        const hasStock = reward.stock > 0;
        const pointsProgress = Math.min((userPoints / reward.puntos_necesarios) * 100, 100);
        const pointsNeeded = reward.puntos_necesarios - userPoints;

        return (
            <View style={[
                styles.rewardCard,
                canAfford && hasStock && styles.rewardAvailable,
                !hasStock && styles.rewardOutOfStock
            ]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.rewardEmoji}>{reward.nombre.match(/[^ ]+/)}</Text>
                    {canAfford && hasStock && (
                        <View style={styles.badgeAvailable}>
                            <Text style={styles.badgeText}>✓ Disponible</Text>
                        </View>
                    )}
                    {!hasStock && (
                        <View style={styles.badgeOutOfStock}>
                            <Text style={styles.badgeText}>Sin Stock</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.rewardName}>
                    {reward.nombre.replace(/^[^ ]+ /, '')}
                </Text>
                <Text style={styles.rewardDescription}>{reward.descripcion}</Text>

                <View style={styles.pointsContainer}>
                    <View style={styles.pointsRow}>
                        <Text style={styles.label}>Puntos necesarios:</Text>
                        <Text style={[styles.pointsValue, canAfford ? styles.pointsAfford : styles.pointsInsufficient]}>
                            {reward.puntos_necesarios}
                        </Text>
                    </View>

                    {!canAfford && (
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${pointsProgress}%` }]} />
                            </View>
                            <Text style={styles.progressText}>Te faltan {pointsNeeded} puntos</Text>
                        </View>
                    )}

                    <View style={styles.stockRow}>
                        <Text style={styles.label}>Stock: </Text>
                        <Text style={[styles.stockValue, !hasStock && styles.stockEmpty]}>
                            {reward.stock}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.redeemButton,
                        canAfford && hasStock ? styles.buttonAvailable : styles.buttonDisabled
                    ]}
                    disabled={!canAfford || !hasStock || redeeming === reward.id}
                    onPress={() => handleRedeem(reward)}
                >
                    {redeeming === reward.id ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {!hasStock ? '❌ Sin Stock' : !canAfford ? '💰 Puntos Insuficientes' : '✓ Canjear Ahora'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D8CFF" />
                <Text style={styles.loadingText}>Cargando premios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Catálogo de Premios</Text>
            </View>

            <View style={styles.pointsBanner}>
                <Text style={styles.pointsLabel}>Tus puntos disponibles</Text>
                <Text style={styles.pointsDisplay}>{userPoints}</Text>
            </View>

            <FlatList
                data={rewards}
                renderItem={renderReward}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor="#1D8CFF" />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No hay premios disponibles</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1419' },
    loadingContainer: { flex: 1, backgroundColor: '#0F1419', justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#B0B8C1', marginTop: 16, fontSize: 16 },
    header: { padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#2A3544' },
    backButton: { marginBottom: 12 },
    backButtonText: { color: '#1D8CFF', fontSize: 16, fontWeight: '600' },
    title: { color: '#1D8CFF', fontSize: 28, fontWeight: 'bold' },
    pointsBanner: {
        margin: 16,
        padding: 20,
        backgroundColor: 'rgba(29, 140, 255, 0.1)',
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(29, 140, 255, 0.3)'
    },
    pointsLabel: { color: '#B0B8C1', fontSize: 14, marginBottom: 8 },
    pointsDisplay: { color: '#37D67A', fontSize: 48, fontWeight: 'bold' },
    listContent: { padding: 16 },
    rewardCard: {
        backgroundColor: '#1A2332',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2A3544'
    },
    rewardAvailable: { borderColor: '#37D67A', borderWidth: 2 },
    rewardOutOfStock: { opacity: 0.6 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    rewardEmoji: { fontSize: 56 },
    badgeAvailable: { backgroundColor: 'rgba(55, 214, 122, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeOutOfStock: { backgroundColor: 'rgba(255, 165, 2, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { color: '#37D67A', fontSize: 11, fontWeight: '600' },
    rewardName: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    rewardDescription: { color: '#B0B8C1', fontSize: 14, marginBottom: 16, lineHeight: 20 },
    pointsContainer: { marginBottom: 16 },
    pointsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    label: { color: '#B0B8C1', fontSize: 14 },
    pointsValue: { fontSize: 16, fontWeight: 'bold' },
    pointsAfford: { color: '#37D67A' },
    pointsInsufficient: { color: '#FFA502' },
    progressContainer: { marginTop: 8, marginBottom: 12 },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: '#2A3544',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 6
    },
    progressFill: { height: '100%', backgroundColor: '#1D8CFF' },
    progressText: { color: '#FFA502', fontSize: 12 },
    stockRow: { flexDirection: 'row', marginTop: 4 },
    stockValue: { color: '#FFFFFF', fontWeight: '600' },
    stockEmpty: { color: '#FF4757' },
    redeemButton: {
        padding: 14,
        borderRadius: 12,
        alignItems: 'center'
    },
    buttonAvailable: { backgroundColor: '#37D67A' },
    buttonDisabled: { backgroundColor: '#2A3544' },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#B0B8C1', fontSize: 16 }
});
