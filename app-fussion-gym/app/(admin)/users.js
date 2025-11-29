import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function UsersManagement() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await api.get('/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error loading users:', error);
            alert('Error al cargar usuarios');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadUsers();
    };

    const getMembershipStatus = (createdAt) => {
        const createdDate = new Date(createdAt);
        const membershipEnd = new Date(createdDate);
        membershipEnd.setMonth(membershipEnd.getMonth() + 1);
        const now = new Date();
        return now <= membershipEnd;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const renderUserCard = ({ item: user }) => {
        const isActive = getMembershipStatus(user.createdAt);

        return (
            <View style={styles.userCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.userName}>{user.nombre_completo}</Text>
                    <View style={[styles.membershipBadge, isActive ? styles.activeBadge : styles.expiredBadge]}>
                        <Text style={styles.membershipText}>{isActive ? 'Activa' : 'Vencida'}</Text>
                    </View>
                </View>

                <View style={styles.infoGrid}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>DNI</Text>
                            <Text style={styles.infoValue}>{user.dni}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Edad</Text>
                            <Text style={styles.infoValue}>{user.edad} años</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItemFull}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={[styles.infoValue, styles.smallText]} numberOfLines={1}>
                                {user.email}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Teléfono</Text>
                            <Text style={styles.infoValue}>{user.telefono || '-'}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Puntos</Text>
                            <Text style={[styles.infoValue, styles.pointsValue]}>{user.puntos}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Fecha Creación</Text>
                            <Text style={styles.infoValue}>{formatDate(user.createdAt)}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Membresía</Text>
                            <Text style={styles.infoValue}>1 mes</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D8CFF" />
                <Text style={styles.loadingText}>Cargando usuarios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Gestión de Usuarios</Text>
                <Text style={styles.subtitle}>Total: {users.length} usuarios</Text>
            </View>

            <FlatList
                data={users}
                renderItem={renderUserCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#1D8CFF"
                        colors={['#1D8CFF']}
                    />
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
        marginBottom: 16,
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
        marginBottom: 4,
    },
    subtitle: {
        color: '#B0B8C1',
        fontSize: 14,
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    userCard: {
        backgroundColor: '#1A2332',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2A3544',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A3544',
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    membershipBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    activeBadge: {
        backgroundColor: 'rgba(55, 214, 122, 0.2)',
    },
    expiredBadge: {
        backgroundColor: 'rgba(255, 165, 2, 0.2)',
    },
    membershipText: {
        color: '#37D67A',
        fontSize: 12,
        fontWeight: '600',
    },
    infoGrid: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 12,
    },
    infoItem: {
        flex: 1,
    },
    infoItemFull: {
        flex: 1,
    },
    infoLabel: {
        color: '#B0B8C1',
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    },
    smallText: {
        fontSize: 13,
    },
    pointsValue: {
        color: '#37D67A',
        fontWeight: 'bold',
    },
});
