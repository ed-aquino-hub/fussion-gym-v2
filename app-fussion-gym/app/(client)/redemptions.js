import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRedemptions } from '../../services/api';

export default function Redemptions() {
    const [redemptions, setRedemptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRedemptions();
    }, []);

    const loadRedemptions = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const data = await getRedemptions(token);
            setRedemptions(data);
        } catch (error) {
            console.error('Error loading redemptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderRedemption = ({ item }) => {
        const emoji = item.premio_nombre.match(/[^ ]+/)?.[0] || '🎁';
        const date = new Date(item.fecha_reclamo).toLocaleDateString();

        return (
            <View style={styles.redemptionCard}>
                <Text style={styles.emoji}>{emoji}</Text>
                <View style={styles.info}>
                    <Text style={styles.name}>{item.premio_nombre.replace(/^[^ ]+ /, '')}</Text>
                    <Text style={styles.date}>{date} • {item.puntos_necesarios} pts</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>✓</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    if (redemptions.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🎁</Text>
                <Text style={styles.emptyTitle}>Sin canjes</Text>
                <Text style={styles.emptyText}>
                    Aún no has canjeado ningún premio{'\n'}¡Sigue entrenando para acumular puntos!
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={redemptions}
                keyExtractor={item => item.id.toString()}
                renderItem={renderRedemption}
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
    list: {
        padding: 16,
    },
    redemptionCard: {
        backgroundColor: '#1A2332',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A3544',
    },
    emoji: {
        fontSize: 32,
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    name: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    date: {
        color: '#B0B8C1',
        fontSize: 14,
    },
    badge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#37D67A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: '#0F1419',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyEmoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    emptyTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    emptyText: {
        color: '#B0B8C1',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
});
