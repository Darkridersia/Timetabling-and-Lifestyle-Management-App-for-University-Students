// Testing
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import {
    Alert,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { markers } from '../markers';

const initialRegion = {
    latitude: 3.1319, // Replace with your own coordinates
    longitude: 101.6841,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const Location = () => {
    const [region, setRegion] = useState(initialRegion);
    const mapRef = useRef<MapView>(null);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={getCurrentLocation}>
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontWeight: "900", fontSize: 15 }}>Get Location</Text>
                    </View>
                </TouchableOpacity>
            ),
        });
        requestFineLocationPermission();
    }, []);

    const requestFineLocationPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This app needs to access your precise location',
                        buttonPositive: 'OK',
                    },
                );
                console.log(`Permission granted: ${granted}`);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Do nothing here to avoid fetching location on screen load
                } else {
                    ToastAndroid.show('Location Permission Denied', ToastAndroid.SHORT);
                }
            } else {
                // For iOS (handled automatically)
                // Do nothing here to avoid fetching location on screen load
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const getCurrentLocation = () => {
        console.log('Attempting to get current location...');
        Geolocation.getCurrentPosition(
            position => {
                console.log('Location fetched successfully:', position);
                const { latitude, longitude } = position.coords;
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
    
                mapRef.current?.animateCamera({
                    center: {
                        latitude: latitude,
                        longitude: longitude,
                    },
                    pitch: 0,
                    heading: 0,
                    altitude: 1000, // Adjust this value to set the zoom level
                    zoom: 17, // Set the zoom level
                }, { duration: 1000 });
            },
            error => {
                console.error('Error fetching location:', error);
                Alert.alert('Error', 'Unable to fetch location');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
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
                initialRegion={region}
                showsUserLocation
                showsMyLocationButton
                onRegionChangeComplete={onRegionChange}
                ref={mapRef}
            >
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Location;
