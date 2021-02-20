import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const LockedStack = createStackNavigator();

import LockedScreen from "./LockedScreen";

const CalcStackScreen = ({ navigation }) => {
	return (
		<LockedStack.Navigator headerMode="none">
			<LockedStack.Screen name="Locked" component={LockedScreen} />
		</LockedStack.Navigator>
	);
};

export default CalcStackScreen;
