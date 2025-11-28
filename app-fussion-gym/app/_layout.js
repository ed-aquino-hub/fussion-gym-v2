import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#0A1A2F',
                    },
                    headerTintColor: '#1D8CFF',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: '#0F1419',
                    },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="(auth)/login"
                    options={{ title: 'Iniciar Sesión' }}
                />
                <Stack.Screen
                    name="(client)/profile"
                    options={{ title: 'Mi Perfil' }}
                />
                <Stack.Screen
                    name="(client)/scanner"
                    options={{ title: 'Escanear QR' }}
                />
                <Stack.Screen
                    name="(client)/rewards"
                    options={{ title: 'Premios' }}
                />
                <Stack.Screen
                    name="(client)/redemptions"
                    options={{ title: 'Mis Canjes' }}
                />
                <Stack.Screen
                    name="(admin)/dashboard"
                    options={{ title: 'Dashboard Admin' }}
                />
                <Stack.Screen
                    name="(admin)/scanner"
                    options={{ title: 'Registrar Asistencia' }}
                />
            </Stack>
        </>
    );
}
