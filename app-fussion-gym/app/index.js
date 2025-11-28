import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to login after a shorxd
        const timer = setTimeout(() => {
            router.replace('/(auth)/login');
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>💪</Text>
            <Text style={styles.title}>FUSSION GYM</Text>
            <ActivityIndicator size="large" color="#1D8CFF" style={{ marginTop: 20 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1A2F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontSize: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1D8CFF',
    },
});
