import React, { useEffect, useState, useReducer, useMemo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import * as SecureStore from "expo-secure-store";
import axios from "axios";

import config from "./config";

import {
	NavigationContainer,
	DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import { DrawerContent } from "./components/DrawerContent";

import SplashScreen from "./screens/SplashScreen";

import HomeStackScreen from "./screens/HomeStackScreen";

import MainStackScreen from "./screens/MainStackScreen";
import AccountStackScreen from "./screens/AccountStackScreen";

import { AuthContext } from "./context/AuthContext";

const theme = {
	...DefaultTheme,
	dark: true,
	roundness: 10,
	colors: {
		...DefaultTheme.colors,
		background: "#F6F8FA",
		primary: "#333",
		info: "#BFD9EC",
	},
	fonts: {
		...DefaultTheme.fonts,
		regular: 15,
	},
};

const MainStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
	const [loading, setLoading] = useState(true);

	const [state, dispatch] = useReducer(
		(prevState, action) => {
			switch (action.type) {
				case "RESTORE_TOKEN":
					return {
						...prevState,
						userToken: action.token,
						isLoading: false,
						isSubscribed: action.is_subscribed,
					};

				case "SIGN_IN":
					return {
						...prevState,
						userToken: action.token,
						isSubscribed: action.is_subscribed,
					};

				case "LOGOUT":
					return {
						...prevState,
						userToken: null,
						isLoading: false,
					};
			}
		},
		{
			isLoading: true,
			userToken: null,
		}
	);

	useEffect(() => {
		(async () => {
			try {
				const token = await SecureStore.getItemAsync("user_token");

				if (token) {
					const instance = axios.create({
						baseURL: `${config.BASE_URL}/api/`,
						timeout: 5000,
						headers: { Authorization: `Bearer ${token}` },
					});

					const res = await instance.get("/user");
					const is_subscribed = res.data.is_subscribed == "yes";

					dispatch({ type: "RESTORE_TOKEN", token, is_subscribed });
				}

				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
		})();
	}, []);

	const authContext = useMemo(
		() => ({
			signIn: (data) => {
				dispatch({
					type: "SIGN_IN",
					token: data.token,
					is_subscribed: data.is_subscribed,
				});
			},
			signOut: async () => {
				try {
					const token = await SecureStore.getItemAsync("user_token");

					const instance = axios.create({
						baseURL: `${config.BASE_URL}/api`,
						timeout: 5000,
						headers: { Authorization: `Bearer ${token}` },
					});

					const signout_res = await instance.post("/signout");

					await SecureStore.deleteItemAsync("user_token");

					dispatch({ type: "LOGOUT" });
				} catch (err) {}
			},
		}),
		[]
	);

	if (loading) {
		return (
			<SplashScreen
				bgColor={theme.colors.background}
				color={theme.colors.primary}
			/>
		);
	}

	return (
		<PaperProvider theme={theme}>
			<AuthContext.Provider value={authContext}>
				<NavigationContainer theme={theme}>
					<Drawer.Navigator
						title="app-drawer"
						drawerPosition="right"
						edgeWidth={-1}
						drawerContent={(props) => {
							if (state.userToken) {
								return <DrawerContent {...props} />;
							}
							return null;
						}}
					>
						{state.userToken === null && (
							<Drawer.Screen
								name="HomeStack"
								component={HomeStackScreen}
							/>
						)}

						<React.Fragment>
							{state.userToken !== null && (
								<React.Fragment>
									<Drawer.Screen
										name="MainStack"
										component={MainStackScreen}
									/>
									<Drawer.Screen
										name="AccountStack"
										component={AccountStackScreen}
									/>
								</React.Fragment>
							)}
						</React.Fragment>
					</Drawer.Navigator>
				</NavigationContainer>
			</AuthContext.Provider>
		</PaperProvider>
	);
};

export default App;
