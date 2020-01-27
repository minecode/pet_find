import React from 'react';
import {
	TextInput,
	Platform,
	TouchableOpacity,
	Text,
	View,
	ScrollView,
	StatusBar,
	Dimensions,
	Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../style';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Icon } from 'react-native-elements';
import { post } from '../../services/api';

class AddScreen extends React.Component {
	state = {
		contact: null,
		description: null,
		image: null,
		lat: null,
		long: null
	};

	_pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		});

		if (!result.cancelled) {
			this.setState({ image: result.uri });
		}
	};

	getPermissionAsync = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (status !== 'granted') {
			alert('Sorry, we need camera roll permissions to make this work!');
		}
	};

	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Permission to access location was denied'
			});
		}

		let location = await Location.getCurrentPositionAsync({});
		this.setState({
			lat: location.coords.latitude,
			long: location.coords.longitude
		});
	};

	submit = async () => {
		console.log(this.state);
	};

	componentDidMount() {
		this.getPermissionAsync();
	}

	render() {
		let { image } = this.state;
		return (
			<SafeAreaView
				style={{
					flex: 1,
					backgroundColor: '#f5f5ff'
				}}>
				<StatusBar
					translucent
					backgroundColor={'#f5f5ff'}
					barStyle='dark-content'
					animated
				/>
				<ScrollView>
					<View style={styles.container}>
						<View
							style={
								(styles.row,
								{ marginTop: 20, marginHorizontal: 20 })
							}>
							<Text
								style={{
									fontWeight: 'bold',
									fontSize: 20,
									color: '#FF9AA2'
								}}>
								Contacto
							</Text>
						</View>
						<View style={styles.row}>
							<TextInput
								ref={input => {
									this.contact = input;
								}}
								placeholder='Contacto'
								returnKeyType='next'
								onSubmitEditing={() => {
									this.description.focus();
								}}
								onChangeText={context => {
									this.setState({
										contact: context
									});
								}}
							/>
						</View>
						<View
							style={
								(styles.row,
								{ marginTop: 20, marginHorizontal: 20 })
							}>
							<Text
								style={{
									fontWeight: 'bold',
									fontSize: 20,
									color: '#FF9AA2'
								}}>
								Descrição
							</Text>
						</View>
						<View style={styles.row}>
							<TextInput
								multiline={true}
								style={{ textAlignVertical: 'top' }}
								numberOfLines={8}
								blurOnSubmit={false}
								ref={input => {
									this.description = input;
								}}
								placeholder='Descrição'
								returnKeyType='done'
								onSubmitEditing={() => {
									this.description.focus();
								}}
								onChangeText={context => {
									this.setState({
										description: context
									});
								}}
							/>
						</View>
						<View style={(styles.row, { alignItems: 'center' })}>
							<TouchableOpacity
								onPress={this._pickImage}
								style={{
									backgroundColor: '#B5EAD7',
									borderRadius: 25,
									height: 50,
									width: Dimensions.get('window').width - 40,
									alignItems: 'center',
									justifyContent: 'center'
								}}>
								<View style={styles.row}>
									<Icon
										name='image'
										type='font-awesome'
										color={'#526b78'}
									/>
									<Text style={{ color: '#526b78' }}>
										{' '}
										Carregar fotografia
									</Text>
								</View>
							</TouchableOpacity>
						</View>
						{image && (
							<View
								style={
									(styles.row,
									{
										alignItems: 'center',
										marginTop: 20,
										marginHorizontal: 20
									})
								}>
								<Image
									source={{ uri: image }}
									style={{
										width:
											Dimensions.get('window').width - 40,
										height:
											(Dimensions.get('window').width -
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
							}>
							<TouchableOpacity
								style={{
									backgroundColor: '#B5EAD7',
									borderRadius: 25,
									height: 50,
									width: Dimensions.get('window').width - 40,
									alignItems: 'center',
									justifyContent: 'center'
								}}
								onPress={async () => {
									await this._getLocationAsync();
									post('/api/lost/', this.state);
								}}>
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
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

export default AddScreen;
