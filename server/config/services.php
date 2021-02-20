<?php

return [

    'google_cloud' => [
        'project_id' => env('GOOGLE_PROJECT_ID'),
        'config_path' => 'app/your-google-service-account-config.json',
    ],

    'apple_iap' => [
        'shared_secret' => env('APPLE_IAP_SECRET'),
        'live_url' => 'https://buy.itunes.apple.com/verifyReceipt',
        'sandbox_url' => 'https://sandbox.itunes.apple.com/verifyReceipt',
    ],

];
