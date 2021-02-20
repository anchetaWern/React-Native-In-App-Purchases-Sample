import { registerRootComponent } from "expo";

import {
	connectAsync,
	setPurchaseListener,
	finishTransactionAsync,
	IAPResponseCode,
} from "expo-in-app-purchases";

import RNRestart from "react-native-restart";
import Toast from "react-native-simple-toast";
import * as SecureStore from "expo-secure-store";

import { Platform } from "react-native";
import axios from "axios";

import App from "./App";

import config from "./src/config";

(async function init() {
	try {
		await connectAsync();

		setPurchaseListener(async ({ responseCode, results, errorCode }) => {
			if (responseCode === IAPResponseCode.OK) {
				results.forEach(async (purchase) => {
					if (!purchase.acknowledged) {
						const {
							orderId,
							purchaseToken,
							acknowledged,
							transactionReceipt,
							productId,
						} = purchase;

						// in android, consumeItem should be set to false to acknowlege the purchase
						// in iOS this isn't needed because it's already specified in app store connect
						const consumeItem = Platform.OS === "ios";

						await finishTransactionAsync(purchase, consumeItem);

						Toast.show(
							"You're now subscribed! The app will now close to unlock all the functionality. All the functionality will be available once re-opened.",
							Toast.LONG
						);

						const token = await SecureStore.getItemAsync(
							"user_token"
						);

						const instance = axios.create({
							baseURL: `${config.BASE_URL}/api`,
							timeout: 5000,
							headers: { Authorization: `Bearer ${token}` },
						});

						instance.post("/subscribe2", {
							orderId,
							purchaseToken,
							transactionReceipt,
							platform: Platform.OS,
						});

						setTimeout(() => {
							RNRestart.Restart();
						}, 5000);
					}
				});
			} else {
				alert(generalErrorMessage);
			}

			if (responseCode === IAPResponseCode.USER_CANCELED) {
				alert("You cancelled. Please try again.");
			} else if (responseCode === IAPResponseCode.DEFERRED) {
				alert(
					"You don't have permission to subscribe. Please use a different account."
				);
			}
		});
	} catch (err) {
		alert("Error occurred: " + JSON.stringify(err));
	}
})();

registerRootComponent(App);
