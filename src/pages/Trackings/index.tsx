import { useIsFocused } from "@react-navigation/native";
import useStorage from "../../hooks/useStorage";
import { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { constants } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import { ITracking } from "@/src/interfaces";
import { trackingRequest } from "@/src/utils/trackingRequest";
import { formatTrackingData } from "@/src/utils/formatTrackingData";
import { Tracking } from "@/src/components/tracking";

interface TrackingItemProps {
    navigation: any,
    tracking: {
        id: string
        name: string
        code: string
        delivered: boolean
    },
    firstItem: boolean
    lastItem: boolean
    disableButtons: boolean
    setDisableButtons: any
    handleDelete: any
    loadTrackings: any
}

function TrackingItem({ tracking, firstItem, lastItem, navigation, disableButtons, setDisableButtons, handleDelete, loadTrackings }: TrackingItemProps) {
    const [trackingData, setTrackingData] = useState({} as ITracking)
    const [trackinModalVisible, setTrackingModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleTrack = async () => {
        try {
            setIsLoading(true)
            setDisableButtons(true)

            if (!tracking.code) {
                setIsLoading(false)
                setDisableButtons(false)
                return
            }

            const trackingResponse = await trackingRequest(tracking.code)
            const trackingDataFormatted = formatTrackingData(trackingResponse)

            setTrackingData({
                ...trackingDataFormatted,
                id: tracking.id,
                name: tracking.name
            })
            setTrackingModalVisible(true)
            setDisableButtons(false)
            setIsLoading(false)
            return

        } catch (error) {
            console.log(JSON.stringify(error, null, 2))

            setIsLoading(false)
            setDisableButtons(false)
        }
    }

    return (
        <View style={[stylesItem.container, { marginTop: firstItem ? 14 : 0, marginBottom: lastItem ? 14 : 0 }]}>
            <View style={stylesItem.containerData}>
                <View style={stylesItem.icon}>
                    <Ionicons
                        size={20}
                        color={constants.colors.white}
                        name={tracking.delivered ? 'cube' : 'ellipsis-horizontal'}
                    />
                </View>

                <View>
                    <Text style={stylesItem.codeText}>{tracking.code}</Text>
                    <Text style={stylesItem.statusText}>{tracking.delivered ? 'Entregue' : 'Em trânsito'}</Text>
                    <Text style={stylesItem.nameText}>{tracking.name}</Text>
                </View>
            </View>

            <View style={stylesItem.actionButtonsGroup}>
                <TouchableOpacity onPress={handleTrack} disabled={disableButtons}>
                    {
                        isLoading ?
                            <ActivityIndicator color={constants.colors.white} />
                            :
                            <Ionicons
                                size={20}
                                color={constants.colors.white}
                                name={'eye-outline'}
                            />
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDelete} disabled={disableButtons}>
                    <Ionicons
                        size={20}
                        color={constants.colors.white}
                        name={'trash-bin-outline'}
                    />
                </TouchableOpacity>
            </View>

            <Modal visible={trackinModalVisible} animationType='fade' transparent={true}>
                <Tracking data={trackingData} handleClose={() => setTrackingModalVisible(false)} handleRefresh={loadTrackings} navigation={navigation} />
            </Modal>
        </View>
    )
}

const stylesItem = StyleSheet.create({
    container: {
        backgroundColor: constants.colors.black,
        borderRadius: 8,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerData: {
        flexDirection: 'row',
        gap: 25
    },
    codeText: {
        color: constants.colors.white,
        fontSize: 14,
        fontWeight: '500'
    },
    statusText: {
        color: constants.colors.white,
        fontWeight: '300'
    },
    nameText: {
        color: constants.colors.white,
        fontWeight: '100'
    },
    actionButtonsGroup: {
        flexDirection: 'row',
        gap: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export function Trackings({ navigation }: { navigation: any }) {
    const focused = useIsFocused()

    const [trackingsList, setTrackingsList] = useState([])
    const [trackingActionsDisable, setTrackingActionsDisable] = useState(false)

    const { getItem, removeItem } = useStorage()

    useEffect(() => {
        if (focused) {
            loadTrackings()
        }
    }, [focused])

    const loadTrackings = async () => {
        const trackings = await getItem('trackings')
        setTrackingsList(trackings.reverse())
    }

    const handleDelete = async (trackingId: string) => {
        const itemsUpdated = await removeItem('trackings', trackingId)
        setTrackingsList(itemsUpdated)
    }

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: 50 }}>
            <View style={styles.header}>
                <Text style={styles.title}>Meus rastreios</Text>
            </View>

            {
                trackingsList.length
                    ?
                    <View>
                        <FlatList
                            contentContainerStyle={{ gap: 14 }}
                            style={styles.list}
                            data={trackingsList}
                            keyExtractor={(tracking: any) => tracking.id}
                            renderItem={({ item: tracking, index }) => <TrackingItem tracking={tracking} loadTrackings={loadTrackings} handleDelete={async () => handleDelete(tracking.id)} firstItem={index === 0} lastItem={index === trackingsList.length - 1} navigation={navigation} disableButtons={trackingActionsDisable} setDisableButtons={setTrackingActionsDisable} />}
                        />
                    </View>
                    :
                    <View style={styles.noTrackingsContainer}>
                        <Text style={styles.noTrackingText}>Nenhum rastreio encontrado</Text >
                    </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: constants.colors.blue,
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: constants.colors.white,
        fontSize: 18,
        fontWeight: 'bold'
    },
    list: {
        paddingRight: 14,
        paddingLeft: 14,
        rowGap: 14
    },
    noTrackingsContainer: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    noTrackingText: {
        color: 'rgba(24, 24, 24, 0.3)',
    }
})