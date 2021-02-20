<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request) {

        $platform = request('platform');
        $receipt = request('transactionReceipt');
        $purchase_token = request('purchaseToken');
        $order_id = request('orderId');

        $user = $request->user();
        $this->verifySubscription($user, $platform, $purchase_token, $order_id, $receipt);

        return 'ok';
    }


    private function sendRequest($url, $req_body) {
        $response = Http::withBody($req_body, 'application/json')->post($url);
        $response_data = $response->json();

        return $response_data;
    }


    private function verifySubscription($user, $platform, $purchase_token, $order_id, $receipt = null) {
        $apple_iap_shared_secret = config('services.apple_iap.shared_secret');
        $apple_iap_live_url = config('services.apple_iap.live_url');
        $apple_iap_sandbox_url = config('services.apple_iap.sandbox_url');

        if ($platform === 'ios') {

            $req_body = json_encode([
                'receipt-data' => $receipt,
                'password' => $apple_iap_shared_secret,
                'exclude-old-transactions' => true
            ]);

            $response_data = $this->sendRequest($apple_iap_live_url, $req_body);
            if ($response_data['status'] === 21007) {
                $response_data = $this->sendRequest($apple_iap_sandbox_url, $req_body);
            }

            $latest_receipt_info = $response_data['latest_receipt_info'][0];
            $expire_in_ms = (int) $latest_receipt_info['expires_date_ms'];
            $expire = $expire_in_ms / 1000;
            $current_timestamp = now()->timestamp;

            if ($current_timestamp < $expire) {
                $user->update([
                    'datetime_subscribed' => now(),
                    'lastpayment_datetime' => now()->toDateTimeString(),
                    'apple_order_id' => $latest_receipt_info['transaction_id']
                ]);
            }

        } else if ($platform === 'android') {
            $gplay_data = [
                'gplay_order_token' => $purchase_token,
                'gplay_order_id' => $order_id,
            ];

            $user->update($gplay_data);
        }
    }
}
