import React, { useState, useEffect } from "react";
import { StyleSheet, Platform } from "react-native";
import { Button, Card, withTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";
import { getProductsAsync, purchaseItemAsync } from "expo-in-app-purchases";
import axios from "axios";

import AlertBox from "../components/AlertBox";

import config from "../config";

const defaultAlertMessage =
	"Subscribing to this app will unlock something awesome.";

const AccountScreen = ({ navigation, theme }) => {
	const { colors } = theme;

	const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);
	const [subscribed, setSubscribed] = useState(false);

	const [subscribeButtonLoading, setSubscribeButtonLoading] = useState(false);

	const subscribeText = subscribeButtonLoading
		? "Subscribing..."
		: "Subscribe ($1 monthly)";

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
					setAlertMessage(" You are subscribed for $1/month.");
				}
			} catch (err) {
				alert("Problem ocurred while getting user info." + err);
			}
		})();
	}, []);

	const subscribe = async () => {
		setSubscribeButtonLoading(true);
		try {
			const items = Platform.select({
				ios: [config.IOS_SUBSCRIPTION_ID],
				android: [config.ANDROID_SUBSCRIPTION_ID],
			});

			const subscription_plan =
				Platform.OS === "android"
					? config.ANDROID_SUBSCRIPTION_ID
					: config.IOS_SUBSCRIPTION_ID;

			const products = await getProductsAsync(items);

			if (products.results.length > 0) {
				setSubscribeButtonLoading(false);
				await purchaseItemAsync(subscription_plan);
			} else {
				setSubscribeButtonLoading(false);
			}
		} catch (err) {
			setSubscribeButtonLoading(false);
			alert("error occured while trying to purchase: " + err);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Card style={[styles.card, { backgroundColor: colors.card }]}>
				<Card.Content>
					<AlertBox text={alertMessage} />
					{!subscribed && (
						<Button
							mode="contained"
							onPress={subscribe}
							style={[styles.button, { marginTop: 0 }]}
							loading={subscribeButtonLoading}
						>
							{subscribeText}
						</Button>
					)}
				</Card.Content>
			</Card>
		</SafeAreaView>
	);
};

export default withTheme(AccountScreen);

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
	button: {
		padding: 0,
		marginTop: 15,
		width: "100%",
		borderRadius: 20,
	},
});
