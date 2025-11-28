import { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scanExerciseQR } from '../../services/api';

export default function Scanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Solicitando permiso para la cámara...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>No hay acceso a la cámara</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Permitir Acceso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);

        try {
            const token = await AsyncStorage.getItem('token');
            const result = await scanExerciseQR(token, data);

            Alert.alert(
                '¡Ejercicio Completado!',
                `${result.ejercicio}\n+${result.puntos_ganados} puntos\nTotal: ${result.puntos_totales} puntos`,
                [{ text: 'OK', onPress: () => setScanned(false) }]
            );
        } catch (error) {
            Alert.alert(
                'Error',
                error.response?.data?.error || 'No se pudo registrar el ejercicio',
                [{ text: 'OK', onPress: () => setScanned(false) }]
            );
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            />

            <View style={styles.overlay}>
                <View style={styles.scanFrame}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </View>

                <Text style={styles.instructionText}>
                    Apunta al código QR del ejercicio
                </Text>

                {scanned && (
                    <TouchableOpacity
                        style={styles.scanAgainButton}
                        onPress={() => setScanned(false)}
                    >
                        <Text style={styles.scanAgainText}>Escanear Nuevamente</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1419',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1D8CFF',
        padding: 16,
        borderRadius: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#1D8CFF',
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 10,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 10,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 10,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 10,
    },
    instructionText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginTop: 300,
        fontWeight: '600',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 16,
        borderRadius: 12,
    },
    scanAgainButton: {
        backgroundColor: '#1D8CFF',
        padding: 16,
        borderRadius: 25,
        marginTop: 20,
        paddingHorizontal: 40,
    },
    scanAgainText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
