import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboard() {
    const router = useRouter();

    const handleLogout = async () => {
        await AsyncStorage.clear();
        router.replace('/(auth)/login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Panel Administrativo</Text>
                <Text style={styles.subtitle}>FUSSION GYM</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => router.push('/(admin)/scanner')}
                >
                    <Text style={styles.actionEmoji}>📷</Text>
                    <Text style={styles.actionTitle}>Registrar Asistencia</Text>
                    <Text style={styles.actionDescription}>
                        Escanea el QR del cliente para registrar asistencia
                    </Text>
                </TouchableOpacity>

                <View style={styles.actionCard}>
                    <Text style={styles.actionEmoji}>👥</Text>
                    <Text style={styles.actionTitle}>Gestión de Usuarios</Text>
                    <Text style={styles.actionDescription}>
                        Usar el panel web para gestionar usuarios
                    </Text>
                </View>

                <View style={styles.actionCard}>
                    <Text style={styles.actionEmoji}>🎁</Text>
                    <Text style={styles.actionTitle}>Gestión de Premios</Text>
                    <Text style={styles.actionDescription}>
                        Usar el panel web para gestionar premios y canjes
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1419',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginVertical: 40,
    },
    title: {
        color: '#1D8CFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#B0B8C1',
        fontSize: 16,
    },
    actions: {
        flex: 1,
        gap: 16,
    },
    actionCard: {
        backgroundColor: '#1A2332',
        borderRadius: 16,
        padding: 24,
        borderWidth: 2,
        borderColor: '#2A3544',
    },
    actionEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    actionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    actionDescription: {
        color: '#B0B8C1',
        fontSize: 14,
        lineHeight: 20,
    },
    logoutButton: {
        backgroundColor: '#FF4757',
        borderRadius: 25,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
