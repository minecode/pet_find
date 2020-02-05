import React, { useState, useEffect } from 'react';
import {
	TextInput,
	TouchableOpacity,
	Text,
	View,
	ScrollView,
	StatusBar,
	Dimensions,
	Image,
	Picker,
	ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../style';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Icon } from 'react-native-elements';
import { post } from '../../services/api';
import Modal from 'react-native-modal';
import { setTestDeviceIDAsync, AdMobBanner } from 'expo-ads-admob';
import { SafeAreaView } from 'react-navigation';

function AddScreen(props) {
	const [contact, setContact] = useState(null);
	const [description, setDescription] = useState(null);
	const [uri, setUri] = useState(null);
	const [lat, setLat] = useState(null);
	const [long, setLong] = useState(null);
	const [type, setType] = useState(null);
	const [name, setName] = useState(null);
	const [contactError, setContactError] = useState(null);
	const [imageError, setImageError] = useState(null);
	const [typeAdd, setTypeAdd] = useState('lost');
	const [added, setAdded] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);
	const [loading, setLoading] = useState(false);

	const takeImage = async () => {
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		});
		if (!result.cancelled) {
			const dots = result.uri.split('.');
			const slashes = result.uri.split('/');
			const mime =
				dots[dots.length - 1] === 'jpg'
					? 'jpeg'
					: dots[dots.length - 1];
			setUri(result.uri);
			setType('image/' + mime);
			setName(slashes[slashes.length - 1]);
		}
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		});

		if (!result.cancelled) {
			const dots = result.uri.split('.');
			const slashes = result.uri.split('/');
			const mime =
				dots[dots.length - 1] === 'jpg'
					? 'jpeg'
					: dots[dots.length - 1];
			setUri(result.uri);
			setType('image/' + mime);
			setName(slashes[slashes.length - 1]);
		}
	};

	const getPermissionAsync = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (status !== 'granted') {
			alert('Sorry, we need camera roll permissions to make this work!');
		}
	};

	const getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			setErrorMessage('Permission to access location was denied');
		}

		let location = await Location.getCurrentPositionAsync({});
		setLat(location.coords.latitude);
		setLong(location.coords.longitude);
	};

	useEffect(() => {
		setTestDeviceIDAsync('EMULATOR');
		getPermissionAsync();
		getLocationAsync();
	}, []);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
			<View>
				<Modal
					isVisible={loading}
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
						<Text style={{ color: '#526b78' }}>
							{' '}
							A enviar dados...
						</Text>
					</View>
				</Modal>
				<ScrollView>
					<View style={styles.container}>
						{errorMessage && (
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
										color: '#FF9AA2',
										textAlign: 'center'
									}}
								>
									{errorMessage}
								</Text>
							</View>
						)}
						{added && (
							<>
								<View
									style={
										(styles.row,
										{
											marginVertical: 20,
											marginHorizontal: 20,
											borderRadius: 25,
											height: 50,
											width:
												Dimensions.get('window').width -
												40,
											alignItems: 'center',
											justifyContent: 'center'
										})
									}
								>
									{typeAdd === 'adoption' && (
										<Text
											style={{
												fontWeight: 'bold',
												fontSize: 20,
												color: '#526b78',
												textAlign: 'center'
											}}
										>
											Novo animal para adoção adicionado!
										</Text>
									)}
									{typeAdd === 'lost' && (
										<Text
											style={{
												fontWeight: 'bold',
												fontSize: 20,
												color: '#526b78',
												textAlign: 'center'
											}}
										>
											Novo animal perdido adicionado!
										</Text>
									)}
									{typeAdd === 'findings' && (
										<Text
											style={{
												fontWeight: 'bold',
												fontSize: 20,
												color: '#526b78',
												textAlign: 'center'
											}}
										>
											Novo animal encontrado adicionado!
										</Text>
									)}
								</View>
								<View style={styles.row}>
									<TouchableOpacity
										onPress={() => setAdded(false)}
										style={{
											backgroundColor: '#B5EAD7',
											borderRadius: 25,
											height: 50,
											width:
												Dimensions.get('window').width -
												40,
											alignItems: 'center',
											justifyContent: 'center'
										}}
									>
										<View style={styles.row}>
											<Icon
												name='plus'
												type='font-awesome'
												color={'#526b78'}
											/>
											<Text style={{ color: '#526b78' }}>
												{' '}
												Adiconar novo animal
											</Text>
										</View>
									</TouchableOpacity>
								</View>
							</>
						)}
						{!added && (
							<>
								<View style={styles.row}>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'flex-start'
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
										selectedValue={typeAdd}
										style={{ width: 150, color: '#526b78' }}
										onValueChange={(
											itemValue,
											itemIndex
										) => {
											setTypeAdd(itemValue);
										}}
									>
										<Picker.Item
											label='Perdido'
											value='lost'
										/>
										<Picker.Item
											label='Encontrado'
											value='findings'
										/>
										<Picker.Item
											label='Para adoção'
											value='adoption'
										/>
									</Picker>
								</View>
								<View
									style={
										(styles.row,
										{ marginTop: 20, marginHorizontal: 20 })
									}
								>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'flex-start'
										}}
									>
										<Icon
											name='address-book'
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
											Contacto:
										</Text>
									</View>
									{contactError && (
										<Text
											style={{
												color: 'red',
												marginVertical: 5
											}}
										>
											{contactError}
										</Text>
									)}
								</View>
								<View style={styles.row}>
									<TextInput
										placeholder='Contacto'
										returnKeyType='next'
										onChangeText={context => {
											setContact(context);
										}}
									/>
								</View>
								<View
									style={
										(styles.row,
										{ marginTop: 20, marginHorizontal: 20 })
									}
								>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'flex-start'
										}}
									>
										<Icon
											name='search'
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
											Descrição:
										</Text>
									</View>
								</View>
								<View style={styles.row}>
									<TextInput
										multiline={true}
										style={{ textAlignVertical: 'top' }}
										numberOfLines={8}
										blurOnSubmit={false}
										placeholder='Descrição'
										returnKeyType='done'
										onChangeText={context => {
											setDescription(context);
										}}
									/>
								</View>
								<View
									style={
										(styles.row, { alignItems: 'center' })
									}
								>
									{imageError && (
										<Text
											style={{
												color: 'red',
												marginBottom: 5
											}}
										>
											{imageError}
										</Text>
									)}
									<View style={styles.row}>
										<TouchableOpacity
											onPress={pickImage}
											style={{
												backgroundColor: '#B5EAD7',
												borderRadius: 25,
												borderTopEndRadius: 0,
												borderBottomRightRadius: 0,
												height: 50,
												width:
													(Dimensions.get('window')
														.width -
														40) /
													2,
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<View
												style={[
													styles.row,
													{
														alignItems: 'center',
														justifyContent:
															'space-around'
													}
												]}
											>
												<Icon
													name='image'
													type='font-awesome'
													color={'#526b78'}
												/>
												<Text
													style={{
														color: '#526b78',
														textAlign: 'center'
													}}
												>
													{' '}
													Carregar fotografia
												</Text>
											</View>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => takeImage()}
											style={{
												backgroundColor: '#B5EAD7',
												borderRadius: 25,
												borderTopStartRadius: 0,
												borderBottomLeftRadius: 0,
												height: 50,
												width:
													(Dimensions.get('window')
														.width -
														40) /
													2,
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<View
												style={[
													styles.row,
													{
														alignItems: 'center',
														justifyContent:
															'space-around'
													}
												]}
											>
												<Icon
													name='camera'
													type='font-awesome'
													color={'#526b78'}
												/>
												<Text
													style={{
														color: '#526b78',
														textAlign: 'center'
													}}
												>
													{' '}
													Tirar fotografia
												</Text>
											</View>
										</TouchableOpacity>
									</View>
								</View>

								{uri && (
									<View
										style={
											(styles.row,
											{
												alignItems: 'center',
												marginTop: 20,
												marginHorizontal: 20
											})
										}
									>
										<Image
											source={{ uri: uri }}
											style={{
												width:
													Dimensions.get('window')
														.width - 40,
												height:
													(Dimensions.get('window')
														.width -
														40) *
													(3 / 4),
												borderRadius: 5
											}}
										/>
									</View>
								)}
								<View
									style={
										(styles.row,
										{ alignItems: 'center', marginTop: 20 })
									}
								>
									<TouchableOpacity
										style={{
											backgroundColor: '#B5EAD7',
											borderRadius: 25,
											height: 50,
											width:
												Dimensions.get('window').width -
												40,
											alignItems: 'center',
											justifyContent: 'center'
										}}
										onPress={async () => {
											setLoading(true);
											setErrorMessage(null);
											setContactError(null);
											setImageError(null);
											if (contact === null) {
												setContactError(
													'Este campo é obrigatório'
												);
											}
											if (uri === null) {
												setImageError(
													'Este campo é obrigatório'
												);
											}
											if (
												contact !== null &&
												uri !== null
											) {
												if (
													lat !== null &&
													long !== null
												) {
													post(
														'/api/' + typeAdd + '/',
														{
															contact: contact,
															description: description,
															lat: lat,
															long: long,
															uri: uri,
															name: name,
															type: type
														}
													)
														.then(response => {
															if (response.ok) {
																setAdded(true);
																setContact(
																	null
																);
																setDescription(
																	null
																);
																setUri(null);
															}
															setLoading(false);
														})
														.catch(error => {
															setErrorMessage(
																'Ocorreu um erro. Por favor, tente novamente mais tarde.'
															);
															setLoading(false);
														});
												}
											} else {
												setLoading(false);
											}
										}}
									>
										<View style={styles.row}>
											<Icon
												name='plus'
												type='font-awesome'
												color={'#526b78'}
											/>
											<Text style={{ color: '#526b78' }}>
												{' '}
												Adicionar
											</Text>
										</View>
									</TouchableOpacity>
								</View>
							</>
						)}
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

export default AddScreen;
