import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboard() {
    const router = useRouter();

    const handleLogout = async () => {
        await AsyncStorage.clear();
        router.replace('/(auth)/login');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
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

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => router.push('/(admin)/users')}
                >
                    <Text style={styles.actionEmoji}>👥</Text>
                    <Text style={styles.actionTitle}>Gestión de Usuarios</Text>
                    <Text style={styles.actionDescription}>
                        Ver y gestionar todos los usuarios del gimnasio
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => router.push('/(admin)/gestion-premios')}
                >
                    <Text style={styles.actionEmoji}>🎁</Text>
                    <Text style={styles.actionTitle}>Gestión de Premios</Text>
                    <Text style={styles.actionDescription}>
                        Ver, editar y administrar premios del sistema
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => router.push('/(admin)/canjes')}
                >
                    <Text style={styles.actionEmoji}>🎟️</Text>
                    <Text style={styles.actionTitle}>Historial de Canjes</Text>
                    <Text style={styles.actionDescription}>
                        Ver todos los canjes realizados por los usuarios
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => router.push('/(admin)/ranking')}
                >
                    <Text style={styles.actionEmoji}>🏆</Text>
                    <Text style={styles.actionTitle}>Ranking de Usuarios</Text>
                    <Text style={styles.actionDescription}>
                        Ver el ranking de usuarios por puntos acumulados
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1419',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
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
        gap: 16,
        marginBottom: 20,
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
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
