import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { IconButton, withTheme } from "react-native-paper";

import LockedStackScreen from "./LockedStackScreen";

const MainStack = createStackNavigator();

import config from "../config";

const MainStackScreen = ({ navigation, theme }) => {
	const { colors } = theme;

	return (
		<MainStack.Navigator>
			<MainStack.Screen
				name="MainStack"
				component={LockedStackScreen}
				options={{
					title: config.APP_TITLE,
					headerTitleStyle: {
						color: colors.primary,
					},
					headerRight: () => (
						<IconButton
							icon="menu"
							size={20}
							color={colors.white}
							onPress={() => navigation.openDrawer()}
						/>
					),
				}}
			/>
		</MainStack.Navigator>
	);
};

export default withTheme(MainStackScreen);
