import React, { useEffect } from 'react';
import { Text, View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import styles from '../../style';
import MapView, { Marker } from 'react-native-maps';

function Detail(props) {
	const { navigation } = props;
	const animal = navigation.getParam('animal', null);
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
			<View>
				<ScrollView>
					<View style={styles.container}>
						<MapView
							region={{
								latitude: animal.lat,
								longitude: animal.long,
								latitudeDelta: 0.0922,
								longitudeDelta: 0.0421
							}}
							style={{
								width: Dimensions.get('window').width,
								height: Dimensions.get('window').height
							}}
						>
							<Marker
								coordinate={{
									latitude: animal.lat,
									longitude: animal.long
								}}
							/>
						</MapView>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

export default Detail;
