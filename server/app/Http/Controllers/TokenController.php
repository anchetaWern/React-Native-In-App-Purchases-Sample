<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class TokenController extends Controller
{
    public function get(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return [
            'is_subscribed' => $user->isSubscribed() ? "yes" : "no",
            'token' => $user->createToken($request->device_name)->plainTextToken,
            'email' => $user->email,
            'name' => $user->name,
        ];
    }
}
