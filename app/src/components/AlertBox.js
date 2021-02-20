import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { withTheme } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

const AlertBox = ({ text, theme }) => {
	const { colors } = theme;
	return (
		<View
			style={[
				styles.alert,
				{
					backgroundColor: colors.info,
				},
			]}
		>
			<Text style={[styles.alertText, { color: colors.white }]}>
				<Entypo
					name="info-with-circle"
					size={17}
					color={colors.white}
				/>
				{"  "}
				{text}
			</Text>
		</View>
	);
};

export default withTheme(AlertBox);

const styles = StyleSheet.create({
	alert: {
		padding: 15,
		marginBottom: 15,
		borderRadius: 10,
	},
	alertText: {
		fontSize: 13,
	},
});
