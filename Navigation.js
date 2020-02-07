import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon } from 'react-native-elements';
import SearchScreen from './pages/search';
import AddScreen from './pages/add';
import Detail from './pages/detail';
import { createStackNavigator } from 'react-navigation-stack';

const TabNavigator = createMaterialBottomTabNavigator(
	{
		Search: {
			screen: SearchScreen,
			navigationOptions: ({ navigation }) => {
				return {
					title: 'Pesquisar animal',
					tabBarIcon: ({ tintColor }) => (
						<Icon
							name='search'
							type='font-awesome'
							color={tintColor}
						/>
					)
				};
			}
		},
		Add: {
			screen: AddScreen,
			navigationOptions: ({ navigation }) => {
				return {
					title: 'Adicionar animal',
					tabBarIcon: ({ tintColor }) => (
						<Icon
							name='plus'
							type='font-awesome'
							color={tintColor}
						/>
					)
				};
			}
		}
	},
	{
		activeColor: '#526b78',
		inactiveColor: '#f5f5ff',
		shifting: false,
		barStyle: { backgroundColor: '#B5EAD7' }
	}
);

const Stack = createStackNavigator({
	Home: {
		screen: TabNavigator,
		navigationOptions: {
			headerShown: false
		}
	},
	Detail: {
		screen: Detail,
		navigationOptions: {
			title: 'Detalhes',
			headerStyle: {
				backgroundColor: '#B5EAD7'
			},
			animationTypeForReplace: 'pop'
		}
	}
});

export default createAppContainer(Stack);
