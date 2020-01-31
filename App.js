import React from 'react';
import TabNavigator from './Navigation';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
	return (
		<View style={{ flex: 1 }}>
			<StatusBar
				backgroundColor='#B5EAD7'
				translucent
				barStyle='dark-content'
			/>
			<SafeAreaProvider>
				<TabNavigator />
			</SafeAreaProvider>
		</View>
	);
}
