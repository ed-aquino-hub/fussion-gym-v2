import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function GestionPremios() {
    const router = useRouter();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        puntos_necesarios: '',
        stock: ''
    });

    useEffect(() => {
        loadRewards();
    }, []);

    const loadRewards = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await api.get('/rewards', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRewards(response.data);
        } catch (error) {
            console.error('Error loading rewards:', error);
            Alert.alert('Error', 'No se pudieron cargar los premios');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const openEditModal = (reward) => {
        setSelectedReward(reward);
        setFormData({
            nombre: reward.nombre,
            descripcion: reward.descripcion,
            puntos_necesarios: reward.puntos_necesarios.toString(),
            stock: reward.stock.toString()
        });
        setEditModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!formData.nombre || !formData.puntos_necesarios || !formData.stock) {
            Alert.alert('Error', 'Todos los campos son requeridos');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            await api.put(`/rewards/${selectedReward.id}`,
                {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                    puntos_necesarios: parseInt(formData.puntos_necesarios),
                    stock: parseInt(formData.stock)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Éxito', 'Premio actualizado correctamente');
            setEditModalVisible(false);
            loadRewards();
        } catch (error) {
            console.error('Error updating reward:', error);
            Alert.alert('Error', 'No se pudo actualizar el premio');
        }
    };

    const handleDelete = (reward) => {
        Alert.alert(
            'Confirmar Eliminación',
            `¿Seguro que quieres eliminar "${reward.nombre.replace(/^[^ ]+ /, '')}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            await api.delete(`/rewards/${reward.id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            Alert.alert('Éxito', 'Premio eliminado correctamente');
                            loadRewards();
                        } catch (error) {
                            console.error('Error deleting reward:', error);
                            Alert.alert('Error', 'No se pudo eliminar el premio');
                        }
                    }
                }
            ]
        );
    };

    const renderReward = ({ item: reward }) => {
        const emoji = reward.nombre.match(/[^ ]+/)?.[0] || '🎁';

        return (
            <View style={styles.rewardCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.emoji}>{emoji}</Text>
                    <View style={styles.rewardInfo}>
                        <Text style={styles.rewardName}>{reward.nombre.replace(/^[^ ]+ /, '')}</Text>
                        <Text style={styles.description}>{reward.descripcion}</Text>
                    </View>
                </View>

                <View style={styles.infoGrid}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Puntos:</Text>
                        <Text style={styles.value}>{reward.puntos_necesarios}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Stock:</Text>
                        <Text style={[styles.value, reward.stock < 10 && styles.lowStock]}>
                            {reward.stock}
                        </Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => openEditModal(reward)}
                    >
                        <Text style={styles.actionButtonText}>✏️ Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDelete(reward)}
                    >
                        <Text style={styles.actionButtonText}>🗑️ Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D8CFF" />
                <Text style={styles.loadingText}>Cargando premios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Gestión de Premios</Text>
                <Text style={styles.subtitle}>Total: {rewards.length} premios</Text>
            </View>

            <FlatList
                data={rewards}
                renderItem={renderReward}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); loadRewards(); }}
                        tintColor="#1D8CFF"
                    />
                }
            />

            {/* Edit Modal */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Premio</Text>

                        <Text style={styles.inputLabel}>Nombre (incluye emoji)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.nombre}
                            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                            placeholder="🎁 Nombre del premio"
                            placeholderTextColor="#6B7280"
                        />

                        <Text style={styles.inputLabel}>Descripción</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.descripcion}
                            onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                            placeholder="Descripción del premio"
                            placeholderTextColor="#6B7280"
                            multiline
                            numberOfLines={3}
                        />

                        <Text style={styles.inputLabel}>Puntos Necesarios</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.puntos_necesarios}
                            onChangeText={(text) => setFormData({ ...formData, puntos_necesarios: text })}
                            placeholder="100"
                            placeholderTextColor="#6B7280"
                            keyboardType="numeric"
                        />

                        <Text style={styles.inputLabel}>Stock</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.stock}
                            onChangeText={(text) => setFormData({ ...formData, stock: text })}
                            placeholder="50"
                            placeholderTextColor="#6B7280"
                            keyboardType="numeric"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveEdit}
                            >
                                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1419' },
    loadingContainer: { flex: 1, backgroundColor: '#0F1419', justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#B0B8C1', marginTop: 16, fontSize: 16 },
    header: { padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#2A3544' },
    backButton: { marginBottom: 12 },
    backButtonText: { color: '#1D8CFF', fontSize: 16, fontWeight: '600' },
    title: { color: '#1D8CFF', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { color: '#B0B8C1', fontSize: 14 },
    listContent: { padding: 16 },
    rewardCard: {
        backgroundColor: '#1A2332',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2A3544'
    },
    cardHeader: { flexDirection: 'row', marginBottom: 12 },
    emoji: { fontSize: 40, marginRight: 12 },
    rewardInfo: { flex: 1 },
    rewardName: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    description: { color: '#B0B8C1', fontSize: 14, lineHeight: 20 },
    infoGrid: { marginBottom: 12 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    label: { color: '#B0B8C1', fontSize: 14 },
    value: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
    lowStock: { color: '#FF4757' },
    actions: { flexDirection: 'row', gap: 10 },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    editButton: { backgroundColor: '#1D8CFF' },
    deleteButton: { backgroundColor: '#FF4757' },
    actionButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#1A2332',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400
    },
    modalTitle: {
        color: '#1D8CFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    inputLabel: {
        color: '#B0B8C1',
        fontSize: 14,
        marginBottom: 6,
        marginTop: 12
    },
    input: {
        backgroundColor: '#0F1419',
        borderWidth: 1,
        borderColor: '#2A3544',
        borderRadius: 8,
        padding: 12,
        color: '#FFFFFF',
        fontSize: 16
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top'
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center'
    },
    cancelButton: {
        backgroundColor: '#4A5568',
        borderWidth: 1,
        borderColor: '#6B7280'
    },
    saveButton: {
        backgroundColor: '#37D67A'
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    saveButtonText: {
        color: '#FFFFFF'
    }
});
