<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',

        // add this:
        'gplay_order_token',
        'gplay_order_id',
        'apple_order_id',
        'datetime_subscribed',
        'lastpayment_datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];


    public function isSubscribed()
    {
        $one_month = now()->subDays(32);
        $is_subscribed = (!is_null($this->datetime_subscribed)) ? $this->datetime_subscribed->greaterThanOrEqualTo($one_month) : false;
        return $is_subscribed;
    }


    public function setSubscribed($stripe = [])
    {
        $this->datetime_subscribed = now();
        $this->lastpayment_datetime = now()->toDateTimeString();

        return $this;
    }


    public function setUnsubscribe()
    {
        $this->datetime_subscribed = null;
        $this->last_payment_date = null;
        return $this;
    }
}
