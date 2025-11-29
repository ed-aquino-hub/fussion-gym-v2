import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRewards } from '../../services/api';
import api from '../../services/api';

export default function Rewards() {
    const [rewards, setRewards] = useState([]);
    const [userPoints, setUserPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState(null);

    useEffect(() => {
        loadRewards();
    }, []);

    const loadRewards = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('user');
            const user = JSON.parse(userData);

            // Get fresh user data from API to have current points
            const userResponse = await fetch(`http://10.219.126.3:3307/api/users/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const currentUser = await userResponse.json();

            setUserPoints(currentUser.puntos || 0);
            console.log('Puntos del usuario:', currentUser.puntos); // Debug

            const rewardsData = await getRewards(token);
            setRewards(rewardsData);
        } catch (error) {
            console.error('Error loading rewards:', error);
        } finally {
            setLoading(false);
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
                            loadRewards(); // Reload to update points and rewards
                        } catch (error) {
                            console.error('Error redeeming:', error);
                            Alert.alert('Error', error.response?.data?.error || 'No se pudo canjear el premio');
                        } finally {
                            setRedeeming(null);
                        }
                    }
                }
            ]
        );
    };

    const renderReward = ({ item }) => {
        const canAfford = userPoints >= item.puntos_necesarios;
        const hasStock = item.stock > 0;
        const canRedeem = canAfford && hasStock;
        const emoji = item.nombre.match(/[^ ]+/)?.[0] || '🎁';

        return (
            <View style={styles.rewardCard}>
                <Text style={styles.rewardEmoji}>{emoji}</Text>
                <View style={styles.rewardInfo}>
                    <Text style={styles.rewardName}>{item.nombre.replace(/^[^ ]+ /, '')}</Text>
                    <Text style={styles.rewardDescription}>{item.descripcion}</Text>
                    <View style={styles.rewardMeta}>
                        <Text style={styles.rewardPoints}>{item.puntos_necesarios} pts</Text>
                        <Text style={styles.rewardStock}>Stock: {item.stock}</Text>
                    </View>

                    {/* Redeem Button */}
                    <TouchableOpacity
                        style={[
                            styles.redeemButton,
                            canRedeem ? styles.redeemButtonActive : styles.redeemButtonDisabled
                        ]}
                        disabled={!canRedeem || redeeming === item.id}
                        onPress={() => handleRedeem(item)}
                    >
                        {redeeming === item.id ? (
                            <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                            <Text style={styles.redeemButtonText}>
                                {!hasStock ? '❌ Sin Stock' : !canAfford ? '💰 Insuficiente' : '✓ Canjear'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={[
                    styles.statusBadge,
                    !hasStock && styles.noStock,
                    !canAfford && hasStock && styles.insufficient
                ]}>
                    <Text style={styles.statusText}>
                        {!hasStock ? 'Sin Stock' : !canAfford ? 'Insuficiente' : 'Disponible'}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando premios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.pointsBanner}>
                <Text style={styles.pointsLabel}>Tus Puntos Disponibles</Text>
                <Text style={styles.pointsValue}>{userPoints}</Text>
            </View>

            <FlatList
                data={rewards}
                keyExtractor={item => item.id.toString()}
                renderItem={renderReward}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1419',
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
    pointsBanner: {
        backgroundColor: '#1A2332',
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#2A3544',
    },
    pointsLabel: {
        color: '#B0B8C1',
        fontSize: 14,
        marginBottom: 8,
    },
    pointsValue: {
        color: '#37D67A',
        fontSize: 36,
        fontWeight: 'bold',
    },
    list: {
        padding: 16,
    },
    rewardCard: {
        backgroundColor: '#1A2332',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#2A3544',
    },
    rewardEmoji: {
        fontSize: 40,
        marginRight: 16,
    },
    rewardInfo: {
        flex: 1,
    },
    rewardName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    rewardDescription: {
        color: '#B0B8C1',
        fontSize: 14,
        marginBottom: 8,
    },
    rewardMeta: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    rewardPoints: {
        color: '#37D67A',
        fontWeight: 'bold',
        fontSize: 14,
    },
    rewardStock: {
        color: '#B0B8C1',
        fontSize: 14,
    },
    redeemButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 4,
    },
    redeemButtonActive: {
        backgroundColor: '#37D67A',
    },
    redeemButtonDisabled: {
        backgroundColor: '#4A5568',
    },
    redeemButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusBadge: {
        backgroundColor: '#37D67A',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 8,
    },
    noStock: {
        backgroundColor: '#FF4757',
    },
    insufficient: {
        backgroundColor: '#7A8A99',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
});
