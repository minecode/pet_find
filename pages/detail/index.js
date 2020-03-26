import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import styles from '../../style';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob';
import { AD_MOB_UNIT_ID } from 'react-native-dotenv';

function DetailScreen(props) {
	const { navigation } = props;
	const [a, setA] = useState(null);
	useEffect(() => {
		setTestDeviceIDAsync('EMULATOR');
		setA(navigation.getParam('animal', null));
	}, []);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
			<View>
				<ScrollView>
					<AdMobBanner
						bannerSize='fullBanner'
						adUnitID={AD_MOB_UNIT_ID} // Test ID, Replace with your-admob-unit-id
						servePersonalizedAds // true or false
						bannerSize={'smartBannerLandscape'}
					/>
					<View style={styles.container}>
						{a && (
							<>
								<Image
									style={{
										height: 300,
										marginHorizontal: 20,
										borderRadius: 5
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

								{a.description != 'null' && (
									<Text
										style={{
											padding: 20,
											color: '#526b78'
										}}>
										{a.description}
									</Text>
								)}

								<Text
									style={{
										color: '#526b78',
										padding: 20,
										fontWeight: 'bold'
									}}>
									Contacto: {a.contact}
								</Text>

								<MapView
									provider={PROVIDER_GOOGLE}
									region={{
										latitude: a.lat,
										longitude: a.long,
										latitudeDelta: 0.0922,
										longitudeDelta: 0.0421
									}}
									style={{
										width: Dimensions.get('window').width,
										height:
											Dimensions.get('window').height -
											200
									}}>
									<Marker
										coordinate={{
											latitude: a.lat,
											longitude: a.long
										}}
									/>
								</MapView>
							</>
						)}
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

export default DetailScreen;
