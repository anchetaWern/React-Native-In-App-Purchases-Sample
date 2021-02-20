import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { withTheme } from "react-native-paper";

import LoginScreen from "./LoginScreen";

import config from "../config";

const HomeStack = createStackNavigator();

const HomeStackScreen = ({ navigation, theme }) => {
	const { colors } = theme;
	return (
		<HomeStack.Navigator>
			<HomeStack.Screen
				name="Login"
				component={LoginScreen}
				options={{
					title: config.APP_TITLE,
					headerLeft: null,
					headerTitleStyle: {
						color: colors.primary,
					},
				}}
			/>
		</HomeStack.Navigator>
	);
};

export default withTheme(HomeStackScreen);
