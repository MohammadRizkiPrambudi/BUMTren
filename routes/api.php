<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login/token', function (Request $request) {
    $request->validate([
        'email'       => 'required|email',
        'password'    => 'required',
        'device_name' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Credentials not match'], 401);
    }

    // Cek apakah user adalah kasir (role)
    if (! $user->hasRole('cashier')) {
        return response()->json(['message' => 'Access denied: Must be a cashier'], 403);
    }

    // Buat dan kembalikan token
    return response()->json([
        'token' => $user->createToken($request->device_name)->plainTextToken,
    ]);
});

// Endpoint yang dilindungi token
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/kasir/unit-data', [YourKasirController::class, 'getUnitData']);
    // ... endpoint transaksi POS lainnya
});