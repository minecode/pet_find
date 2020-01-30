import React from 'react';
import TabNavigator from './Navigation';
import { SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TabNavigator />
		</SafeAreaView>
	);
}
