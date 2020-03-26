import React, { useEffect, useState } from 'react';
import TabNavigator from './Navigation';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { post } from './services/api';

export default function App() {
	SafeAreaView.setStatusBarHeight(0);
	const [lat, setLat] = useState(null);
	const [long, setLong] = useState(null);
	const [token, setToken] = useState(null);
	const [notification, setNotfication] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);

	const getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			setErrorMessage('Permission to access location was denied');
		}

		let location = await Location.getCurrentPositionAsync({});
		setLat(location.coords.latitude);
		setLong(location.coords.longitude);
	};

	const getNotificationAsync = async () => {
		const { status } = await Permissions.askAsync(
			Permissions.NOTIFICATIONS
		);
		// only asks if permissions have not already been determined, because
		// iOS won't necessarily prompt the user a second time.
		// On Android, permissions are granted on app installation, so
		// `askAsync` will never prompt the user

		// Stop here if the user did not grant permissions
		if (status !== 'granted') {
			alert('No notification permissions!');
			return;
		}

		// Get the token that identifies this device
		setToken(await Notifications.getExpoPushTokenAsync());
	};

	useEffect(() => {
		getNotificationAsync();
		getLocationAsync();
		const notificationSubscription = Notifications.addListener(
			handleNotification
		);
	}, []);

	const handleNotification = notification => {
		// do whatever you want to do with the notification
		console.log(notification);
	};

	useEffect(() => {
		if (lat !== null && long !== null && token !== null) {
			post('/api/pn/', {
				token: token,
				lat: lat,
				long: long
			})
				.then(response => {
					setNotfication(true);
				})
				.catch(error => {
					setErrorMessage(
						'Ocorreu um erro. Por favor, tente novamente mais tarde.'
					);
				});
		}
	}, [lat, long, token]);

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StatusBar backgroundColor='#B5EAD7' barStyle='dark-content' />
				<TabNavigator />
			</SafeAreaProvider>
		</View>
	);
}
