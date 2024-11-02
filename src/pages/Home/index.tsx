import { constants } from '../../constants'
import { SafeAreaView, View, Image, StyleSheet, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'

import { Tracking } from '../../components/tracking'
import { ITracking } from '../../interfaces'
import { useEffect, useState } from 'react'
import { formatTrackingData } from '@/src/utils/formatTrackingData'
import { trackingRequest } from '@/src/utils/trackingRequest'
import { useIsFocused } from '@react-navigation/native'

export function Home({ navigation }: { navigation: any }) {
    const focused = useIsFocused()

    const [trackingCode, setTrackingCode] = useState('')
    const [trackingData, setTrackingData] = useState({} as ITracking)
    const [trackinModalVisible, setTrackingModalVisible] = useState(false)
    const [trackinButtonDisabled, setTrackinButtonDisabled] = useState(false)
    const [trackingError, setTrackingError] = useState('')

    useEffect(() => {
        setTrackingCode('')
    }, [focused])

    const handleTrack = async () => {
        try {
            setTrackingError('')
            setTrackinButtonDisabled(true)

            if (!trackingCode) {
                setTrackingError('Código obrigatório')
                setTrackinButtonDisabled(false)
                return
            }

            const trackingResponse = await trackingRequest(trackingCode)
            const trackingDataFormatted = formatTrackingData(trackingResponse)

            setTrackingData(trackingDataFormatted)
            setTrackingModalVisible(true)
            setTrackinButtonDisabled(false)
            setTrackingError('')
            return
        } catch (error) {
            console.log(JSON.stringify(error, null, 2))

            setTrackingError('Código inválido')
            setTrackinButtonDisabled(false)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />

                <TextInput
                    placeholder="Código de rastreio"
                    value={trackingCode}
                    style={trackingError ? { ...styles.input, ...styles.inputError } : styles.input}
                    onChangeText={(text) => {
                        setTrackingCode(text.trim())
                        setTrackingError('')
                    }}
                />

                <Text style={trackingError ? styles.errorText : { display: 'none' }}>{trackingError}</Text >

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleTrack}
                    disabled={trackinButtonDisabled}
                >
                    <Text style={styles.buttonText}>{trackinButtonDisabled ? <ActivityIndicator color={constants.colors.white} /> : 'Rastrear'}</Text>
                </TouchableOpacity>

                <Modal visible={trackinModalVisible} animationType='fade' transparent={true}>
                    <Tracking data={trackingData} handleClose={() => setTrackingModalVisible(false)} navigation={navigation} />
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 250,
        height: 250,
    },
    input: {
        width: '80%',
        padding: 14,
        borderColor: constants.colors.blue,
        borderWidth: 2,
        borderRadius: 8,
        marginTop: 24
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        width: '80%',
        color: 'red'
    },
    button: {
        width: '80%',
        padding: 14,
        backgroundColor: constants.colors.blue,
        borderRadius: 8,
        marginTop: 24
    },
    buttonText: {
        color: constants.colors.white,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})