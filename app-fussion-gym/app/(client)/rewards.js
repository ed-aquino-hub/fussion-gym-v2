import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRewards } from '../../services/api';

export default function Rewards() {
    const [rewards, setRewards] = useState([]);
    const [userPoints, setUserPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRewards();
    }, []);

    const loadRewards = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('user');
            const user = JSON.parse(userData);
            setUserPoints(user.puntos_totales || 0);


            const rewardsData = await getRewards(token);
            setRewards(rewardsData);
        } catch (error) {
            console.error('Error loading rewards:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderReward = ({ item }) => {
        const canAfford = userPoints >= item.puntos_necesarios;
        const hasStock = item.stock > 0;
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
        alignItems: 'center',
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
    statusBadge: {
        backgroundColor: '#37D67A',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    noStock: {
        backgroundColor: '#FF4757',
    },
    insufficient: {
        backgroundColor: '#7A8A99',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
