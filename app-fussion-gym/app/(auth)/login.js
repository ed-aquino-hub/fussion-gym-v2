import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../services/api';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        setLoading(true);
        try {
            const data = await login(email, password);

            // Store token and user data
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));

            // Navigate based on role
            if (data.user.rol === 'Administrador') {
                router.replace('/(admin)/dashboard');
            } else {
                router.replace('/(client)/profile');
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>💪</Text>
                <Text style={styles.title}>FUSSION GYM</Text>
                <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#7A8A99"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#7A8A99"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.demoCredentials}>
                    <Text style={styles.demoTitle}>Credenciales de prueba:</Text>
                    <Text style={styles.demoText}>Admin: admin@fussiongym.com / admin123</Text>
                    <Text style={styles.demoText}>Cliente: juan@email.com / password123</Text>
                </View>
            </View>
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
        marginTop: 60,
        marginBottom: 40,
    },
    logo: {
        fontSize: 60,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1D8CFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#B0B8C1',
    },
    form: {
        width: '100%',
    },
    input: {
        backgroundColor: '#1A2332',
        borderWidth: 2,
        borderColor: '#2A3544',
        borderRadius: 12,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#1D8CFF',
        borderRadius: 25,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    demoCredentials: {
        marginTop: 30,
        padding: 16,
        backgroundColor: 'rgba(29, 140, 255, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1D8CFF',
    },
    demoTitle: {
        color: '#1D8CFF',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    demoText: {
        color: '#B0B8C1',
        fontSize: 12,
        marginBottom: 4,
    },
});
