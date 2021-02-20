<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Cloud\PubSub\PubSubClient;
use App\User;
use App\Jobs\SubscribeUser;

class PubsubController extends Controller
{
    public function subscribe()
    {
        $project_id = config('services.google_cloud.project_id');
        $config_path = config('service.google_cloud.config_path');

        $key_file = file_get_contents(storage_path($config_path));
        $pubsub = new PubSubClient([
            'projectId' => $project_id,
            'keyFile' => json_decode($key_file, true)
        ]);

        $req_body = file_get_contents('php://input');
        $req_data = json_decode($req_body, true);

        $data = json_decode(base64_decode($req_data['message']['data']), true);

        $purchase_token = $data['subscriptionNotification']['purchaseToken'];

        $pubsub->consume($req_data);

        SubscribeUser::dispatch($purchase_token)->delay(now()->addSeconds(5));

        return 'ok';
    }
}
