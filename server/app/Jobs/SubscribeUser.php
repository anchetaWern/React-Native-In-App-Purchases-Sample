<?php


namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use App\Models\User;

class SubscribeUser implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $notification_type;
    private $purchase_token;

    public function __construct($notification_type, $purchase_token)
    {
        $this->notification_type = $notification_type;
        $this->purchase_token = $purchase_token;
    }

    public function handle()
    {
        $subscribe_codes = [1, 2, 4, 7];
        $unsubscribe_codes = [3, 5, 10, 12, 13];

        $user = User::where('gplay_order_token', $this->purchase_token)
            ->first();

        if ($user) {
            if (in_array($this->notification_type, $subscribe_codes)) {
                $user->setSubscribed()->save();
            }

            if (in_array($this->notification_type, $unsubscribe_codes)) {
                $user->setUnsubscribed()->save();
            }
        }
    }
}
