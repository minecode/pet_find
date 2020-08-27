import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import * as Google from 'expo-google-app-auth';
import * as ExpoGoogleSignIn from 'expo-google-sign-in';
import styles from '../../style';
import { Icon } from 'react-native-elements';
import {
	ANDROID_CLIENT_ID,
	ANDROID_STANDALONE_APP_CLIENT_ID,
} from 'react-native-dotenv';
import { StackActions, NavigationActions } from 'react-navigation';
import { post } from '../../services/api';

function GoogleButton(props) {
	const [loginError, setLoginError] = useState(null);
	const { width } = Dimensions.get('window');

	async function setUser(response) {
		// if (response.data.dataBase_user !== undefined) {
		// 	await AsyncStorage.setItem(
		// 		'@pet_find:user',
		// 		response.data.dataBase_user._id
		// 	);
		// 	await AsyncStorage.setItem(
		// 		'@pet_find:username',
		// 		response.data.dataBase_user.name
		// 	);
		// } else {
		// 	await AsyncStorage.setItem(
		// 		'@pet_find:user',
		// 		response.data.new_user._id
		// 	);
		// 	await AsyncStorage.setItem(
		// 		'@pet_find:username',
		// 		response.data.new_user.name
		// 	);
		// }

		if (response.data?.email) {
			await AsyncStorage.setItem('@pet_find:user', response.data.email);
		}
		if (response.data?.name) {
			await AsyncStorage.setItem(
				'@pet_find:username',
				response.data.name
			);
		}

		// setLoading(false);
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Home' })],
		});
		props.navigation.dispatch(resetAction);
	}

	const signInMobile = async () => {
		if (__DEV__) {
			try {
				const { type, accessToken, user } = await Google.logInAsync({
					androidClientId: String(ANDROID_CLIENT_ID),
					androidStandaloneAppClient: String(
						ANDROID_STANDALONE_APP_CLIENT_ID
					),
				});
				if (type === 'success') {
					await post('/api/rest-auth/google/', {
						access_token: accessToken,
					})
						.then(async (response1) => {
							await AsyncStorage.setItem(
								'@pet_find:token',
								response1.data.token
							);
							let token = await AsyncStorage.getItem(
								'@pet_find:token'
							);
							await post(
								'/api/login/',
								{
									email: user.email,
									name: user.name,
									photo: user.photoUrl,
									user_type: 'user',
								},
								token
							)
								.then(async (response2) => {
									await setUser(response2);
								})
								.catch((error2) => {
									console.log(error2);
									setLoginError(
										'Authentication fail code: 1'
									);
								});
						})
						.catch((error1) => {
							console.log(error1);
							//setLoading(false);
							setLoginError('Authentication fail code: 0');
						});
				} else {
					//setLoading(false);
					console.log('cancelled');
				}
			} catch (e) {
				//setLoading(false);
				console.log('error', e);
			}
		} else {
			try {
				await ExpoGoogleSignIn.askForPlayServicesAsync();
				const { type, user } = await ExpoGoogleSignIn.signInAsync();
				if (type === 'success') {
					//setLoading(true);
					await post('/auth/googleLogin/', { user })
						.then(async (response) => {
							await setUser(response);
						})
						.catch((error) => {
							//setLoading(false);
							setLoginError('Authentication fail code: 0');
						});
				} else {
					setLoginError('Authentication fail code: 1');
					//setLoading(false);
				}
			} catch (err) {
				setLoginError('Authentication fail code: 2' + err.message);
				//setLoading(false);
			}
		}
	};

	return (
		<>
			<View style={[styles.row, { justifyContent: 'center' }]}>
				<TouchableOpacity
					style={{
						backgroundColor: '#142850',
						height: 50,
						width: width - 30,
						borderRadius: 25,
						marginLeft: 10,
						marginRight: 10,
						marginVertical: 10,
						alignItems: 'center',
						justifyContent: 'center',
						shadowOffset: {
							width: 0,
							height: 1,
						},
						shadowOpacity: 0.8,
						shadowRadius: 2,
						elevation: 5,
						flexDirection: 'row',
					}}
					onPress={async () => {
						await signInMobile();
					}}
				>
					<Icon
						name='google'
						color={'white'}
						type='font-awesome'
						iconStyle={{ margin: 10 }}
					/>
					<Text
						style={{
							color: 'white',
							margin: 5,
							fontWeight: 'bold',
						}}
					>
						Sign in with google
					</Text>
				</TouchableOpacity>
			</View>
		</>
	);
}

function LoginScreen(props) {
	async function initAsync() {
		await ExpoGoogleSignIn.initAsync();
	}

	useEffect(() => {
		if (!__DEV__) {
			initAsync();
		} else {
		}
	});

	return (
		<SafeAreaView>
			<>
				<GoogleButton navigation={props.navigation} />
			</>
		</SafeAreaView>
	);
}

export default LoginScreen;
