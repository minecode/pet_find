import React from 'react';
import TabNavigator from './Navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
	return (
		<SafeAreaProvider>
			<TabNavigator />
		</SafeAreaProvider>
	);
}
