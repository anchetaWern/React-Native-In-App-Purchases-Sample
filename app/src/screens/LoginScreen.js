import React, { useState, useCallback, useContext } from "react";
import { StyleSheet } from "react-native";

import { Button, TextInput, withTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { AuthContext } from "../context/AuthContext";

import config from "../config";

const LoginScreen = ({ navigation, theme }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [buttonloading, setButtonLoading] = useState(false);

	const { colors } = theme;

	const loginText = buttonloading ? "Logging in.." : "Login";

	const { signIn } = useContext(AuthContext);

	const login = useCallback(async () => {
		const device_name = "some device";
		setButtonLoading(true);

		try {
			const instance = axios.create({
				baseURL: `${config.BASE_URL}/api`,
				timeout: 3000,
			});

			const res = await instance.post(
				`${config.BASE_URL}/api/sanctum/token`,
				{
					email,
					password,
					device_name,
				}
			);

			if (res.data) {
				const ok = await SecureStore.isAvailableAsync();
				if (ok) {
					const { token, is_subscribed } = res.data;
					await SecureStore.setItemAsync("user_token", token);

					signIn({
						token,
						is_subscribed,
					});
				}

				setButtonLoading(false);
			}
		} catch (err) {
			setButtonLoading(false);
			alert(`Error occurred while trying to login: ${err}`);
		}
	}, [email, password]);

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<TextInput
				mode="outlined"
				style={styles.input}
				onChangeText={(text) => setEmail(text)}
				value={email}
				placeholder="Email"
				keyboardType="email-address"
			/>

			<TextInput
				mode="outlined"
				style={styles.input}
				onChangeText={(text) => setPassword(text)}
				value={password}
				placeholder="Password"
				secureTextEntry
			/>

			<Button
				mode="contained"
				onPress={login}
				style={styles.button}
				loading={buttonloading}
			>
				{loginText}
			</Button>
		</SafeAreaView>
	);
};

export default withTheme(LoginScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingRight: 30,
		paddingLeft: 30,
		flexDirection: "column",
		alignItems: "center",
	},
	input: {
		fontSize: 15,
		height: 40,
		width: "100%",
		marginBottom: 10,
		backgroundColor: "#F5F5F7",
	},
	button: {
		padding: 0,
		marginTop: 15,
		width: "100%",
		borderRadius: 20,
	},
});
