import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import {
    Alert,
    PermissionsAndroid,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { markers } from '../markers';

const initialRegion = {
    latitude: 3.0418, // Replace with your own coordinates
    longitude: 101.7931,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

const Location = () => {
    const mapRef = useRef<MapView>()
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={focusMap}>
                    <View style={{ padding: 10}}>
                        <Text style = {{fontWeight: "900", fontSize: 15}}>Focus</Text>
                    </View>
                </TouchableOpacity>
            ),
        });
    }, [])

    const focusMap = () => {
        const UTAR = {
            latitude: 3.0414040974427876, // Replace with your own coordinates
            longitude: 101.79376151729306,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
        mapRef.current?.animateCamera({ center: UTAR, zoom: 16.5 }, { duration: 3000 });
    };

    const onRegionChange = (region: Region) => {
        console.log(region);
    };

    const onMarkerSelected = (marker: any) => {
        Alert.alert(marker.name);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                showsUserLocation
                showsMyLocationButton
                onRegionChangeComplete={onRegionChange}
                // Can ignore the error
                ref={mapRef}>
                {markers.map((marker, index) => (
                    <Marker key={index} coordinate={marker}>
                        <Callout>
                            <View style={{ padding: 10 }}>
                                <Text style={{ fontSize: 20 }}>{marker.name}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ensures the container takes up the full screen
    },
    map: {
        ...StyleSheet.absoluteFillObject, // Ensures the map takes up the full screen
    },
});

export default Location;
