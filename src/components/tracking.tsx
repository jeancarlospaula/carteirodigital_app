import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { constants } from "../constants";
import { ITracking } from "../interfaces";
import { useState } from "react";
import useStorage from "../hooks/useStorage";

import { randomUUID } from 'expo-crypto';

interface TrackingProps {
    data: ITracking,
    navigation: any,
    handleClose: any,
    handleRefresh?: any
}

export function Tracking({ data, handleClose, handleRefresh, navigation }: TrackingProps) {
    const [trackingName, setTrackingName] = useState(data.name)
    const [errorText, setErrorText] = useState('')
    const { saveItem } = useStorage()

    const handleSaveTracking = async () => {
        try {
            setErrorText('')

            if (!trackingName?.trim()) {
                setErrorText('Nome obrigatório')
                return
            }

            const tracking = {
                id: data.id || randomUUID(),
                name: trackingName.trim(),
                code: data.code,
                delivered: data.delivered
            }

            await saveItem('trackings', tracking)

            if (handleRefresh) handleRefresh()
            setErrorText('')
            handleClose()
            navigation.navigate('trackings')
        } catch (error) {
            console.error('Erro ao salvar rastreio', error)
            setErrorText('Erro ao salvar rastreio. Tente novamente.')
            return
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.trackingBox}>
                <Text style={styles.title}>Rastreamento</Text>

                <Text style={styles.label}>Código</Text>
                <Text style={styles.trackingInfo}>{data.code}</Text>

                <Text style={styles.label}>Atualização</Text>
                <Text style={styles.trackingInfo}>{data.updatedAt}</Text>

                <Text style={styles.label}>Tipo de envio</Text>
                <Text style={styles.trackingInfo}>{data.packageType}</Text>

                <Text style={styles.label}>Origem</Text>
                <Text style={styles.trackingInfo}>{data.location}</Text>

                <Text style={data.delivered ? { display: 'none' } : styles.label}>Destino</Text>
                <Text style={data.delivered ? { display: 'none' } : styles.trackingInfo}>{data.destination}</Text>

                <Text style={styles.label}>Status</Text>
                <Text style={styles.trackingInfo}>{data.status}</Text>

                <TextInput
                    placeholder="Nome do rastreio"
                    maxLength={25}
                    style={errorText ? { ...styles.input, ...styles.inputError } : styles.input}
                    value={trackingName}
                    onChangeText={(value) => {
                        setTrackingName(value)
                        setErrorText('')
                    }}
                />

                <Text style={errorText ? styles.errorText : { display: 'none' }}>{errorText}</Text>

                <View style={styles.buttonsArea}>
                    <TouchableOpacity style={styles.returnButton} onPress={handleClose}>
                        <Text style={styles.returnButtonText}>Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveTracking()}>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(24, 24, 24, 0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    trackingBox: {
        backgroundColor: constants.colors.white,
        width: '80%',
        padding: 14,
        borderRadius: 8
    },
    title: {
        color: constants.colors.blue,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24
    },
    label: {
        color: constants.colors.blue
    },
    trackingInfo: {
        color: constants.colors.black,
        marginBottom: 12,
        fontWeight: 'bold'
    },
    input: {
        width: '100%',
        padding: 14,
        borderColor: constants.colors.blue,
        borderWidth: 2,
        borderRadius: 8,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red'
    },
    buttonsArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 12,
    },
    returnButton: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        borderColor: constants.colors.blue,
        borderWidth: 2
    },
    saveButton: {
        flex: 1,
        padding: 14,
        backgroundColor: constants.colors.blue,
        borderRadius: 8
    },
    returnButtonText: {
        textAlign: 'center',
        color: constants.colors.blue,
        fontWeight: 'bold'
    },
    saveButtonText: {
        textAlign: 'center',
        color: constants.colors.white,
        fontWeight: 'bold'
    }
})