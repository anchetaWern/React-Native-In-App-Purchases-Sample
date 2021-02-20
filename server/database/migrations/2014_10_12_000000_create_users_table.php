<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');

            // $table->timestamp('email_verified_at')->nullable(); // remove this

            // add these:
            $table->string('gplay_order_token')->nullable();
            $table->string('gplay_order_id')->nullable();
            $table->string('apple_order_id')->nullable();

            $table->dateTime('datetime_subscribed')->nullable();
            $table->dateTime('lastpayment_datetime')->nullable();

            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
