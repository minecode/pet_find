import React, { useState, useEffect } from 'react';
import {
	StatusBar,
	View,
	Picker,
	Text,
	Image,
	ScrollView,
	RefreshControl,
	ActivityIndicator,
	Dimensions
} from 'react-native';
import styles from '../../style';
import { Card } from 'react-native-elements';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { get } from '../../services/api';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import {
	setTestDeviceIDAsync,
	AdMobBanner,
	AdMobInterstitial,
	PublisherBanner,
	AdMobRewarded
} from 'expo-ads-admob';

function SearchScreen(props) {
	function wait(timeout) {
		return new Promise(resolve => {
			setTimeout(resolve, timeout);
		});
	}

	const [refreshing, setRefreshing] = useState(true);
	const [lat, setLat] = useState(null);
	const [long, setLong] = useState(null);
	const [distance, setDistance] = useState('1');
	const [time, setTime] = useState('15');
	const [type, setType] = useState('findings');
	const [animals, setAnimals] = useState(null);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);

	const getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			setErrorMessage('Permission to access location was denied');
		}

		let location = await Location.getCurrentPositionAsync({});
		setLat(location.coords.latitude);
		setLong(location.coords.longitude);
	};

	const getAnimals = async () => {
		setLoading(true);
		get(
			'/api/list/' +
				lat +
				'/' +
				long +
				'/' +
				time +
				'/' +
				distance +
				'/' +
				type +
				'/'
		)
			.then(response => {
				setLoading(false);
				setAnimals(response.data.results);
			})
			.catch(error => {
				setLoading(false);
			});
	};

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
	}, [refreshing]);

	useEffect(() => {
		setTestDeviceIDAsync('EMULATOR');
		if (!Constants.isDevice) {
			setErrorMessage(
				'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
			);
		} else {
			getLocationAsync();
		}
	}, []);

	useEffect(() => {
		if (
			lat != null &&
			long != null &&
			distance != null &&
			time != null &&
			type != null
		) {
			getAnimals();
			setRefreshing(false);
		}
	}, [lat, long, distance, time, type, refreshing]);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: '#f3f3f3',
				paddingTop: 20
			}}>
			<AdMobBanner
				bannerSize='fullBanner'
				adUnitID='ca-app-pub-3081462140003126/6566616388' // Test ID, Replace with your-admob-unit-id
				// testDeviceID='EMULATOR'
				servePersonalizedAds // true or false
				onDidFailToReceiveAdWithError={this.bannerError}
			/>
			<Modal
				isVisible={loading}
				coverScreen={false}
				backdropColor={'white'}
				backdropOpacity={0.8}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
					<ActivityIndicator size='large' color='#526b78' />
					<Text style={{ color: '#526b78' }}> A carregar...</Text>
				</View>
			</Modal>
			<StatusBar
				translucent
				backgroundColor={'#B5EAD7'}
				barStyle='dark-content'
				animated
			/>

			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}>
				<View style={styles.container}>
					<View style={styles.row}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between'
							}}>
							<Icon
								name='paw'
								type='font-awesome'
								color={'#FF9AA2'}
							/>
							<Text
								style={{
									fontWeight: 'bold',
									fontSize: 20,
									color: '#FF9AA2'
								}}>
								{' '}
								Animal:{' '}
							</Text>
						</View>
						<Picker
							selectedValue={type}
							style={{ width: 150, color: '#526b78' }}
							onValueChange={(itemValue, itemIndex) => {
								setType(itemValue);
							}}>
							<Picker.Item label='Encontrado' value='findings' />
							<Picker.Item label='Perdido' value='lost' />
						</Picker>
					</View>
					<View style={styles.row}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between'
							}}>
							<Icon
								name='arrows'
								type='font-awesome'
								color={'#FF9AA2'}
							/>
							<Text
								style={{
									fontWeight: 'bold',
									fontSize: 20,
									color: '#FF9AA2'
								}}>
								{' '}
								Distância:{' '}
							</Text>
						</View>
						<Picker
							selectedValue={distance}
							style={{ width: 150, color: '#526b78' }}
							onValueChange={(itemValue, itemIndex) => {
								setDistance(itemValue);
							}}>
							<Picker.Item label='1 km' value='1' />
							<Picker.Item label='5 km' value='5' />
							<Picker.Item label='15 km' value='15' />
							<Picker.Item label='30 km' value='30' />
							<Picker.Item label='+50 km' value='50' />
						</Picker>
					</View>
					<View style={styles.row}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between'
							}}>
							<Icon
								name='hourglass-end'
								type='font-awesome'
								color={'#FF9AA2'}
							/>
							<Text
								style={{
									fontWeight: 'bold',
									fontSize: 20,
									color: '#FF9AA2'
								}}>
								{' '}
								Últimos:{' '}
							</Text>
						</View>
						<Picker
							selectedValue={time}
							style={{ width: 150, color: '#526b78' }}
							onValueChange={(itemValue, itemIndex) => {
								setTime(itemValue);
							}}>
							<Picker.Item label='15 dias' value='15' />
							<Picker.Item label='30 dias' value='30' />
							<Picker.Item label='2 meses' value='2' />
							<Picker.Item label='6 meses' value='6' />
							<Picker.Item label='+ 1 ano' value='1' />
						</Picker>
					</View>

					{animals &&
						!loading &&
						animals.map((a, i) => {
							return (
								<Card containerStyle={{ padding: 0 }} key={i}>
									<Image
										style={{
											height: 300
										}}
										resizeMode='cover'
										source={{
											uri: a.url
										}}
									/>
									<Text
										style={{
											padding: 20,
											color: '#526b78'
										}}>
										Localizado a {a.distance} km à {a.time}.
									</Text>
									<Text
										style={{
											padding: 20,
											color: '#526b78',
											fontWeight: 'bold'
										}}>
										Contacto: {a.contact}
									</Text>
								</Card>
							);
						})}
					{animals && !loading && animals.length === 0 && (
						<View
							style={
								(styles.row,
								{
									marginVertical: 20,
									marginHorizontal: 20,
									borderRadius: 25,
									height: 50,
									width: Dimensions.get('window').width - 40,
									alignItems: 'center',
									justifyContent: 'center'
								})
							}>
							<Text
								style={{
									fontWeight: 'bold',
									fontSize: 20,
									color: '#526b78'
								}}>
								Nenhum resultado na pesquisa!
							</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}

export default SearchScreen;
