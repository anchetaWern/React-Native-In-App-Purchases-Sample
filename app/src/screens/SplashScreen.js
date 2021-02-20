import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const SplashScreen = ({ bgColor, color }) => {
	return (
		<View style={[styles.container, { backgroundColor: bgColor }]}>
			<ActivityIndicator size="large" color={color} />
		</View>
	);
};

export default SplashScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
