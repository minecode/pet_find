import React, { useState, useEffect } from 'react';
import {
	View,
	Picker,
	Text,
	Image,
	ScrollView,
	RefreshControl,
	ActivityIndicator,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import styles from '../../style';
import { Card } from 'react-native-elements';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { get } from '../../services/api';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import { setTestDeviceIDAsync } from 'expo-ads-admob';
import { SafeAreaView } from 'react-navigation';

function SearchScreen(props) {
	SafeAreaView.setStatusBarHeight(0);

	function wait(timeout) {
		return new Promise(resolve => {
			setTimeout(resolve, timeout);
		});
	}

	const [prev, setPrev] = useState(null);
	const [next, setNext] = useState(null);
	const [link, setLink] = useState(null);
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
			link == null
				? '/api/list/' +
						lat +
						'/' +
						long +
						'/' +
						time +
						'/' +
						distance +
						'/' +
						type +
						'/' +
						'time/'
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

	const onRefresh = React.useCallback(() => {
		setLoading(true);
		setRefreshing(true);
		setLink(null);
		setNext(null);
		setPrev(null);
		setLoading(false);
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
	}, [lat, long, distance, time, type, refreshing, link]);

	const { navigate } = props.navigation;

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
			<View>
				<Modal
					isVisible={false}
					coverScreen={false}
					backdropColor={'white'}
					backdropOpacity={0.8}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<ActivityIndicator size='large' color='#526b78' />
						<Text style={{ color: '#526b78' }}> A carregar...</Text>
					</View>
				</Modal>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={loading}
							onRefresh={onRefresh}
						/>
					}
				>
					<View style={styles.container}>
						<View style={styles.row}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between'
								}}
							>
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
									}}
								>
									{' '}
									Animal:{' '}
								</Text>
							</View>
							<Picker
								selectedValue={type}
								style={{ width: 150, color: '#526b78' }}
								onValueChange={(itemValue, itemIndex) => {
									setType(itemValue);
								}}
							>
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
						<View style={styles.row}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between'
								}}
							>
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
									}}
								>
									{' '}
									Distância:{' '}
								</Text>
							</View>
							<Picker
								selectedValue={distance}
								style={{ width: 150, color: '#526b78' }}
								onValueChange={(itemValue, itemIndex) => {
									setDistance(itemValue);
								}}
							>
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
								}}
							>
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
									}}
								>
									{' '}
									Últimos:{' '}
								</Text>
							</View>
							<Picker
								selectedValue={time}
								style={{ width: 150, color: '#526b78' }}
								onValueChange={(itemValue, itemIndex) => {
									setTime(itemValue);
								}}
							>
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
									<Card
										key={i}
										containerStyle={{ padding: 0 }}
									>
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
											}}
										>
											Localizado a {a.distance} km à{' '}
											{a.time}.
										</Text>
										<View
											style={[
												styles.row,
												{
													justifyContent:
														'space-between',
													margin: 0,
													paddingVertical: 20
												}
											]}
										>
											<Text
												style={{
													color: '#526b78',
													fontWeight: 'bold'
												}}
											>
												Contacto: {a.contact}
											</Text>
											<TouchableOpacity
												onPress={() => {
													navigate('Detail', {
														animal: a
													});
												}}
												style={{
													backgroundColor: '#B5EAD7',
													borderRadius: 25,
													height: 50,
													width: 100,
													alignItems: 'center',
													justifyContent: 'center'
												}}
											>
												<View
													style={{
														flexDirection: 'row',
														alignItems: 'center'
													}}
												>
													<Icon
														name='eye'
														type='font-awesome'
														color={'#526b78'}
													/>
													<Text
														style={{
															color: '#526b78'
														}}
													>
														{' '}
														Ver
													</Text>
												</View>
											</TouchableOpacity>
										</View>
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
										width:
											Dimensions.get('window').width - 40,
										alignItems: 'center',
										justifyContent: 'center'
									})
								}
							>
								<Text
									style={{
										fontWeight: 'bold',
										fontSize: 20,
										color: '#526b78'
									}}
								>
									Nenhum resultado na pesquisa!
								</Text>
							</View>
						)}
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-around'
							}}
						>
							{prev && (
								<TouchableOpacity
									onPress={() => {
										setLink(prev);
									}}
									style={{
										borderRadius: 25,
										height: 50,
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<Icon
										name='arrow-left'
										type='font-awesome'
										color={'#526b78'}
									/>
								</TouchableOpacity>
							)}
							{next && (
								<TouchableOpacity
									onPress={() => {
										setLink(next);
									}}
									style={{
										borderRadius: 25,
										height: 50,
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<Icon
										name='arrow-right'
										type='font-awesome'
										color={'#526b78'}
									/>
								</TouchableOpacity>
							)}
						</View>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

export default SearchScreen;
