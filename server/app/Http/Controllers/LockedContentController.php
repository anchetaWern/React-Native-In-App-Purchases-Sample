<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LockedContentController extends Controller
{
    public function get()
    {
        return asset('images/doge-meme.jpg');
    }
}
