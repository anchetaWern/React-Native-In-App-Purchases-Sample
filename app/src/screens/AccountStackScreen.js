import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { IconButton, withTheme } from "react-native-paper";

import AccountScreen from "./AccountScreen";
import config from "../config";

const AccountStack = createStackNavigator();

const AccountStackScreen = ({ navigation, theme }) => {
	const { colors } = theme;
	return (
		<AccountStack.Navigator>
			<AccountStack.Screen
				name="Account"
				component={AccountScreen}
				options={{
					title: config.APP_TITLE,
					headerTitleStyle: {
						color: colors.primary,
					},
					headerRight: () => (
						<IconButton
							icon="menu"
							size={20}
							onPress={() => navigation.openDrawer()}
						/>
					),
				}}
			/>
		</AccountStack.Navigator>
	);
};

export default withTheme(AccountStackScreen);
