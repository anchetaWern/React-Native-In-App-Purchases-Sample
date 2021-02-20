<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function get(Request $request)
    {
        $user = $request->user();
        $user->is_subscribed = $user->isSubscribed() ? 'yes' : 'no';
        return $user;
    }

    public function signout(Request $request)
    {
        $request->user()->tokens()->delete();
        return 'ok';
    }
}
