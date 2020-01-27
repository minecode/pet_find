import React from 'react';
import {
	StatusBar,
	View,
	Picker,
	Text,
	Image,
	ScrollView,
	Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../style';
import { Card } from 'react-native-elements';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

class SearchScreen extends React.Component {
	state = {
		location: null,
		distance: '',
		time: '',
		animals: [
			{
				location: 'São João da Madeira',
				date: '15/1/2020',
				avatar:
					'https://www.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg',
				contact: '913965017'
			},
			{
				location: 'Ovar',
				date: '10/1/2020',
				avatar: 'https://i.ytimg.com/vi/MPV2METPeJU/maxresdefault.jpg',
				contact: '913965017'
			},
			{
				location: 'Santa Maria da Feira',
				date: '5/1/2020',
				avatar: 'https://www.dw.com/image/49202627_303.jpg',
				contact: '913965017'
			}
		]
	};

	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Permission to access location was denied'
			});
		}

		let location = await Location.getCurrentPositionAsync({});
		this.setState({ location });
	};

	componentDidMount() {
		if (!Constants.isDevice) {
			this.setState({
				errorMessage:
					'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
			});
		} else {
			this._getLocationAsync();
		}
	}

	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5ff' }}>
				<StatusBar
					translucent
					backgroundColor={'#f5f5ff'}
					barStyle='dark-content'
					animated
				/>
				<ScrollView>
					<View style={styles.container}>
						<View style={styles.row}>
							<Text
								style={{
									fontWeight: 'bold',
									fontSize: 20,
									color: '#FF9AA2'
								}}>
								Distância:{' '}
							</Text>
							<Picker
								selectedValue={this.state.distance}
								style={{ width: 150, color: '#526b78' }}
								onValueChange={(itemValue, itemIndex) =>
									this.setState({ distance: itemValue })
								}>
								<Picker.Item label='1 km' value='1' />
								<Picker.Item label='5 km' value='5' />
								<Picker.Item label='15 km' value='15' />
								<Picker.Item label='30 km' value='30' />
								<Picker.Item label='+50 km' value='50' />
							</Picker>
						</View>
						<View style={styles.row}>
							<Text
								style={{
									fontWeight: 'bold',
									fontSize: 20,
									color: '#FF9AA2'
								}}>
								Últimos:{' '}
							</Text>
							<Picker
								selectedValue={this.state.time}
								style={{ width: 150, color: '#526b78' }}
								onValueChange={(itemValue, itemIndex) =>
									this.setState({ time: itemValue })
								}>
								<Picker.Item label='15 dias' value='15' />
								<Picker.Item label='30 dias' value='30' />
								<Picker.Item label='2 meses' value='2' />
								<Picker.Item label='6 meses' value='6' />
								<Picker.Item label='+ 1 ano' value='1' />
							</Picker>
						</View>

						{this.state.animals.map((a, i) => {
							return (
								<Card containerStyle={{ padding: 0 }} key={i}>
									<Image
										style={{ height: 300 }}
										resizeMode='cover'
										source={{ uri: a.avatar }}
									/>
									<Text
										style={{
											padding: 20,
											color: '#526b78'
										}}>
										Localizado em {a.location} em {a.date}.
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
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

export default SearchScreen;
