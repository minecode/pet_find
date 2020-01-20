import React from "react";
import { Text, StatusBar, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "react-native-elements";

class SearchScreen extends React.Component {
  state = {
    search: ""
  };

  updateSearch = search => {
    this.setState({ search });
  };
  render() {
    const { search } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          translucent
          backgroundColor={"transparent"}
          barStyle="dark-content"
          animated
        />
        <View style={{ paddingVertical: 20 }}>
          <SearchBar
            placeholder="Pesquisar"
            onChangeText={this.updateSearch}
            value={search}
            lightTheme
          />
        </View>
      </SafeAreaView>
    );
  }
}

class AddScreen extends React.Component {
  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Add!</Text>
      </SafeAreaView>
    );
  }
}

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Search: {
      screen: SearchScreen,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Pesquisar animal",
          tabBarIcon: ({ tintColor }) => (
            <Icon name="search" type="font-awesome" color={tintColor} />
          )
        };
      }
    },
    Settings: {
      screen: AddScreen,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Adicionar animal",
          tabBarIcon: ({ tintColor }) => (
            <Icon name="plus" type="font-awesome" color={tintColor} />
          )
        };
      }
    }
  },
  {
    activeColor: "#526b78",
    inactiveColor: "#f5f5ff",
    shifting: false,
    barStyle: { backgroundColor: "#A9DEF9" }
  }
);

export default createAppContainer(TabNavigator);
