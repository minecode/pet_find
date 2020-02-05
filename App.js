import React from 'react';
import TabNavigator from './Navigation';
import { StatusBar, View, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
	SafeAreaView.setStatusBarHeight(0);

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StatusBar backgroundColor='#B5EAD7' barStyle='dark-content' />
				<TabNavigator />
			</SafeAreaProvider>
		</View>
	);
}
