import React, { useState, useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import { Card, withTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";
import axios from "axios";

import AlertBox from "../components/AlertBox";

import config from "../config";

const LockedScreen = ({ navigation, theme }) => {
	const { colors } = theme;

	const [subscribed, setSubscribed] = useState(false);
	const [content, setContent] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const token = await SecureStore.getItemAsync("user_token");

				const instance = axios.create({
					baseURL: `${config.BASE_URL}/api`,
					timeout: 5000,
					headers: { Authorization: `Bearer ${token}` },
				});

				const res = await instance.get("/user");

				if (res.data.is_subscribed === "yes") {
					setSubscribed(true);
					const content_res = await instance.get("/locked");
					setContent(content_res.data);
				}
			} catch (err) {
				alert("Problem ocurred while getting user info.");
			}
		})();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<Card style={[styles.card, { backgroundColor: colors.card }]}>
				<Card.Content>
					{subscribed && (
						<Image
							resizeMode="contain"
							style={{ width: "100%", height: 200 }}
							source={{
								uri: content,
							}}
						/>
					)}
					{!subscribed && (
						<AlertBox text="You need to subscribe before you can access this content." />
					)}
				</Card.Content>
			</Card>
		</SafeAreaView>
	);
};

export default withTheme(LockedScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingRight: 30,
		paddingLeft: 30,
		flexDirection: "column",
	},
	card: {
		marginBottom: 20,
	},
});
