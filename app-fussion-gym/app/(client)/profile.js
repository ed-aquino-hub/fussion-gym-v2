import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { getUserProfile } from '../../services/api';

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const savedUser = await AsyncStorage.getItem('user');

            if (!savedUser) {
                return handleLogout();
            }

            const userParsed = JSON.parse(savedUser);
            setUser(userParsed);

            const profileData = await getUserProfile(token, userParsed.id);
            setProfile(profileData);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.clear();
        router.replace('/(auth)/login');
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Sesión expirada</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={{ color: '#1D8CFF', marginTop: 20 }}>Volver a iniciar sesión</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>👤</Text>
                </View>
                <Text style={styles.name}>{profile?.nombre_completo}</Text>
                <Text style={styles.email}>{profile?.email}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{profile?.puntos || 0}</Text>
                    <Text style={styles.statLabel}>Puntos</Text>
                </View>
            </View>

            <View style={styles.qrSection}>
                <Text style={styles.sectionTitle}>Mi Código QR</Text>
                <Text style={styles.qrSubtitle}>Presenta este código en recepción</Text>

                <View style={styles.qrContainer}>
                    <QRCode
                        value={`USER-${user.id}`}
                        size={200}
                        color="#000"
                        backgroundColor="#FFF"
                    />
                </View>

                <Text style={styles.userId}>ID: #{user.id}</Text>
            </View>

            {profile?.membresia_nombre && (
                <View style={styles.membershipCard}>
                    <Text style={styles.sectionTitle}>Membresía</Text>

                    <View style={styles.membershipBadge}>
                        <Text style={styles.membershipName}>{profile.membresia_nombre}</Text>
                    </View>
                </View>
            )}

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(client)/scanner')}>
                    <Text style={styles.actionButtonText}>📷 Escanear Ejercicio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(client)/rewards')}>
                    <Text style={styles.actionButtonText}>🎁 Ver Premios</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(client)/redemptions')}>
                    <Text style={styles.actionButtonText}>🎟️ Mis Canjes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
                    <Text style={[styles.actionButtonText, { color: '#FF4757' }]}>🚪 Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    header: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2A3544',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1D8CFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 50,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    email: {
        fontSize: 16,
        color: '#B0B8C1',
    },
    statsContainer: {
        padding: 20,
        alignItems: 'center',
    },
    statBox: {
        backgroundColor: '#1A2332',
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#1D8CFF',
        alignItems: 'center',
        minWidth: 150,
    },
    statValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#37D67A',
    },
    statLabel: {
        fontSize: 14,
        color: '#B0B8C1',
        marginTop: 4,
    },
    qrSection: {
        padding: 20,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    qrSubtitle: {
        fontSize: 14,
        color: '#B0B8C1',
        marginBottom: 20,
    },
    qrContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
    },
    userId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D8CFF',
    },
    membershipCard: {
        padding: 20,
    },
    membershipBadge: {
        backgroundColor: '#37D67A',
        padding: 12,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    membershipName: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    actions: {
        padding: 20,
        gap: 12,
    },
    actionButton: {
        backgroundColor: '#1A2332',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2A3544',
    },
    logoutButton: {
        borderColor: '#FF4757',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
