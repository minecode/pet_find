import React, { useState, useEffect } from 'react';
import {
	Text,
	View,
	ScrollView,
	Dimensions,
	Picker,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import styles from '../../style';
import MapView, {
	OverlayComponent,
	Marker,
	PROVIDER_GOOGLE
} from 'react-native-maps';
import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob';
import Modal from 'react-native-modal';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { get } from '../../services/api';
import { Icon } from 'react-native-elements';

export default function MapScreen(props) {
	const [initialLat, setInitialLat] = useState(null);
	const [initialLong, setInitialLong] = useState(null);
	const [lat, setLat] = useState(null);
	const [long, setLong] = useState(null);
	const [loading, setLoading] = useState(true);
	const [animals, setAnimals] = useState(null);
	const [type, setType] = useState('findings');
	const [prev, setPrev] = useState(null);
	const [next, setNext] = useState(null);
	const [link, setLink] = useState(null);
	const [changedInitial, setChangedInitial] = useState(false);
	const [changed, setChanged] = useState(false);
	const [latitudeDela, setLatitudeDelta] = useState(0.0922);
	const [longitudeDelta, setLongitudeDelta] = useState(0.0421);

	const getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			setErrorMessage('Permission to access location was denied');
		}

		let location = await Location.getCurrentPositionAsync({});
		setInitialLat(location.coords.latitude);
		setInitialLong(location.coords.longitude);
	};

	const getAnimals = async () => {
		setLoading(true);
		get(
			link == null
				? '/api/list/' +
						lat +
						'/' +
						long +
						'/1/5/' +
						type +
						'/' +
						'distance/'
				: '/api/' + link.split('/api/')[1]
		)
			.then(response => {
				setLoading(false);
				setAnimals(response.data.results);
				setNext(response.data.next);
				setPrev(response.data.previous);
			})
			.catch(error => {
				setLoading(false);
			});
	};

	useEffect(() => {
		if (initialLat != null && initialLong != null && !changedInitial) {
			setChangedInitial(true);
		}
	}, [initialLat, initialLong, link]);

	useEffect(() => {
		if (lat != null && long != null && !changed) {
			setChanged(true);
			getAnimals();
		}
	});

	useEffect(() => {
		setLoading(true);
		setTestDeviceIDAsync('EMULATOR');
		if (!Constants.isDevice) {
			setErrorMessage(
				'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
			);
		} else {
			getLocationAsync();
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		setLoading(true);
		getAnimals();
		setLoading(false);
	}, [type]);

	const { navigate } = props.navigation;

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
			<AdMobBanner
				bannerSize='fullBanner'
				adUnitID='ca-app-pub-7606799175531903/3809349277' // Test ID, Replace with your-admob-unit-id
				servePersonalizedAds // true or false
				bannerSize={'smartBannerLandscape'}
			/>

			{initialLat && initialLong && (
				<>
					<MapView
						onRegionChangeComplete={region => {
							if (initialLat !== region.latitude) {
								setInitialLat(region.latitude);
							}
							if (initialLong !== region.longitude) {
								setInitialLong(region.longitude);
							}
							setLatitudeDelta(region.latitudeDelta);
							setLongitudeDelta(region.longitudeDelta);
						}}
						onMapReady={async () => {
							setLat(initialLat);
							setLong(initialLong);
							await getAnimals();
						}}
						animateToRegion
						provider={PROVIDER_GOOGLE}
						region={{
							latitude: initialLat,
							longitude: initialLong,
							latitudeDelta: latitudeDela,
							longitudeDelta: longitudeDelta
						}}
						style={{
							height: Dimensions.get('window').height - 100
						}}>
						{animals &&
							animals.map((a, i) => {
								return (
									<Marker
										key={i}
										coordinate={{
											latitude: a.lat,
											longitude: a.long
										}}
										onPress={() => {
											navigate('Detail', {
												animal: a
											});
										}}>
										<Icon
											name='map-marker'
											type='font-awesome'
											color={'red'}
										/>
										<Text
											style={{
												backgroundColor: '#00000070',
												color: '#f3f3f3',
												padding: 10,
												borderRadius: 10
											}}>
											{a.contact}
										</Text>
									</Marker>
								);
							})}
					</MapView>
					{
						<View
							style={{
								...StyleSheet.absoluteFillObject,
								justifyContent: 'flex-end',
								alignItems: 'center'
							}}>
							<TouchableOpacity
								style={{
									backgroundColor: '#ffffff70',
									marginBottom: 20,
									padding: 15,
									borderRadius: 25,
									width:
										Dimensions.get('window').width *
										(2 / 3),
									alignItems: 'center'
								}}
								onPress={async () => {
									setLat(initialLat);
									setLong(initialLong);
									await getAnimals();
								}}>
								<Text style={{ color: '#526b78' }}>
									Porcurar nesta zona
								</Text>
							</TouchableOpacity>
							<View
								style={{
									backgroundColor: '#ffffff70',
									marginBottom: 20,
									paddingHorizontal: 15,
									borderRadius: 25,
									width:
										Dimensions.get('window').width * (2 / 3)
								}}>
								<Picker
									selectedValue={type}
									style={{
										height: 45,
										color: '#526b78'
									}}
									onValueChange={(itemValue, itemIndex) => {
										setType(itemValue);
									}}>
									<Picker.Item
										label='Encontrado'
										value='findings'
									/>
									<Picker.Item label='Perdido' value='lost' />
									<Picker.Item
										label='Para adoção'
										value='adoption'
									/>
								</Picker>
							</View>
						</View>
					}
				</>
			)}
		</SafeAreaView>
	);
}
